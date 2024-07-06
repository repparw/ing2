import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '../../services/comment-service.service';
import { UserService } from '../../services/user.service';
import { Pub } from '../../models/pub';
import { Comment } from '../../models/comment';
import { FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-crear-comentario',
    templateUrl: './crear-comentario.component.html',
    styleUrls: ['./crear-comentario.component.css']
})
export class CrearComentarioComponent implements OnInit {
    @Input() pubi!: Pub;
    comments: Comment[] = [];
    newComment = new FormControl('', Validators.required);
    showComments: boolean = false;
    currentUser: any;
    replyCommentId: number | null = null;
    replyCommentText = new FormControl('', Validators.required);
    isAdmin$: Observable<boolean> | undefined;

    constructor(private commentService: CommentService, private userService: UserService) {
        this.isAdmin$ = this.userService.isAdmin$;
    }

    ngOnInit(): void {
        this.userService.getCurrentUser().subscribe(user => {
            this.currentUser = user;
        });
    }

    loadComments(pubId: number): void {
        this.commentService.getComments(pubId).subscribe(
            comments => this.comments = comments,
            error => this.handleError('Error loading comments', error)
        );
    }

    addComment(): void {
        this.userService.getCurrentUser().subscribe(user => {
            if (!this.validatePublication()) return;

            this.userService.isOwner(this.pubi).subscribe(isOwner => {
                if (!isOwner) {
                    this.createComment(user);
                } else {
                    this.showError('No puedes comentar en tu propia publicación.');
                }
            }, error => this.handleError('Error verifying ownership', error));
        }, error => this.handleError('Error getting current user', error));
    }

    deleteComment(commentId: number): void {
        this.commentService.deleteComment(commentId).subscribe(() => {
            this.loadComments(this.pubi.id!);
        }, error => this.handleError('Error deleting comment', error));
    }

    replyToComment(commentId: number): void {
        const responseText = this.replyCommentText.value!;
        this.commentService.replyToComment(commentId, responseText).subscribe(() => {
            this.replyCommentText.reset('');
            this.loadComments(this.pubi.id!);
            this.replyCommentId = null;
        }, error => this.handleError('Error replying to comment', error));
    }

    private validatePublication(): boolean {
        if (!this.pubi || !this.pubi.user) {
            this.showError('La publicación no está definida o no tiene dueño.');
            return false;
        }
        return true;
    }

    private createComment(user: any): void {
        const comment: Comment = {
            pub: this.pubi.id!,
            user: user.id,
            text: this.newComment.value!
        };

        this.commentService.createComment(comment).subscribe(() => {
            this.newComment.reset('');
            this.loadComments(this.pubi.id!);
        }, error => this.handleError('Error creating comment', error));
    }

    private showError(message: string): void {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Entendido'
        });
    }

    private handleError(message: string, error: any): void {
        console.error(message, error);
        this.showError('Hubo un problema. Por favor, inténtalo de nuevo más tarde.');
    }

    toggleComments(pubId: number): void {
        this.showComments = !this.showComments;
        if (this.showComments) {
            this.loadComments(pubId);
        }
    }

    setReplyCommentId(commentId: number): void {
        this.replyCommentId = commentId;
    }

    clearReplyCommentId(): void {
        this.replyCommentId = null;
    }
}

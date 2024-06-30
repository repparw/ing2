import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '../../services/comment-service.service';
import { UserService } from '../../services/user.service';
import { Pub } from '../../models/pub';
import { Comment } from '../../models/comment';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-crear-comentario',
    templateUrl: './crear-comentario.component.html',
    styleUrls: ['./crear-comentario.component.css']
})
export class CrearComentarioComponent implements OnInit {
    @Input() pubi!: Pub;
    comments: Comment[] = [];
    newComment = new FormControl('', Validators.required);

    constructor(private commentService: CommentService, private userService: UserService) { }

    ngOnInit(): void {
        this.loadComments();
    }

    loadComments(): void {
        if (this.pubi && this.pubi.id) {
            this.commentService.getComments(this.pubi.id!).subscribe(comments => this.comments = comments);
        }
    }

    addComment(): void {
        this.userService.getCurrentUser().subscribe(user => {
            if (!this.userService.isOwner(this.pubi)) {
                const comment: Comment = {
                    pub: this.pubi.id!,
                    user: user.id,
                    text: this.newComment.value!

                };
                this.commentService.createComment(comment).subscribe(() => {
                    this.newComment.reset('');
                    this.loadComments();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'error',
                    text: 'No puedes comentar en tu propia publicación.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Entendido'
                });;
            }
        });
    }

}

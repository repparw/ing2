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
            if (!this.pubi || !this.pubi.user) {
                console.error('La publicación no está definida o no tiene dueño.');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La publicación no está definida o no tiene dueño.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            console.log('ID del dueño de la publicación:', this.pubi.user);
            console.log('ID del usuario actual:', user.id);

            this.userService.isOwner(this.pubi).subscribe(isOwner => {
                if (!isOwner) {
                    const comment: Comment = {
                        pub: this.pubi.id!,
                        user: user.id,
                        text: this.newComment.value!
                    };

                    this.commentService.createComment(comment).subscribe(() => {
                        this.newComment.reset('');
                        this.loadComments();
                    }, error => {
                        console.error('Error al crear el comentario:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Hubo un problema al intentar crear el comentario. Por favor, inténtalo de nuevo más tarde.',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Entendido'
                        });
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No puedes comentar en tu propia publicación.',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Entendido'
                    });
                }
            }, error => {
                console.error('Error al verificar si es propietario:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al verificar si eres propietario de la publicación. Por favor, inténtalo de nuevo más tarde.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Entendido'
                });
            });
        }, error => {
            console.error('Error al obtener el usuario actual:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al obtener tu información de usuario. Por favor, inténtalo de nuevo más tarde.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Entendido'
            });
        });
    }
}

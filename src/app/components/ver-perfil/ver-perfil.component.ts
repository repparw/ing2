import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Pub } from '../../models/pub';
import { PublicationService } from '../../services/publication.service';

@Component({
  selector: 'app-ver-perfil',
  templateUrl: './ver-perfil.component.html',
  styleUrls: ['./ver-perfil.component.css']
})
export class VerPerfilComponent implements OnInit {
  username!: string;
  publicaciones: any[] = [];
  user!: User;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private publicationService: PublicationService
  ) { }

  ngOnInit(): void {
    this.username = this.route.snapshot.params['username'];
    this.userService.getUserByUsername(this.username).subscribe(
      (user: User) => {
        this.user = user;
        this.loadPublications();
      },
      error => {
        console.error('Error fetching user data', error);
      }
    );
  }

  loadPublications(): void {
    this.publicationService.getPublicationsById(this.user.id).subscribe(
      data => {
        this.publicaciones = data;
      },
      error => {
        console.error('Error fetching publications', error);
      }
    );
  }
}

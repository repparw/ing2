import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service'
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Fedeteria';
  isEmployee$: Observable<boolean>;
  isAuthenticated$: Observable<boolean>;

  constructor (private userService: UserService){
    this.isAuthenticated$ = this.userService.isAuthenticated$;
    this.isEmployee$ = this.userService.isEmployee$;
  }

  ngOnInit(): void {
  }


  onLogout(): void {
    // Popup asking for confirmation
    // If confirmed, log out
    Swal.fire({
      title: "Confirmar",
      text: "¿Estás seguro de que deseas cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar"
    }).then((result) => {
      if (result.isConfirmed) {
          localStorage.removeItem('token');
          this.userService.logout();
      }
    });
  }
}

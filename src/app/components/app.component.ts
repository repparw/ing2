import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service'
import { Observable, of } from 'rxjs';

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
    const confirmLogout = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (confirmLogout) {
      localStorage.removeItem('token');
      this.userService.logout();
    };
  }

}

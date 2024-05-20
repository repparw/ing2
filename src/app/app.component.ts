import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Fedeteria';

  constructor (private userService: UserService){

  }


  isAuthenticated(){
    return this.userService.isAuthenticated()
  }
}

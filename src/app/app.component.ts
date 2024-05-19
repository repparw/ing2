import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Fedeteria';

  constructor (private userservice: UserService){

  }


  isAuthenticated(){
    return this.userservice.isAuthenticated()
  }
}

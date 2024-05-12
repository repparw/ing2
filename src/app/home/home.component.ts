import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
    userLoginOn:boolean = false;
    

    constructor (private loginService:LoginService){

    }

    

    ngOnInit(): void {
        this.loginService.currentUserLoginOn.subscribe(
          {
            next:(userLoginOn) => {
              this.userLoginOn= userLoginOn;
            }
          }
        )
    }
}

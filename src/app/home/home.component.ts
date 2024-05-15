import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { FakeApiService } from '../services/online-data/fake-api.service';
import { PublicationService } from '../services/publicacion.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
    userLoginOn:boolean = false;
    data: any[]=[];

    constructor (public publi:PublicationService){

    }

    ngOnInit(): void {
        this.llenarData();
        /*this.loginService.currentUserLoginOn.subscribe(
          {
            next:(userLoginOn) => {
              this.userLoginOn= userLoginOn;
            }
          }
        )*/
    }

    llenarData(){
      this.publi.getPublications().subscribe( data => {
        this.data=data;
        console.log(this.data);
      })
    }
}

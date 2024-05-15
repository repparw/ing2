import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { Pub } from '../services/pub';
import { Observable } from 'rxjs';
import { PublicationService } from '../services/publicacion.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ver-publicacion',
  templateUrl: './ver-publicacion.component.html',
  styleUrls: ['./ver-publicacion.component.css']
})
export class VerPublicacionComponent implements OnInit{
  data!: Pub;
  linkFoto!: any;
  constructor (private route: ActivatedRoute, private  publi: PublicationService ){

  }
  ngOnInit(): void {
    const productID:number=parseInt(this.route.snapshot.params['id']);
    console.log(productID)
    this.publi.getPublication(productID).subscribe(data => {
      if (data) { // Check if data is not null
        this.data = data;
        this.linkFoto = this.publi.getPhotos(productID);
        console.log(this.linkFoto);
        console.log(this.data);
      } else {
        console.log('No data received'); // Handle no data case (optional)
      }
    });
    console.log(this.data);
  }


}




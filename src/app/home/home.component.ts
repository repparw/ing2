import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../services/publicacion.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userLoginOn: boolean = false;
  data: any[] = [];
  filteredData: any[] = [];

  constructor(public publicationService: PublicationService) { }

  ngOnInit(): void {
    this.llenarData();
  }

  llenarData(): void {
    this.publicationService.getPublications().subscribe(data => {
      this.data = data;
      this.applyFilter();
      console.log(this.data);
    }, error => {
      console.error('Error fetching data', error);
    });
  }

  applyFilter(): void {
    // Example filter: only show publications with price 0
    this.filteredData = this.data.filter(item => item.price === 0); // replace with <>0 in home
  }
}

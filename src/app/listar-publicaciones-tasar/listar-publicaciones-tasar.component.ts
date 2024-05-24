import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../services/publicacion.service';

@Component({
  selector: 'app-listar-publicaciones-tasar',
  templateUrl: './listar-publicaciones-tasar.component.html',
  styleUrls: ['./listar-publicaciones-tasar.component.css']
})
export class ListarPublicacionesTasarComponent implements OnInit {
  data: any[] = [];
  filteredData: any[] = [];
  templateUrl: string = 'http://localhost:4200/publicacion/{{id}}/tasar';

  constructor(public publicationService: PublicationService) { }

  ngOnInit(): void {
    this.llenarData();
  }

  llenarData(): void {
    this.publicationService.getPublications().subscribe(data => {
      this.data = data;
      console.log('Data fetched', this.data);
      this.applyFilter();
    }, error => {
      console.error('Error fetching data', error);
    });
  }

  applyFilter(): void {
    // Example filter: only show publications with price 0
    this.filteredData = this.data.filter(item => item.price === 0); // replace with <>0 in home
  }
}


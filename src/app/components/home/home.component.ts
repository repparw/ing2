import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../services/publicacion.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userLoginOn: boolean = false;
  data: any[] = [];
  filteredData: any[] = [];
  sortField: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  searchTerm: string = ''; // Nueva propiedad para el término de búsqueda

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
    this.filteredData = this.data
      .filter(item => item.price != 0 && item.is_paused === false)
      .filter(item => this.searchTerm === '' || item.title.toLowerCase().includes(this.searchTerm.toLowerCase())); // Filtrado por término de búsqueda
    this.sortData();
  }

  sortData(): void {
    if (this.sortField) {
      this.filteredData.sort((a, b) => {
        let comparison = 0;
        const fieldA = typeof a[this.sortField] === 'string' ? a[this.sortField].toLowerCase() : a[this.sortField];
        const fieldB = typeof b[this.sortField] === 'string' ? b[this.sortField].toLowerCase() : b[this.sortField];

        if (fieldA > fieldB) {
          comparison = 1;
        } else if (fieldA < fieldB) {
          comparison = -1;
        }
        return this.sortOrder === 'asc' ? comparison : -comparison;
      });
    }
  }

  setSort(field: string): void {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.sortData();
  }

  onSearchTermChange(): void {
    this.applyFilter();
  }
}

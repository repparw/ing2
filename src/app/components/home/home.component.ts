import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../services/publication.service';
import { AdsService } from 'src/app/services/ads.service';

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
  categories: string[] = ['Serruchos', 'Destornillador', 'Powertools', 'Otros'];
  selectedCategory: string = '';
  noResultsFound: boolean = false;
  leftBannerImage: string = ''; // Propiedad para almacenar la imagen del banner izquierdo
  rightBannerImage: string = ''; // Propiedad para almacenar la imagen del banner derecho

  constructor(public publicationService: PublicationService , private adsService: AdsService) { }

  ngOnInit(): void {
    this.llenarData();
    this.loadBanners();
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
      .filter(item => this.searchTerm === '' || item.title.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .filter(item => this.selectedCategory === '' || item.category === this.selectedCategory);
    this.sortData();
    this.noResultsFound = this.filteredData.length === 0;
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

  selectCategory(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedCategory = selectedValue;
    this.applyFilter();
  }


  loadBanners(): void {
    this.adsService.getBanners().subscribe(data => {
      // Filtrar los banners izquierdo y derecho
      const leftBanner = data.find((banner: { position: string; }) => banner.position === 'left');
      const rightBanner = data.find((banner: { position: string; }) => banner.position === 'right');

      if (leftBanner) {
        this.leftBannerImage = 'data:image/jpeg;base64,' + leftBanner.image;
      }

      if (rightBanner) {
        this.rightBannerImage = 'data:image/jpeg;base64,' + rightBanner.image;
      }
    });
  }



}

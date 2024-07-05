import { Component, OnInit } from '@angular/core';
import { AdsService } from 'src/app/services/ads.service';

@Component({
  selector: 'app-modificar-banners',
  templateUrl: './modificar-banners.component.html',
  styleUrls: ['./modificar-banners.component.css']
})
export class ModificarBannersComponent implements OnInit {
  selectedFiles: File[] = [];
  images: any[] = [];

  constructor(private adsService: AdsService) { }

  ngOnInit(): void {
    this.loadImages();
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length === 2) {
      this.selectedFiles = Array.from(input.files);
    } else {
      alert('Please select exactly two images.');
    }
  }

  onUpload() {
    if (this.selectedFiles.length === 2) {
      this.adsService.uploadImages(this.selectedFiles).subscribe(response => {
        this.loadImages();
      });
    } else {
      alert('You need to select exactly two images.');
    }
  }

  loadImages() {
    this.adsService.getBanners().subscribe(data => {
      this.images = data;
    });
  }
}

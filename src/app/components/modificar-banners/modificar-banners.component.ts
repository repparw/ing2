// promotion-image.component.ts
import { Component, OnInit } from '@angular/core';
import { AdsService } from 'src/app/services/ads.service';

@Component({
  selector: 'app-modificar-banners',
  templateUrl: './modificar-banners.component.html',
  styleUrls: ['./modificar-banners.component.css']
})
export class ModificarBannersComponent implements OnInit {
  selectedFile!: File;
  images: any[] = [];

  constructor(private adsService: AdsService) { }

  ngOnInit(): void {
    this.loadImages();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
  onUpload() {
    this.adsService.uploadImage(this.selectedFile).subscribe(response => {
      this.loadImages();
    });
  }

  loadImages() {
    this.adsService.getImages().subscribe(data => {
      this.images = data;
    });
  }
}

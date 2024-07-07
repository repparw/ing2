import { Component, OnInit } from '@angular/core';
import { AdsService } from 'src/app/services/ads.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-banners',
  templateUrl: './modificar-banners.component.html',
  styleUrls: ['./modificar-banners.component.css']
})
export class ModificarBannersComponent implements OnInit {
  selectedFiles: File[] = [];
  images: any[] = [];
  isValidFiles: boolean = false;

  constructor(private adsService: AdsService, private router: Router) { }

  ngOnInit(): void {
    this.loadImages();
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length === 2) {
      this.selectedFiles = Array.from(input.files);
      this.isValidFiles = this.selectedFiles.every(file => this.isImage(file));
      if (!this.isValidFiles) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid file type',
          text: 'Please select image files (jpg, jpeg, png) only.',
        });
        this.selectedFiles = [];
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid selection',
        text: 'Please select exactly two images.',
      });
    }
  }

  onUpload() {
    if (this.selectedFiles.length === 2 && this.isValidFiles) {
      this.adsService.uploadImages(this.selectedFiles).subscribe(response => {
        this.loadImages();
        Swal.fire({
          icon: 'success',
          title: 'Upload successful',
          text: 'Images have been uploaded successfully.',
        }).then(() => {
          this.router.navigate(['/home']);
        });
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid selection',
        text: 'You need to select exactly two images.',
      });
    }
  }

  loadImages() {
    this.adsService.getBanners().subscribe(data => {
      this.images = data;
    });
  }

  isImage(file: File): boolean {
    return file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
  }
}

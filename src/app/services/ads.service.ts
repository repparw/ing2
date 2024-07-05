import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdsService {
  private apiUrl = 'http://127.0.0.1:8000/ads/';

  constructor(private http: HttpClient) { }

  uploadImages(images: File[]): Observable<any> {
    const formData: FormData = new FormData();
    images.forEach((image, index) => {
      formData.append('images', image, `banner_${index}.jpg`);
    });
    return this.http.post(this.apiUrl, formData);
  }

  getBanners(): Observable<any> {
    return this.http.get(`${this.apiUrl}get_banners/`);
  }
}

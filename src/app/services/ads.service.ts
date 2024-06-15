// promotion-image.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdsService {
  private apiUrl = 'http://127.0.0.1:8000/ads/';

  constructor(private http: HttpClient) { }

  uploadImage(image: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', image, image.name);
    return this.http.post(this.apiUrl, formData);
  }

  getImages(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  private apiUrl = 'http://localhost:8000/branches/';

  constructor(private http: HttpClient) { }

  getSucursales(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  public getPhotos(id: number): string {
    return `${this.apiUrl}${id}/photos/`;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rating } from '../models/rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  apiUrl = 'http://localhost:8000/ratings/';

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + localStorage.getItem('token'),
    });
  }

  constructor(private http: HttpClient) { }

  getRatingsForUser(userId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}?recipient=${userId}`, { headers: this.getHeaders() });
  }

  createRating(rating: Rating): Observable<Rating> {
    return this.http.post<Rating>(this.apiUrl, rating, { headers: this.getHeaders() });
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = 'http://localhost:8000/send-email/';

  constructor(private http: HttpClient) { }

  sendEmail(subject: string, message: string, recipientList: string[]): Observable<any> {
    const body = { subject, message, recipient_list: recipientList };
    // check if recipient list is empty
    if (recipientList.length === 0) {
      return new Observable(observer => {
      observer.error('Recipient list is empty');
      });
    }
    return this.http.post(this.apiUrl, body);
  }
}

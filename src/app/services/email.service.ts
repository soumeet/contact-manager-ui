import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  contextPath = 'http://localhost:8080/email/';
  constructor(private http: HttpClient) { }

  validateEmailId(emailId: string) {
    let param = new HttpParams().set('emailId', emailId);
    let url = this.contextPath + 'validate';
    console.log(url);
    return this.http.get(url, { params: param});
  }
}

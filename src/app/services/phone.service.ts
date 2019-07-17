import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {

  contextPath = 'http://localhost:8080/phone/';
  constructor(private http: HttpClient) { }

  validatePhoneNumber(phoneNumber: string) {
    let param = new HttpParams().set('phoneNumber', phoneNumber);
    let url = this.contextPath + 'validate';
    console.log(url);
    return this.http.get(url, { params: param});
  }
}

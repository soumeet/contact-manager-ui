import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contextPath = 'http://localhost:8080/contact/';
  constructor(private http: HttpClient) { }

  addContact(contact: Contact): any {
    let result: any;
    let url = this.contextPath + 'add';
    console.log(url);
    console.log(JSON.stringify(contact));
    this.http.post(url, contact).subscribe(
      (res) => {
        result = res;
      }
    );
    return result;
  }

  getContact(contactId: number): any {
    let contact: any;
    let url = this.contextPath + 'get?contactId=' + contactId;
    console.log(url);
    this.http.get(url).subscribe(
      (res) => {
        contact = res;
      }
    );
    return contact;
  }
}

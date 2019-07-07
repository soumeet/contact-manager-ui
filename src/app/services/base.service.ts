import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  contextPath = 'http://localhost:8080/base/';
  url: string = '';
  constructor(private http: HttpClient) { }

  getLabels() {
    this.url = this.contextPath + 'getAllLabels';
    console.log(this.url);
    return this.http.get<any>(this.url)
      .toPromise()
      .then(data => { return data; });
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getCountryCodes() {
    let url = "https://restcountries-v1.p.rapidapi.com/all";
    console.log(url);

    let httpOptions = {
      headers: new HttpHeaders({
        'X-RapidAPI-Host':  'restcountries-v1.p.rapidapi.com',
        'X-RapidAPI-Key': '4db340ce28msh87059c0de9f8a4bp100200jsna42f8f2e6c01'
      })
    };

    return this.http.get<any>(url, httpOptions)
      .toPromise()
      .then(data => {
        return data; 
      });
  }
}

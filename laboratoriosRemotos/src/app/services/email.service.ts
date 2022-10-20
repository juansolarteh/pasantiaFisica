import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private url = 'http://localhost:3000/'

  constructor(private httpClient : HttpClient) { }

  sendEmail(data:{}){
    return this.httpClient.post(this.url + 'anomaly', data, {responseType: 'text'}).subscribe(res=> console.log(res))
  }
}

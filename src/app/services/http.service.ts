import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { first } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseUrl = environment.url;
  constructor(private request:HttpClient) { }

  get(url:string, data?:any) {
    return this.request.get(this.baseUrl+url, { params: data });
  }

  post(url:string, data?:any) {
    return this.request.post(this.baseUrl+url, data);
  }

  put(url:string, data?:any) {
    return this.request.put(this.baseUrl+url, data);
  }

  delete(url:string, data?:any) {
    return this.request.delete(this.baseUrl+url, data);
  }

  pingToUrl(url:string) {
    this.request.get('https://www.google.com', { observe: 'response' })
    .pipe(first())
      .subscribe(resp => {
        if (resp.status === 200 ) {
          console.log(true)
        } else {
          console.log(false)
        }
      }, err => console.log(err));
  }
}

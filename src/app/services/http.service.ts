import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
}

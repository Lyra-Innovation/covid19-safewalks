import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private SERVER_URL = 'http://localhost';

  constructor(private http: HttpClient) { }

  post(classname: string, func: string, params: object = {}) {
    return this.http.post(this.SERVER_URL, {
      "classname" : classname,
      "func" : func,
      "params": params
    });
  }

}

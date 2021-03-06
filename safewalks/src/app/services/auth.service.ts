import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators'
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import * as CryptoJS from 'crypto-js';


const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);
 
  constructor(
    private storage: Storage,
    private plt: Platform,
    private router: Router,
    private api: ApiService
  ) { 
    this.loadStoredToken();  
  }
 
  loadStoredToken() {
    let platformObs = from(this.plt.ready());
 
    this.user = platformObs.pipe(
      switchMap(() => {
        return from(this.storage.get('token'));
      }),
      map(token => {
        if (token) {
          let decoded = helper.decodeToken(token);
          this.userData.next(decoded);
          return true;
        } else {
          return null;
        }
      })
    );
  }
 
  login(credentials: {dni: string, pw: string }) {
    //encypt dni with your password
    var hash = CryptoJS.HmacSHA512(credentials.dni, credentials.pw.trim()).toString();
    
    //hash dni (identifier)
    var dni_hash = CryptoJS.SHA512(credentials.pw).toString();

    //send login to get JWT
    return this.api.post('Auth', 'login', {
      "hash": hash,
      "dni_hash": dni_hash
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        return of(null);
      }),
      map(resp => {
        if(resp) {
          let decoded = helper.decodeToken(resp.data.token);
          this.userData.next(decoded);
          let storageObs = from(this.storage.set('token', resp.data.token));
          return storageObs;
        }
      })
    );
  }

  register(usr_data: {dni: string, name: string, surname1: string, surname2: string, city: string}, pwd) {
    //encypt dni with your password
    var hash = CryptoJS.HmacSHA512(usr_data.dni, pwd).toString();

    //enctypt your data with your password
    var data = CryptoJS.AES.encrypt(JSON.stringify(usr_data), pwd).toString();

    //hash dni (to check rpeated and identifier)
    var dni_hash = CryptoJS.SHA512(usr_data.dni).toString();

    //send register
    return this.api.post('Auth', 'register', {
      "hash": hash,
      "data": data,
      "country": "Spain",
      "dni_hash": dni_hash
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        return of(null);
      }),
      map(resp => {
        if(resp) {
          return of(true);
        }
      })
    );
  }

  logout() {
    this.storage.remove('token').then(() => {
      this.router.navigateByUrl('/');
      this.userData.next(null);
    });
  }

}

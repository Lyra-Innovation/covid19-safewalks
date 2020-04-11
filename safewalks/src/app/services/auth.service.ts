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
    var hash = CryptoJS.AES.encrypt(credentials.dni, credentials.pw.trim()).toString();

    //send login to get JWT
    return this.api.post('Auth', 'login', {
      "hash": hash
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

  register(usr_data: {dni: string, pw: string }) {
    //encypt dni with your password
    var hash = CryptoJS.AES.encrypt(usr_data.dni, usr_data.pw.trim()).toString();

    //send register
    return this.api.post('Auth', 'register', {
      "hash": hash,
      "country": "Spain",
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

  getUserData() {
    return this.storage.get('usr_data');
  }
 
  logout() {
    this.storage.remove('token').then(() => {
      this.storage.remove('usr_data').then(() => {
        this.router.navigateByUrl('/');
        this.userData.next(null);
      });
    });
  }

}

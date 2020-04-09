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
    return this.api.post('Auth', 'login', {
      "nif": credentials.dni,
      "password": credentials.pw
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

  register(usr_data: {dni: string, email: string, name: string, surname1: string, surname2: string, city: string, pw: string }) {
    return this.api.post('Auth', 'register', {
      "nif": usr_data.dni,
      "email" : usr_data.email,
      "name" : usr_data.name,
      "surname1": usr_data.surname1,
      "surname2": usr_data.surname2,
      "city": usr_data.city,
      "password": usr_data.pw,
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

  getUser() {
    return this.userData.getValue();
  }
 
  logout() {
    this.storage.remove('token').then(() => {
      this.router.navigateByUrl('/');
      this.userData.next(null);
    });
  }

}

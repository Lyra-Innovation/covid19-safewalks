import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  user = {};

  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) { }
 
  ionViewWillEnter() {
    this.http.post('http://localhost', {
      "classname" : "User",
      "func" : "getUser",
      "params": {}
    }).subscribe({
      next: (resp: {data: object}) => {
        this.user = resp.data;
        console.log(this.user)
      },
      error: error => {
        console.error('There was an error!', error);
      }
    })
  }

  logout() {
    this.auth.logout();
  }

}

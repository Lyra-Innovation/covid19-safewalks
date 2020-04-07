import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  user = {};

  constructor(
    private auth: AuthService
  ) { }
 
  ionViewWillEnter() {
    this.user = this.auth.getUser();
    console.log(this.user)
  }

  logout() {
    this.auth.logout();
  }
  
}

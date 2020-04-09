import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  user = {};

  constructor(
    private auth: AuthService,
    private api: ApiService,
    translate: TranslateService
  ) {
    translate.setDefaultLang('es');
  }
 
  ionViewWillEnter() {
    this.api.post('User', 'getUser').subscribe({
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

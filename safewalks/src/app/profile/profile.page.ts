import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user = {};
  lang: string;

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private storage: Storage,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.storage.get('lang').then((val) => {
      this.lang = val;
    });
  }
 
  ionViewWillEnter() {
    this.user = this.auth.getUserData();
  }

  logout() {
    this.auth.logout();
  }

  onChange(params) {
    this.storage.set('lang', params.detail.value);
    this.translate.use(params.detail.value);
    this.lang = params.detail.value;
  }

}

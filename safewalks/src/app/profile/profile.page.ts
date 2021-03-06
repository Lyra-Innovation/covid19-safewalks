import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import * as CryptoJS from 'crypto-js';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  user = {
    name: '***',
    surname1: '***',
    surname2: '***',
    dni: '***',
    city: '***'
  };
  lang: string;

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private storage: Storage,
    private translate: TranslateService,
    private alertCtrl: AlertController
  ) {}
 
  ionViewWillEnter() {
    this.storage.get('lang').then((val) => {
      this.lang = val;
    });
    
    this.user = {
      name: '***',
      surname1: '***',
      surname2: '***',
      dni: '***',
      city: '***'
    };

    this.api.post('User', 'getUser').subscribe({
      next: (resp: {data: any}) => {
        this.presentAlert(resp.data.data);
      },
      error: error => {
        console.error('There was an error!', error);
      }
    });
  }

  async presentAlert(dataEncypted) {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('profile.login.title'),
      inputs: [
        {
          name: 'password',
          placeholder: this.translate.instant('profile.login.password'),
          type: 'password'
        }
      ],
      buttons: [
        {
          text: this.translate.instant('profile.login.cancel'),
          role: 'cancel',
          handler: pwd => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.translate.instant('profile.login.login'),
          handler: pwd => {
            try {
              var decrypted = CryptoJS.AES.decrypt(dataEncypted, pwd.password).toString(CryptoJS.enc.Utf8);
              this.user = JSON.parse(decrypted);
            } catch (e) {
              var elem = document.querySelector(".alert-wrapper input[type='password']") as HTMLElement;
              elem.style.color = 'red'
              return false;
            }
          }
        }
      ]
    });
    await alert.present();
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

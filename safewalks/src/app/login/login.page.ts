import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials = {
    dni: '',
    pw: ''
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private translate: TranslateService
  ){ }

  ngOnInit() {}
 
  login() {
    this.auth.login(this.credentials).subscribe(async res => {
      if (res) {
        this.router.navigateByUrl('/app');
      } else {
        const alert = await this.alertCtrl.create({
          header: this.translate.instant('login.error.title'),
          message: this.translate.instant('login.error.message'),
          buttons: [this.translate.instant('login.error.button')]
        });
        await alert.present();
      }
    });
  }

}

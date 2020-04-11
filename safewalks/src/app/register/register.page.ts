import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  user_data = {
    name: '',
    surname1: '',
    surname2: '',
    dni: '',
    city: ''
  };
  pwd = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private translate: TranslateService
  ){ }

  ngOnInit() {}

  register() {
    this.auth.register(this.user_data, this.pwd).subscribe(async res => {
      if (res) {
        this.auth.login({dni: this.user_data.dni, pw: this.pwd}).subscribe(async res => {
          this.router.navigateByUrl('/app');
        });
      } else {
        const alert = await this.alertCtrl.create({
          header: this.translate.instant('register.error.title'),
          message: this.translate.instant('register.error.message'),
          buttons: [this.translate.instant('register.error.button')]
        });
        await alert.present();
      }
    });
  }

}

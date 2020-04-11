import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

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
    pw: '',
    city: ''
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private storage: Storage
  ){ }

  ngOnInit() {
  }

  register() {
    this.auth.register({dni: this.user_data.dni, pw: this.user_data.pw}).subscribe(async res => {
      if (res) {
        this.auth.login({dni: this.user_data.dni, pw: this.user_data.pw}).subscribe(async res => {
          delete this.user_data.pw;
          this.storage.set('usr_data', JSON.stringify(this.user_data));
          this.router.navigateByUrl('/app');
        });
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Register error',
          message: '',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

}

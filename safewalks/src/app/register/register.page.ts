import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

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
    pw2: '',
    email: '',
    city: ''
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ){ }

  ngOnInit() {
  }

  register() {
    this.auth.register(this.user_data).subscribe(async res => {
      if (res) {
        this.auth.login({dni: this.user_data.dni, pw: this.user_data.pw}).subscribe(async res => {
          this.router.navigateByUrl('/app');
        });
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Register error',
          message: 'User with DNI ' + this.user_data.dni + ' exists',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

}

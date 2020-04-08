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
  credentials = {
    name: '',
    surnames: '',
    dni: '',
    pw: '',
    pw2: ''
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ){ }

  ngOnInit() {
  }

  register() {
    this.auth.register(this.credentials).subscribe(async res => {
      if (res) {
        this.router.navigateByUrl('/app');
      } else {
        /*const alert = await this.alertCtrl.create({
          header: 'Login Failed',
          message: 'Wrong credentials.',
          buttons: ['OK']
        });
        await alert.present();*/
      }
    });
  }

}

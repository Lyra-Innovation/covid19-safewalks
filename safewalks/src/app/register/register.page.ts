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
    city: '',
    terms: false
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
    //check dni
    if(!this.validateDNI(this.user_data.dni)) {
      this.validation_alert('dni');
      return;
    }

    //check name
    if(this.user_data.name == '') {
      this.validation_alert('name');
      return;
    }

    //check surname1
    if(this.user_data.surname1 == '') {
      this.validation_alert('surname1');
      return;
    }

    //check city
    if(this.user_data.city == '') {
      this.validation_alert('city');
      return;
    }

    //check pwd
    if(this.pwd.length < 6) {
      this.validation_alert('password');
      return;
    }

    //check pwd
    if(!this.user_data.terms) {
      this.validation_alert('terms');
      return;
    }

    //send register
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

  async validation_alert(field){
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('register.validation.title'),
      message: this.translate.instant('register.validation.'+field),
      buttons: [this.translate.instant('register.validation.button')]
    });
    await alert.present();
  }

  validateDNI(dni) {
    var numero, letr, letra;
    var expresion_regular_dni = /^[XYZ]?\d{5,8}[A-Z]$/;

    dni = dni.toUpperCase();

    if(expresion_regular_dni.test(dni) === true){
        numero = dni.substr(0,dni.length-1);
        numero = numero.replace('X', 0);
        numero = numero.replace('Y', 1);
        numero = numero.replace('Z', 2);
        letr = dni.substr(dni.length-1, 1);
        numero = numero % 23;
        letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
        letra = letra.substring(numero, numero+1);
        if (letra != letr) {
            //alert('Dni erroneo, la letra del NIF no se corresponde');
            return false;
        }else{
            //alert('Dni correcto');
            return true;
        }
    }else{
        //alert('Dni erroneo, formato no válido');
        return false;
    }
  }

}

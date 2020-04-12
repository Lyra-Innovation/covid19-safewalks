import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { Storage } from '@ionic/storage';
import { LoadingController } from '@ionic/angular';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  isLoading: boolean = false;

  constructor(
    public loadingCtrl: LoadingController,
    public storage: Storage,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.storage.get('token'))
      .pipe(
        switchMap(token => {
          //token auth
          if (token) {
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${ token }`
              }
            });
          }

          // Presentamos el Loading al inicio de la llamada
          this.presentLoading();
          return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
                // Cerramos el loading en el fin de la llamada
                this.dismissLoading();
              }
              return event;
            }),
            catchError((error: HttpErrorResponse) => {
              console.error(error);
              // En caso de error cerramos el loading
              this.dismissLoading();
              return throwError(error);
            })
          );

        })
      );
  }
  // Creación del loading
  async presentLoading() {
    if(!this.isLoading) {
      this.isLoading = true;
      return await this.loadingCtrl.create({
        duration: 5000,
      }).then(a => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then(() => console.log());
          }
        });
      });
    }
  }
  // Cierre del loading
  async dismissLoading() {
    if(this.isLoading) {
      this.isLoading = false;
      return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
    }
  }
}
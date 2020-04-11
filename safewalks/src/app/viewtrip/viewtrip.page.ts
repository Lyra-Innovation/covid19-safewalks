import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import { ApiService } from '../services/api.service';
import { AlertController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewtrip',
  templateUrl: './viewtrip.page.html',
  styleUrls: ['./viewtrip.page.scss'],
})
export class ViewtripPage implements OnInit {
  //map
  map: L.Map;
  
  constructor(
    private api: ApiService,
    public alertController: AlertController,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController
  ) {}

  ngOnInit(): void {
    this.api.post('Trip', 'getTrip', {
      "id": this.activatedRoute.snapshot.paramMap.get('id')
    }).subscribe({
      next: (resp: {data: any}) => {
        this.loadMap(resp.data['points'][0]['lat'], resp.data['points'][0]['lon']);

        var pointList = [];
        for (var i = 0; i < resp.data['points'].length; i++) {
          var point = new L.LatLng(resp.data['points'][i]['lat'], resp.data['points'][i]['lon']);
          pointList.push(point);
        }
        
        var polyline = new L.Polyline(pointList);
        polyline.addTo(this.map);
      },
      error: error => {
        console.error('There was an error!', error);
        this.loadMap(41.3870154, 2.1678531);
      }
    });
  }

  //MAP FUNCTIONS
  loadMap(lat, long) {
    if (this.map != undefined) { this.map.remove(); }
    this.map = new L.Map('map_trip', {drawControl: true}).setView([lat, long], 15);
    this.map.invalidateSize();

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: 'edupala.com',
    }).addTo(this.map);

    this.map.pm.addControls({
      position: 'topleft',
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawPolygon: false,
      drawCircle: false,
      editMode: false,
      dragMode: false,
      cutPolygon: false,
      removalMode: false,
      pinningOption: false,
      snappingOption: false
    });
  }

  async alertDelete() {
    const alert = await this.alertController.create({
      header: this.translate.instant('viewtrip.alert_delete_header'),
      message: this.translate.instant('viewtrip.alert_delete_message'),
      buttons: [
        {
          text: this.translate.instant('viewtrip.ok'),
          handler: () => {
            this.api.post('Trip', 'deleteTrip', {
              'id_trip': this.activatedRoute.snapshot.paramMap.get('id')
            }).subscribe({
              next: (resp: {data: any}) => {
                this.navCtrl.navigateBack("/app/trips");
              },
              error: error => {
                console.error('There was an error!', error);
              }
            });
          }
        },
        {
          text: this.translate.instant('viewtrip.cancel'),
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }
}

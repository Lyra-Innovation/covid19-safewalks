import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import '@geoman-io/leaflet-geoman-free';
import { ApiService } from '../services/api.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-viewtrip',
  templateUrl: './viewtrip.page.html',
  styleUrls: ['./viewtrip.page.scss'],
})
export class ViewtripPage implements OnInit {
  //map
  map: L.Map;
  
  constructor(
    private geolocation: Geolocation,
    private api: ApiService,
    public alertController: AlertController,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.loadMap(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
      this.loadMap(41.3870154, 2.1678531);
    });
  }

  //MAP FUNCTIONS
  loadMap(lat, long) {
    if (this.map != undefined) { this.map.remove(); }
    this.map = new L.Map('map_trip', {drawControl: true}).setView([lat, long], 15);
    this.map.invalidateSize();
    this.map.coords = [];
    this.map.on('pm:create', function(e) {
      this.coords = this.coords.concat(e.layer.getLatLngs());
    });

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: 'edupala.com',
    }).addTo(this.map);

    this.map.pm.addControls({
      position: 'topleft',
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: true,
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
      header: this.translate.instant('newtrip.alert_success_header'),
      message: this.translate.instant('newtrip.success'),
      buttons: [
        {
          text: this.translate.instant('newtrip.ok'),
        }
      ]
    });

    await alert.present();
  }
}

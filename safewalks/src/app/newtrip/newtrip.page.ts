import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import '@geoman-io/leaflet-geoman-free';
import { ApiService } from '../services/api.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-newtrip',
  templateUrl: './newtrip.page.html',
  styleUrls: ['./newtrip.page.scss'],
})
export class NewtripPage implements OnInit {
  //map
  map: L.Map;
  
  //date selector
  selectedDate: Date;
  
  //speed selector
  speed_selected = "walk";
  speed = {
    "walk": {},
    "running": {},
    "bicycle": {}
  }

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
    this.change_speed("walk");
  }

  dateSelected(event) {
    this.selectedDate = event.detail.value;
  }

  change_speed(speed) {
    this.speed_selected = speed;
    this.speed = {"walk": {}, "running": {} , "bicycle": {}}
    this.speed[speed] = {"background-color": "#EEE"};
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

  validate() {
    var ret = [];
    ret['success'] = false;
    if (!this.selectedDate) {
      ret['error'] = 'nodate';
    } else if (this.map.coords.length == 0) {
      ret['error'] = 'nocoords';
    } else {
      ret['success'] = true;
    }

    return ret;
  }

  send_trip() {
    var validation = this.validate();

    if (!validation['success']) {
      this.alertValidation(validation['error']);
      return;
    }

    var points = [];
    for (var i = 0; i < this.map.coords.length; i++) {
      points.push({
        "lat": this.map.coords[i].lat,
        "lon": this.map.coords[i].lng
      });
    }
    this.api.post('Trip', 'createTrip', {
      "start_date": Math.floor(new Date(this.selectedDate).getTime() / 1000),
      "enforced": 0,
      "vehicle": this.speed_selected,
      "points": points
    }).subscribe({
      next: (resp: {data: any}) => {
        if (resp.data.success) {
          this.alertSuccess();
        } else {
          // show popup with resp.data.alternative
          console.log(resp.data.alternative);
        }
      },
      error: error => {
        console.error('There was an error!', error);
      }
    });
  }

  async alertValidation(message) {
    const alert = await this.alertController.create({
      header: this.translate.instant('newtrip.alert_validation_header'),
      message: this.translate.instant('newtrip.' + message),
      buttons: [
        {
          text: this.translate.instant('newtrip.ok'),
        }
      ]
    });

    await alert.present();
  }

  async alertSuccess() {
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

import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import '@geoman-io/leaflet-geoman-free';
import { ApiService } from '../services/api.service';
import { AlertController, NavController } from '@ionic/angular';
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
  
  //reason selector
  selectedReason: number;

  //speed selector
  speed_selected = "walk";
  speed = {
    "walk": {},
    "run": {},
    "bicycle": {}
  }

  reasonid_enforced = {
    "0": 1,
    "1": 1,
    "2": 1,
    "3": 1,
    "4": 1,
    "5": 1,
    "6": 1,
    "7": 1,
    "8": 0
  }

  constructor(
    private geolocation: Geolocation,
    private api: ApiService,
    public alertController: AlertController,
    private translate: TranslateService,
    private navCtrl: NavController
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

  reasonSelected(event) {
    this.selectedReason = event.detail.value;
  }

  change_speed(speed) {
    this.speed_selected = speed;
    this.speed = {"walk": {}, "run": {} , "bicycle": {}}
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
      editMode: true,
      dragMode: false,
      cutPolygon: false,
      removalMode: false,
      pinningOption: false,
      snappingOption: false
    });

    this.map.pm.enableDraw('Line', {
      templineStyle: { color: 'rgb(101, 139, 107)' },
      hintlineStyle: { color: 'rgb(101, 139, 107)' },
      pathOptions: {
        color: 'rgb(101, 139, 107)',
        fillColor: 'green',
      }
    });
    
  }

  validate() {
    var ret = [];
    ret['success'] = false;
    if (!this.selectedDate) {
      ret['error'] = 'nodate';
    } else if (this.map.coords.length == 0) {
      ret['error'] = 'nocoords';
    } else if (this.selectedReason == null) {
      ret['error'] = 'noreason';
    } else {
      ret['success'] = true;
    }

    return ret;
  }

  get_points() {
    var points = [];
    for (var i = 0; i < this.map.coords.length; i++) {
      points.push({
        "lat": this.map.coords[i].lat,
        "lon": this.map.coords[i].lng
      });
    }
    return points;
  }

  prepare_trip() {
    var validation = this.validate();

    if (!validation['success']) {
      this.alertValidation(validation['error']);
      return;
    }

    var points = this.get_points();
    this.send_trip(points, Math.floor(new Date(this.selectedDate).getTime() / 1000));
  }

  send_trip(points, start_date) {
    this.api.post('Trip', 'createTrip', {
      "start_date": start_date,
      "enforced": this.reasonid_enforced[this.selectedReason],
      "vehicle": this.speed_selected,
      "points": points,
      "id_reason": this.selectedReason
    }).subscribe({
      next: (resp: {data: any}) => {
        if (resp.data.success) {
          this.alertSuccess();
        } else if (resp.data.found) {
          this.alertAlternative(resp.data);
        } else {
          this.alertFail();
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
          handler: () => {
            this.navCtrl.navigateBack("/app/trips");
          }
        }
      ]
    });

    await alert.present();
  }

  async alertAlternative(data) {
    const alert = await this.alertController.create({
      header: this.translate.instant('newtrip.alert_alternative_header'),
      message: this.translate.instant('newtrip.alternative') + new Date(data.time * 1000).toLocaleString(),
      buttons: [
        {
          text: this.translate.instant('newtrip.ok'),
          handler: () => {
            this.send_trip(this.get_points(), data.time);
          }
        },
        {
          text: this.translate.instant('newtrip.cancel'),
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  async alertFail() {
    const alert = await this.alertController.create({
      header: this.translate.instant('newtrip.alert_fail_header'),
      message: this.translate.instant('newtrip.fail'),
      buttons: [
        {
          text: this.translate.instant('newtrip.ok'),
        }
      ]
    });

    await alert.present();
  }
  
}

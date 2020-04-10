import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import '@geoman-io/leaflet-geoman-free';

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
    private geolocation: Geolocation
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
  
}

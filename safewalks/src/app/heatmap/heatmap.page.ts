import { Component } from '@angular/core';
import { Map, latLng, tileLayer, Layer, marker } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.page.html',
  styleUrls: ['./heatmap.page.scss'],
})
export class HeatmapPage {

  constructor(private geolocation: Geolocation) { }

  map: Map;

  ionViewDidEnter() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.leafletMap(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
      // Default location
      this.leafletMap(41.3870154, 2.1678531);
    });
  }

  leafletMap(lat, long) {
    this.map = new Map('map').setView([lat, long], 15);
    this.map.invalidateSize();

    tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: 'edupala.com',
    }).addTo(this.map);
  }

  /** Remove map when we have multiple map object */
  ionViewWillLeave() {
    this.map.remove();
  }

}

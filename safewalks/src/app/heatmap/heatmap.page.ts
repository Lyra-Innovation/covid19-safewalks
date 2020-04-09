import { Component } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import "src/assets/js/leaflet-heat.js";

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.page.html',
  styleUrls: ['./heatmap.page.scss'],
})
export class HeatmapPage {

  map: L.Map;
  locationMarker: any;
  selectedDate: Date;
  heatLayer: L.HeatLayer;

  constructor(private geolocation: Geolocation) {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.loadMap(resp.coords.latitude, resp.coords.longitude);
      this.locatePosition();
    }).catch((error) => {
      console.log('Error getting location', error);
      // Default location
      this.loadMap(41.3870154, 2.1678531);
    });
   }

  ionViewDidEnter() {}

  loadMap(lat, long) {
    if (this.map != undefined) { this.map.remove(); }
    this.map = new L.Map('map', {drawControl: true}).setView([lat, long], 16);
    this.map.invalidateSize();

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: 'edupala.com',
    }).addTo(this.map);
  }

  locatePosition() {
    var myIcon = L.icon({
      iconUrl: 'assets/map_marker.png',
      iconSize: [26, 40],
      iconAnchor: [13, 40],
      shadowUrl: "",
      shadowSize: [35, 50],
      shadowAnchor: [0, 55],
      popupAnchor: [0, -40]
    });

    this.map.locate({setView:true}).on("locationfound", (e: any)=> {
      this.locationMarker = L.marker([e.latitude,e.longitude], {
        draggable:false,
        opacity: 1,
        icon: myIcon
        }).addTo(this.map);
      this.locationMarker.bindPopup("Vostè és aquí");
      // Heatmap
      var heat = L.heatLayer([
        [e.latitude, e.longitude, 0.9], // lat, lng, intensity
        [e.latitude+0.0005, e.longitude+0.0003, 0.3]
      ], {radius: 25}).addTo(this.map);
    });

    
  }

  /** Remove map when we have multiple map object */
  ionViewWillLeave() {
    //this.map.remove();
  }

  dateSelected(event) {
    this.selectedDate = event.detail.value;
  }

  paintHeatmap() {
    
  }

}

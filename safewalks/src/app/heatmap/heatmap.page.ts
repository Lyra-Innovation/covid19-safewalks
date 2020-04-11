import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ApiService } from '../services/api.service';
import "../../assets/js/leaflet-heat.js";

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

  constructor(private geolocation: Geolocation, private api: ApiService) {}

  ngAfterViewInit(): void {
    this.selectedDate = new Date();
    this.geolocation.getCurrentPosition().then((resp) => {
      this.loadMap(resp.coords.latitude, resp.coords.longitude);
      this.locatePosition();
      this.loadHeatmap();
    }).catch((error) => {
      console.log('Error getting location', error);
      // Default location
      this.loadMap(41.3870154, 2.1678531);
    });
  }

  ionViewDidEnter() {}

  loadMap(lat, long) {
    if (this.map != undefined) { this.map.remove(); }
    this.map = new L.Map('map', {drawControl: true}).setView([lat, long], 6);
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
      var latLngs = [ this.locationMarker.getLatLng() ];
      var markerBounds = L.latLngBounds(latLngs);
      this.map.fitBounds(markerBounds);
    });
  }

  loadHeatmap() {
    var ctx = this;

    // Heatmap
    this.heatLayer = L.heatLayer([], {radius: ctx.getRadius(),
      max: 1.0,
      blur: 10,              
      gradient: {
          0.0: 'green',
          0.5: 'yellow',
          1.0: 'red'
      },
      minOpacity: 0.3,
      maxZoom: 17}).addTo(this.map);

    this.map.on({
      moveend: function () { ctx.paintHeatmap(); },
    });

  }

  dateSelected(event) {
    this.selectedDate = event.detail.value;
    this.paintHeatmap();
  }

  paintHeatmap() {
    var bounds = this.map.getBounds();
    var heatArray = [];
    var heatPoint;
    
    var time = Math.round(new Date(this.selectedDate).getTime()/1000);
    this.heatLayer.setLatLngs([]);
    if(this.map.getZoom() >= 14) {
      this.api.post('Heatmap', 'getHeatMapZoom', {
        "left_bot_cell": {
          "lat": bounds["_southWest"].lat,
          "lon": bounds["_southWest"].lng
        },
        "right_top_cell" : {
          "lat": bounds["_northEast"].lat,
          "lon": bounds["_northEast"].lng
        },
        "time": time
        }).subscribe({
        next: (resp: {data: []}) => {
          heatArray = resp.data;
          console.log(bounds);
          console.log(heatArray);
          for(var i = 0; i < heatArray.length; i++) {
            if (heatArray[i].value > 0) {
              heatPoint = [heatArray[i].lat, heatArray[i].lon, heatArray[i].value];
              this.heatLayer.addLatLng(heatPoint).addTo(this.map);
            }
          }
          this.heatLayer.setOptions({radius: this.getRadius(),
            max: 1.0,
            blur: 25,              
            gradient: {
                0.0: 'green',
                0.33: 'yellow',
                0.67: 'orange',
                1.0: 'red'
            },
            minOpacity: 0.3,
            maxZoom: 14});
          this.heatLayer.redraw();
        },
        error: error => {
          console.error('There was an error!', error);
        }
      })
    }
    
  }

  getRadius(){
    var radius;
    var currentZoom = this.map.getZoom();

    if (currentZoom <= 7){
        radius = 4;
    }
    else if (currentZoom === 8) {
      radius = 6;
    }
    else if (currentZoom === 9) {
      radius = 7;
    }
    else if (currentZoom === 10) {
        radius = 8;
    }
    else if (currentZoom === 11) {
        radius = 10;
    }
    else if (currentZoom === 12) {
        radius = 12;
    }
    else if (currentZoom === 13) {
        radius = 14;
    }
    else if (currentZoom === 14) {
        radius = 18;
    }
    else if (currentZoom === 15) {
        radius = 24;
    }
    else if (currentZoom === 16) {
        radius = 40;
    }
    else if (currentZoom === 17) {
        radius = 60;
    }
    else if (currentZoom === 18) {
        radius = 100;
    }
    return radius;
  }

}

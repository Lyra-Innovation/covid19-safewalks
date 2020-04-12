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
  defaultDate: string;
  heatLayer: L.HeatLayer;

  constructor(private geolocation: Geolocation, private api: ApiService) {
    this.selectedDate = new Date();
    this.defaultDate = new Date().toISOString();
  }

  ngAfterViewInit(): void {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.loadMap(resp.coords.latitude, resp.coords.longitude);
      this.locatePosition();
      this.loadHeatmap();
    }).catch((error) => {
      console.log('Error getting location', error);
      // Default location
      this.loadMap(41.7021966, 1.659107);
      this.loadHeatmap();
    });
  }

  loadMap(lat, long) {
    if (this.map != undefined) { this.map.remove(); }
    this.map = new L.Map('map', {drawControl: true}).setView([lat, long], 8);
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
      blur: 30,              
      gradient: {
          0.0: 'green',
          0.5: 'yellow',
          1.0: 'red'
      },
      minOpacity: 0.2,
      maxZoom: 14}).addTo(this.map);

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
      var SWlat = bounds["_southWest"].lat;
      var SWlon = bounds["_southWest"].lng;
      var NElat = bounds["_northEast"].lat;
      var NElon = bounds["_northEast"].lng;
      if(this.map.getZoom() >= 17) {
        SWlat = SWlat-0.002;
        SWlon = SWlon-0.002;
        NElat = NElat+0.002;
        NElon = NElon+0.002;
      }
      
      this.api.post('Heatmap', 'getHeatMapZoom', {
        "left_bot_cell": {
          "lat": SWlat,
          "lon": SWlon
        },
        "right_top_cell" : {
          "lat": NElat,
          "lon": NElon
        },
        "time": time
        }).subscribe({
        next: (resp: {data: []}) => {
          heatArray = resp.data;
          for(var i = 0; i < heatArray.length; i++) {
            if (heatArray[i].value > 0) {
              var points = this.getPoints(heatArray[i].lat, heatArray[i].lon);
              for(var j = 0; j < points.length; j++) {
                heatPoint = [points[j][0], points[j][1], heatArray[i].value/9];
                this.heatLayer.addLatLng(heatPoint).addTo(this.map);
              }
            }
          }
          this.heatLayer.setOptions({radius: this.getRadius(),
            max: 1.0,
            blur: 30,              
            gradient: {
                0.0: 'green',
                0.33: 'yellow',
                0.67: 'orange',
                1.0: 'red'
            },
            minOpacity: 0.2,
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
        radius = 17;
    }
    else if (currentZoom === 15) {
        radius = 32;
    }
    else if (currentZoom === 16) {
        radius = 46;
    }
    else if (currentZoom === 17) {
        radius = 70;
    }
    else if (currentZoom === 18) {
        radius = 100;
    }
    return radius;
  }

  getPoints(lat, lon) {
    var d = 0.002/2;
    var d2 = 2*d/3;
    return [[lat, lon], [lat-d, lon], [lat+d, lon], [lat, lon-d], [lat, lon+d], [lat-d2, lon-d2], [lat-d2, lon+d2], [lat+d2, lon-d2], [lat+d2, lon+d2]]
  }

}

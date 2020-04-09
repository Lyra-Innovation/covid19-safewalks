import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import "src/assets/js/leaflet-heat.js";

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.page.html',
  styleUrls: ['./heatmap.page.scss'],
})
export class HeatmapPage implements OnInit {

  map: L.Map;
  locationMarker: any;
  selectedDate: Date;
  heatLayer: L.HeatLayer;

  constructor(private geolocation: Geolocation) {}

  ngOnInit(): void {
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
      this.locationMarker.bindPopup("Vostè és aquí").openPopup();
    });
  }

  loadHeatmap() {
    var ctx = this;

    // Heatmap
    this.heatLayer = L.heatLayer([
        [41.3870154+0.0005, 2.1678531+0.0003, 0.3]
      ], {radius: ctx.getRadius(),
      max: 1.0,
      blur: 15,              
      gradient: {
          0.0: 'green',
          0.5: 'yellow',
          1.0: 'red'
      },
      minOpacity: 0.3}).addTo(this.map);

    this.map.on({
      moveend: function () { ctx.paintHeatmap(); },
      zoomend: function () { ctx.paintHeatmap(); },
    });

    this.map.on('zoomstart', function(ev) {
      // zoom level changed... adjust heatmap layer options!
      ctx.heatLayer.setOptions({
          radius: ctx.getRadius(),
          max: 1.0,
          blur: 15,              
          gradient: {
              0.0: 'green',
              0.5: 'yellow',
              1.0: 'red'
          },
          minOpacity: 0.7
      });
      // render the new options
      ctx.heatLayer.redraw();
    });
  }

  dateSelected(event) {
    this.selectedDate = event.detail.value;
    this.heatLayer.setLatLngs([]);
    this.heatLayer.paintHeatmap();
  }

  paintHeatmap() {
    var bounds = this.map.getBounds();
    var heatArray = [41.3870154, 2.1678531];
    
    //TODO fer crida backend amb this.selectedDate
    for(var i; i < heatArray.length; i++) {
      this.heatLayer.addLatLng(heatArray[i], {radius: 25,
        max: 1.0,
        blur: 25,              
        gradient: {
            0.0: 'green',
            0.5: 'yellow',
            1.0: 'red'
        },
        minOpacity: 0.3}).addTo(this.map);
    }
    
  }

  getRadius(){
    var radius;
    var currentZoom = this.map.getZoom();
    console.log("Zoom lvl: "+currentZoom);
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
        radius = 14;
    }
    else if (currentZoom === 13) {
        radius = 18;
    }
    else if (currentZoom === 14) {
        radius = 22;
    }
    else if (currentZoom === 15) {
        radius = 32;
    }
    else if (currentZoom === 16) {
        radius = 36;
    }
    else if (currentZoom === 17) {
        radius = 40;
    }
    else if (currentZoom === 18) {
        radius = 45;
    }
    return radius;
}

    /*var draw=true;
    this.map.on({
        movestart: function () { draw = false; },
        moveend:   function () { draw = true; },
        mousemove: function (e) {
            if (draw) {
              heat.addLatLng(e.latlng);
            }
        }
    })*/

}

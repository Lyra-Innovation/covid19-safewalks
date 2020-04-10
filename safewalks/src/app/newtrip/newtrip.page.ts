import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import * as L from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-newtrip',
  templateUrl: './newtrip.page.html',
  styleUrls: ['./newtrip.page.scss'],
})
export class NewtripPage implements OnInit, AfterViewInit {
  //map
  map: L.Map;
  locationMarker: any;
  
  //date selector
  selectedDate: Date;
  
  //speed selector
  speed_selected = "walk";
  speed = {
    "walk": {},
    "running": {},
    "bicycle": {}
  }

  @ViewChild('pathDrawer', { static: false }) canvas: any;
  canvasElement: any;
  saveX: number;
  saveY: number;
 
  selectedColor = '#267ae0';
 
  drawing = false;
  lineWidth = 5;
 
  constructor(
    private geolocation: Geolocation,
    private plt: Platform,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.loadMap(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
      // Default location
      this.loadMap(41.3870154, 2.1678531);
    });
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
    });
  }

  //DRAWING FUNCTIONS
 
  ngAfterViewInit() {
    // Set the Canvas Element and its size
    this.canvasElement = this.canvas.nativeElement;
    //this.canvasElement.width = this.plt.width() + '';
    //this.canvasElement.height = this.plt.height() - 60;
  }
 
  startDrawing(ev) {
    this.clearCanvas();

    this.drawing = true;
    var canvasPosition = this.canvasElement.getBoundingClientRect();
 
    let position = this.getPositionTouch(ev);
    this.saveX = position.x - canvasPosition.x;
    this.saveY = position.y - canvasPosition.y;
  }
 
  endDrawing() {
    this.drawing = false;
  }

  moved(ev) {
    if (!this.drawing) return;
   
    var canvasPosition = this.canvasElement.getBoundingClientRect();
    let ctx = this.canvasElement.getContext('2d');
   
    let position = this.getPositionTouch(ev);
    let currentX = position.x - canvasPosition.x;
    let currentY = position.y - canvasPosition.y;

    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.selectedColor;
    ctx.lineWidth = this.lineWidth;
   
    ctx.beginPath();
    ctx.moveTo(this.saveX, this.saveY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();
   
    ctx.stroke();
   
    this.saveX = currentX;
    this.saveY = currentY;
  }

  clearCanvas() {
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);   
  }

  getPositionTouch(ev){
    if("touches" in ev){
      return {
        "x": ev.touches[0].pageX,
        "y": ev.touches[0].pageY
      };
    }
    else {
      return {
        "x": ev.screenX,
        "y": ev.screenY
      };
    }
  }

}

import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NavController } from '@ionic/angular';
import {Router,NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.page.html',
  styleUrls: ['./trips.page.scss'],
})
export class TripsPage {
  triplist = [];
  firstLoad = true;

  constructor(
    private api: ApiService,
    private navCtrl: NavController,
    private router: Router
  ) {
    router.events.subscribe((val) => {
      if(val instanceof NavigationEnd && (val.url == "/app/trips") && !this.firstLoad) {
        this.getTrips();
      }
    });
  }

  ionViewWillEnter() {
    this.getTrips();
  }

  getTrips() {
    this.api.post('Trip', 'getTrips').subscribe({
      next: (resp: {data: {trips: []}}) => {
        this.triplist = resp.data.trips;
        for(var i = 0; i < this.triplist.length; i++) {
          //date format
          var date = new Date(this.triplist[i].start_date*1000);
          this.triplist[i].start_date = {
            "year": date.getFullYear(),
            "month": date.getMonth()+1,
            "day": date.getDate(),
            "hour": date.getHours(),
            "minute": this.pad(date.getMinutes(), 2, 0) 
          }

          //duration format
          this.triplist[i].duration = Math.floor(this.triplist[i].duration/60);
        }
        this.firstLoad = false;
      },
      error: error => {
        console.error('There was an error!', error);
      }
    })
  }

  pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
}

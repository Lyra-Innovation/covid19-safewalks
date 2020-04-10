import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-trips',
  templateUrl: './trips.page.html',
  styleUrls: ['./trips.page.scss'],
})
export class TripsPage {
  triplist = [];

  constructor(
    private api: ApiService,
    private lang: TranslateService
  ) { }

  ionViewWillEnter() {
    this.api.post('Trip', 'getTrips').subscribe({
      next: (resp: {data: {trips: []}}) => {
        this.triplist = resp.data.trips;
        for(var i = 0; i < this.triplist.length; i++) {
          var date = this.triplist[i].start_date;
          this.triplist[i].start_date = {
            "year": date.slice(0, 4),
            "month": date.slice(5, 7),
            "day": date.slice(8, 10),
            "hour": date.slice(11, 13),
            "minute": date.slice(14, 16),
          }
        }
      },
      error: error => {
        console.error('There was an error!', error);
      }
    })
  }

}

/*
5km/h
10
15
*/
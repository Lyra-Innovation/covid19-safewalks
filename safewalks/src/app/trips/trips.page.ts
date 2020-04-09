import { Component } from '@angular/core';
import { TripItemInfo } from '../tripiteminfo'
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-trips',
  templateUrl: './trips.page.html',
  styleUrls: ['./trips.page.scss'],
})
export class TripsPage {
  triplist = [];

  constructor(
    private api: ApiService,
  ) { }

  ionViewWillEnter() {
    this.api.post('Trip', 'getTrips').subscribe({
      next: (resp: {data: []}) => {
        this.triplist = resp.data;
        console.log(this.triplist)
      },
      error: error => {
        console.error('There was an error!', error);
      }
    })
  }

}

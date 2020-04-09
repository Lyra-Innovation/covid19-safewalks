import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TripsPage } from './trips.page';
import { SharedModule } from '../shared.module';
import { TripitemComponent } from '../components/tripitem/tripitem.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: TripsPage }])
  ],
  declarations: [TripsPage, TripitemComponent]
})
export class TripsPageModule {}

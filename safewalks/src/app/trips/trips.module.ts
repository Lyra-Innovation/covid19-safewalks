import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TripsPage } from './trips.page';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: TripsPage }])
  ],
  declarations: [TripsPage]
})
export class TripsPageModule {}

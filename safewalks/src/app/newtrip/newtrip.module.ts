import { NgModule } from '@angular/core';
import { NewtripPageRoutingModule } from './newtrip-routing.module';
import { NewtripPage } from './newtrip.page';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    SharedModule,
    NewtripPageRoutingModule
  ],
  declarations: [NewtripPage]
})
export class NewtripPageModule {}

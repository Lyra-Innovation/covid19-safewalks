import { NgModule } from '@angular/core';
import { ViewtripPageRoutingModule } from './viewtrip-routing.module';
import { ViewtripPage } from './viewtrip.page';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    SharedModule,
    ViewtripPageRoutingModule
  ],
  declarations: [ViewtripPage]
})
export class ViewtripPageModule {}

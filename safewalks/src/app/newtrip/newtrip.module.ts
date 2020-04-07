import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewtripPageRoutingModule } from './newtrip-routing.module';

import { NewtripPage } from './newtrip.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewtripPageRoutingModule
  ],
  declarations: [NewtripPage]
})
export class NewtripPageModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewtripPage } from './newtrip.page';

const routes: Routes = [
  {
    path: '',
    component: NewtripPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewtripPageRoutingModule {}

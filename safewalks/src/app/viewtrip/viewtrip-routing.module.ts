import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewtripPage } from './viewtrip.page';

const routes: Routes = [
  {
    path: '',
    component: ViewtripPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewtripPageRoutingModule {}

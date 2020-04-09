import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HeatmapPage } from './heatmap.page';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: HeatmapPage }])
  ],
  declarations: [HeatmapPage]
})
export class HeatmapPageModule {}

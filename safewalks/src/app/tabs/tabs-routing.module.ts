import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/app/trips',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'trips',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../trips/trips.module').then(m => m.TripsPageModule)
          }
        ]
      },
      {
        path: 'heatmap',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../heatmap/heatmap.module').then(m => m.HeatmapPageModule)
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../profile/profile.module').then(m => m.ProfilePageModule)
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}

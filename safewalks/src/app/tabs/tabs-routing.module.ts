import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
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
      },
      {
        path: '',
        redirectTo: '/tabs/trips',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/trips',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'trips',
    loadChildren: () => import('./trips/trips.module').then( m => m.TripsPageModule)
  },
  {
    path: 'heatmap',
    loadChildren: () => import('./heatmap/heatmap.module').then( m => m.HeatmapPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'newtrip',
    loadChildren: () => import('./newtrip/newtrip.module').then( m => m.NewtripPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

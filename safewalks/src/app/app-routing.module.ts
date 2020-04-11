import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuardGuard } from './guards/login-guard.guard';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  //private pages
  {
    path: 'app',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'newtrip',
    loadChildren: () => import('./newtrip/newtrip.module').then( m => m.NewtripPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'viewtrip/:id',
    loadChildren: () => import('./viewtrip/viewtrip.module').then( m => m.ViewtripPageModule),
    canActivate: [AuthGuard]
  },
  
  //public pages
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate: [LoginGuardGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule),
    canActivate: [LoginGuardGuard]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    TranslateModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

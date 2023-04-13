import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from './core/_guards/login.guard';
import { LogoutGuard } from './core/_guards/logout.guard';


const routes: Routes = [
  { path: '', loadChildren: () => import('./deallog/deallog.module').then(m => m.DeallogModule)},
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
  { path: 'deallog', loadChildren: () => import('./deallog/deallog.module').then(m => m.DeallogModule) },
  { path: 'dealprogress', loadChildren: () => import('./dealprogress/dealprogress.module').then(m => m.DealprogressModule)},
  { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule)},
  { path: 'roles', loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule)},
  { path: 'storesetup', loadChildren: () => import('./storesetup/storesetup.module').then(m => m.StoresetupModule) },
  { path: 'messenger', loadChildren: () => import('./messenger/messenger.module').then(m => m.MessengerModule) },
  { path: 'tasq', loadChildren: () => import('./tasq/tasq.module').then(m => m.TasqModule) },
  { path: 'chatapp', loadChildren: () => import('./chatapp/chatapp.module').then(m => m.ChatappModule) },
 // { path: 'deallog/token', loadChildren: () => import('./deallog/deallog.module').then(m => m.DeallogModule) },
 // { path: ':token', loadChildren: () => import('./deallog/deallog.module').then(m => m.DeallogModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

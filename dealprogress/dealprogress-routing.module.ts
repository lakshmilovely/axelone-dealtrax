import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DealprogressComponent } from './dealprogress.component';

const routes: Routes = [{ path: '', component: DealprogressComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealprogressRoutingModule { }

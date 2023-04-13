import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeallogComponent } from './deallog.component';

const routes: Routes = [{ path: '', component: DeallogComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeallogRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasqComponent } from './tasq.component';

const routes: Routes = [{ path: '', component: TasqComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasqRoutingModule { }

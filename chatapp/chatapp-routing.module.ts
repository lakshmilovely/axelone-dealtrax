import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatappComponent } from './chatapp.component';

const routes: Routes = [{ path: '', component: ChatappComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatappRoutingModule { }

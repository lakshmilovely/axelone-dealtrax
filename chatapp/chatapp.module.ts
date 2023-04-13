import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatappRoutingModule } from './chatapp-routing.module';
import { ChatappComponent } from './chatapp.component';
import { HeaderModule } from '../header/header.module';


@NgModule({
  declarations: [
    ChatappComponent
  ],
  imports: [
    CommonModule,
    ChatappRoutingModule,
    HeaderModule
  ]
})
export class ChatappModule { }

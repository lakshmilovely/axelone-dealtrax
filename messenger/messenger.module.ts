import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessengerRoutingModule } from './messenger-routing.module';
import { MessengerComponent } from './messenger.component';
import { HeaderModule } from '../header/header.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MessengerComponent
  ],
  imports: [
    CommonModule,
    MessengerRoutingModule,
    HeaderModule,
    FormsModule
  ]
})
export class MessengerModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasqRoutingModule } from './tasq-routing.module';
import { TasqComponent } from './tasq.component';
import { HeaderModule } from '../header/header.module';


@NgModule({
  declarations: [
    TasqComponent
  ],
  imports: [
    CommonModule,
    TasqRoutingModule,
    HeaderModule
  ]
})
export class TasqModule { }

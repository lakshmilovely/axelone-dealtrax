import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderModule } from '../header/header.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModuleModule } from '../core/SharedModule/shared-module/shared-module.module';

@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    HeaderModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    SharedModuleModule,
    NgxSpinnerModule
  ]
})
export class UserModule {


 }

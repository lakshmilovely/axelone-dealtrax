import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { StoresetupRoutingModule } from './storesetup-routing.module';
import { StoresetupComponent } from './storesetup.component';
import { HeaderModule } from '../header/header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    StoresetupComponent
  ],
  imports: [
    CommonModule,
    StoresetupRoutingModule,
    HeaderModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),

  ]
})
export class StoresetupModule { }

import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DealprogressRoutingModule } from './dealprogress-routing.module';
import { DealprogressComponent } from './dealprogress.component';
import { HeaderModule } from '../header/header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgxSummernoteModule } from 'ngx-summernote';
// import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';



@NgModule({
  declarations: [DealprogressComponent],
  imports: [
    CommonModule,
    DealprogressRoutingModule,
    HeaderModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    // OwlDateTimeModule,
    // OwlNativeDateTimeModule,
    // NgxSummernoteModule
  ],
  providers:[DatePipe,CurrencyPipe]
})
export class DealprogressModule { }

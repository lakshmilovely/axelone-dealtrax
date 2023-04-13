import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common'
import { HeaderComponent } from './header.component';
import {RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { FilterComponent } from './filter/filter.component';


@NgModule({
  declarations: [HeaderComponent, FilterComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  exports: [HeaderComponent],
})
export class HeaderModule { }

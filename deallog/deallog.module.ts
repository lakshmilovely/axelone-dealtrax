import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeallogRoutingModule } from './deallog-routing.module';
import { DeallogComponent } from './deallog.component';
import { HeaderModule } from '../header/header.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModuleModule } from '../core/SharedModule/shared-module/shared-module.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { SortDirective } from '../core/_providers/sort.directive';
//import { ActionComponent } from '../action/action.component';
//  import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';



@NgModule({
  declarations: [DeallogComponent],
  imports: [
    CommonModule,
    DeallogRoutingModule,
    HeaderModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    SharedModuleModule,
    Ng2SearchPipeModule,
    // OwlDateTimeModule, OwlNativeDateTimeModule,
    NgMultiSelectDropDownModule.forRoot(),
    // SortDirective

  ]
})
export class DeallogModule { }

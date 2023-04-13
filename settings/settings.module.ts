import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { HeaderModule } from '../header/header.module';
import { SettingsService } from '../core/_services/settings.service';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxSpinnerModule
  ],
  providers:[SettingsService]

})
export class SettingsModule { }

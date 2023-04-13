import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderModule } from '../header/header.module';
import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SortDirective } from '../core/_providers/sort.directive';
import { SharedModuleModule } from '../core/SharedModule/shared-module/shared-module.module';

@NgModule({
  declarations: [
    RolesComponent,
    SortDirective

  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    HeaderModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModuleModule
  ]
})
export class RolesModule { }

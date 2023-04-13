import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {LoginService} from './core/_services/login.service';
import { SharedModuleModule } from './core/SharedModule/shared-module/shared-module.module';
import { ActionComponent } from './action/action.component';
import { HeaderModule } from './header/header.module';
// import { NgxSummernoteModule } from 'ngx-summernote';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


@NgModule({
  declarations: [
    AppComponent,
    ActionComponent,

    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SharedModuleModule,
    // NgxSummernoteModule
    OwlDateTimeModule, OwlNativeDateTimeModule,
    HeaderModule
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }

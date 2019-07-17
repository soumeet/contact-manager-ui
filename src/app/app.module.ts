import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AddContactComponent } from './add-contact/add-contact.component';

import { BaseService } from './services/base.service';
import { ContactService } from './services/contact.service';
import { EmailService } from './services/email.service';
import { PhoneService } from './services/phone.service';
import { HttpService } from './services/http.service';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { KeyFilterModule } from 'primeng/keyfilter';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AddContactComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    KeyFilterModule,
    AutoCompleteModule,
    SidebarModule,
    TooltipModule,
    FileUploadModule,
    ToastModule
  ],
  providers: [BaseService, ContactService, EmailService, PhoneService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }

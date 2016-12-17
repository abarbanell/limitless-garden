import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { NavbarComponent } from './navbar.component';
import { NotFoundComponent } from './not-found.component';
import { ContactComponent } from './contact.component';
import { HomeComponent } from './home.component';
import { routing } from './app.routing';

@NgModule({
  imports:      [ BrowserModule, routing ],
  declarations: [ AppComponent, 
                  NavbarComponent,  
                  HomeComponent, 
                  ContactComponent, 
                  NotFoundComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
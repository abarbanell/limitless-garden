import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { NavbarComponent } from './navbar.component';
import { NotFoundComponent } from './not-found.component';
import { routing } from './app.routing';

@NgModule({
  imports:      [ BrowserModule, routing ],
  declarations: [ AppComponent, NavbarComponent, NotFoundComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
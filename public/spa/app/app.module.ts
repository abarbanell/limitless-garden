// Angular imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';

// Services
import { DataService } from "./data.service";
import { AuthService } from "./auth.service";

// routing
import { routing } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { CollectionsComponent } from './collections/collections.component';
import { DataComponent } from './data/data.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    CollectionsComponent,
    DataComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    routing
  ],
  providers: [
    AuthService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedin = false;
  userName = "not logged in";

  constructor(
    private _authService: AuthService, 
    private _router: Router,
    private cdRef:ChangeDetectorRef
  ) { 
    console.log("NavbarComponent.constructor()");
    this._authService.initialized.subscribe(s => {
      this.isLoggedin = s;
      this.userName = this._authService.user.displayName;
      this.cdRef.detectChanges();
      console.log("NavBarComponent got auth status: "+ s + this._authService.user)
    })
  }

  ngOnInit() {
    console.log("NavbarComponent.ngOnInit()");

  }
}
import { Component, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService, IProfile } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedin = false;
  userName = "not logged in";
  profile: IProfile;

  constructor(
    private _authService: AuthService, 
    private _router: Router,
    private cdRef:ChangeDetectorRef
  ) { 
    console.log("NavbarComponent.constructor()");
    this._authService.listen.subscribe(u => {
      this.profile = u;
      this.isLoggedin = (u.httpStatus == 200);
      this.userName = this.profile.displayName;
      // this.cdRef.detectChanges();
      console.log("NavBarComponent got auth status: "+ this.profile.httpStatus)
    })
  }
}
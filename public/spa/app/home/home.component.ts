import { Component, OnInit } from '@angular/core';

import { AuthService, IProfile } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedin = false;
  
  title = 'Home Component';
  
  constructor(private _authService: AuthService) {

  }

  ngOnInit() {
    this._authService.listen.subscribe(u => {
      this.isLoggedin = (u.httpStatus == 200);
      console.log("HomeComponent got auth status: "+ u.httpStatus)
    })
  }

}
import { Component, OnInit } from '@angular/core';

import { AuthService, IProfile } from '../auth.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedin = false;
  collections: string[] = []; 
  collectionCount: number = 0;

  title = 'Home Component';
  
  constructor(
    private _authService: AuthService,
    private _dataService: DataService) {

  }

  ngOnInit() {
    this._authService.listen.subscribe(u => {
      this.isLoggedin = (u.httpStatus == 200);
      // console.log("HomeComponent got auth status: "+ u.httpStatus)
      this.getCollections()
    })
  }

  private getCollections() {
    this._dataService.getCollections().subscribe(s => {
      this.collections = s;
      this.collectionCount = s.length
    })
  }

}
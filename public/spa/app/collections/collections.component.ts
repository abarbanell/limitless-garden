import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import { AuthService, IProfile } from '../auth.service';
import { DataService } from '../data.service';

@Component({
  selector: 'spa-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {
  isLoggedin = false;
  title = "CollectionsComponent";
  coll = "[]";

  data = [
    {json: "dummy json 1"},
    {json: "dummy json 2"},
    {json: "dummy json 3"},
    {json: "dummy json 4"}
  ]
  
  constructor(
    private _authService: AuthService
    , private _dataService: DataService
    , private _route: ActivatedRoute
  ) {

  }

 ngOnInit() {
    this._authService.listen.subscribe(u => {
      this.isLoggedin = (u.httpStatus == 200);
      // console.log("CollectionsComponent got auth status: "+ u.httpStatus)
    })
    this._route.params.subscribe( params => {
      //console.log(params);
      this.coll = params["coll"];
     });
  }

}

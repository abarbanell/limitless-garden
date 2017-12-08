import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import { AuthService, IProfile } from '../auth.service';
import { DataService, ICollectionData } from '../data.service';

@Component({
  selector: 'spa-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {
  isLoggedin = false;
  title = "CollectionsComponent";

  data: ICollectionData;
  
  constructor(
    private _authService: AuthService
    , private _dataService: DataService
    , private _route: ActivatedRoute
  ) {

  }

 ngOnInit() {
    this._authService.listen.subscribe(u => {
      this.isLoggedin = (u.httpStatus == 200);
    })
    this._route.params.subscribe( params => {
      let coll = params["coll"];
      this._dataService
        .getCollectionData(coll)
        .subscribe(d => {
          this.data = d
        });
     });
  }

}

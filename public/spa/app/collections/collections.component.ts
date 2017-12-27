import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { AuthService, IProfile } from '../auth.service';
import { DataService, ICollectionData, CollectionData } from '../data.service';

@Component({
  selector: 'spa-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {
  isLoggedin = false;
  title = "CollectionsComponent";
  errorMsg="";
  infoMsg="";
  isLoading = true;
  isDeleting: string = "";
  colName: string = "";

  data: ICollectionData = new CollectionData();

  constructor(
    private _authService: AuthService
    , private _dataService: DataService
    , private _route: ActivatedRoute
  ) {

  }

  private load() {
    this.isLoading = true;
    this._dataService
      .getCollectionData(this.colName)
      .subscribe(d => {
        this.data = d;
        this.isLoading = false;
      });
  }

  ngOnInit() {
    this._authService.listen.subscribe(u => {
      this.isLoggedin = (u.httpStatus == 200);
    })
    this._route.params.subscribe(params => {
      this.colName = params["coll"];
      this.load();
    });
  }

  onDelete(id: string) {
    this.isDeleting=id;
    this._dataService.deleteRow(this.colName, id).subscribe(s => {
      if (s.rc == "OK") { 
        this.info("deleted ID: " + id)
        // this.form.reset()// reset form to be untouched, clear fields
        this.load();
        this.isDeleting = "";
      } else {
        this.error("response from delete: " + JSON.stringify(s));
        this.isDeleting = "";
      }
    }, e => {
      this.error('delete returned error: ' + e);
      this.isDeleting = "";
    });
  }

  private info(s: string) {
    this.infoMsg = s;
    this.errorMsg = "";
  }

  private error(s: string) {
    this.errorMsg = s;
    this.infoMsg = "";
  }
}

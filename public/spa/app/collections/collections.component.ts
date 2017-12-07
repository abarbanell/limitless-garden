import { Component, OnInit } from '@angular/core';
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
  data = [
    {json: "dummy json 1"},
    {json: "dummy json 2"},
    {json: "dummy json 3"},
    {json: "dummy json 4"}
  ]
  
  constructor(
    private _authService: AuthService,
    private _dataService: DataService) {

  }

 ngOnInit() {
    this._authService.listen.subscribe(u => {
      this.isLoggedin = (u.httpStatus == 200);
      console.log("CollectionsComponent got auth status: "+ u.httpStatus)
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';

@Component({
  selector: 'spa-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  isLoggedin = false;
  collections: string[] = []; 
  collectionCount: number = 0;

  title = 'Data Component';
  
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

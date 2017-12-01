import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';


@Injectable()
export class DataService {
  private _url = "/api/collections";
  private _baseurl = "";

  constructor(private _http: HttpClient) { }

  getCollections() {
    // return Observable.of([
    //   "table1",
    //   "table2",
    //   "table3"
    // ]);
    return this._http.get<string[]>(this._baseurl + this._url);
    
  }

}

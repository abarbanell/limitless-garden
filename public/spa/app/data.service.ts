import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';


@Injectable()
export class DataService {
  private _url = "/api/collections";

  constructor(private _http: HttpClient) { }

  getCollections() {
    // return Observable.of([
    //   "table1",
    //   "table2",
    //   "table3"
    // ]);
    return this._http.get<string[]>(this._url);
    
  }

  getCollectionData2(coll: string) {
    let data: IDataServiceObject[] = [
      new DataServiceObject("service json 1"),
      new DataServiceObject("service json 2"),
      new DataServiceObject("service json 3"),
      new DataServiceObject("service json 4"),
      new DataServiceObject("service json 5")
    ];
    return Observable.of(data);
  }

  getCollectionData(coll: string) {
  //   let data = [
  //     {json: "service json 1"},
  //     {json: "service json 2"},
  //     {json: "service json 3"},
  //     {json: "service json 4"}
  //   ];
      return this._http.get<Object[]>(this._url + "/" + coll)
      .map(r => { 
         let d: IDataServiceObject[] = [];
         for (let s of r) {
           let o = new DataServiceObject(JSON.stringify(s))
           d.push(o);
         }
          return d
       });
  }
}

export interface IDataServiceObject {
  json: string
}

class DataServiceObject implements IDataServiceObject {
  json: string

  constructor(s?: string) {
    this.json = s || "";
  }
}

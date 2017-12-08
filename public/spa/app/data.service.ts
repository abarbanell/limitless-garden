import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';


@Injectable()
export class DataService {
  private _url = "/api/collections";

  constructor(private _http: HttpClient) { }

  getCollections() {
    return this._http.get<string[]>(this._url)
  }

  getCollectionData(coll: string): Observable<ICollectionData> {
      return this._http.get<Object[]>(this._url + "/" + coll, { observe: 'response'})
      .map(r => { 
         let d = new CollectionData(coll);
         d.count = Number(r.headers.get('X-Total-Count'));

         for (let s of r.body) {
           let o = new CollectionRow(JSON.stringify(s))
           d.push(o);
         }
         console.log(d);
         return d
       });
  }
}

export interface ICollectionRow {
  json: string
}

class CollectionRow implements ICollectionRow {
  json: string

  constructor(s?: string) {
    this.json = s || "";
  }
}

export interface ICollectionData {
  name: string,
  count: number,
  rows: ICollectionRow[]
}

class CollectionData implements ICollectionData {
  name: string;
  count: number;
  rows: ICollectionRow[];

  constructor(name: string, count?: number) {
    this.name = name;
    this.count = count || 0;
    this.rows = [];
  }
  push(row: ICollectionRow) {
    this.rows.push(row);
  }
}

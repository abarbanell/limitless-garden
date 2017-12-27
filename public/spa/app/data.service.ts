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

  getCollectionData(coll: string, offset?: number, limit?: number): Observable<ICollectionData> {
    offset = offset || 0;
    limit = limit || 10;  
    return this._http.get<Object[]>(
        this._url + "/" + coll + "?filldate=1&offset=" + offset + "&limit=" + limit,
        { observe: 'response' }
      ).map(r => { 
         let d = new CollectionData(coll, 
            Number(r.headers.get('X-Total-Count')),
            offset,
            limit
          );

         for (let s of r.body) {
           let o = new CollectionRow(JSON.stringify(s))
           d.push(o);
         }
         return d
       });
  }

  deleteRow(collectionName: string, id: string): Observable<DataServiceResponse> {
      var url = this._url + "/" + collectionName + "/" +  id;
      // var headers = new Headers({});
      // var options= new RequestOptions({
      //   headers: headers,
      //   search: "user_key=" + this._user_key
      // });
      return this._http.delete<MongoDeleteResponse>(url)
        .map(this._mapDeleteResponse)
        // .catch(this.handleError);
    }

    private _mapDeleteResponse(result: MongoDeleteResponse): DataServiceResponse {
      var rc = result.ok == 1 ? 
        { rc: "OK", n: result.n } : { rc: "ERROR", n: result.n };
      return rc;
    }
    
  
}

export class DataServiceResponse {
  rc: string;
  constructor(s: string) {
    this.rc = s;
  }
}

class MongoDeleteResponse {
  public ok: number;
  public n: number;
}

export interface ICollectionRow {
  id: string,
  date: string,
  obj: any
}

class CollectionRow implements ICollectionRow {
  id: string; 
  date: string; 
  obj: any;

  constructor(s?: string) {
    this.obj = JSON.parse(s) || {};
    this.id = this.obj._id || "unknown ID";
    this.date = this.obj.date || "unknown date"
  }
}

export interface ICollectionData {
  name: string,
  count: number,
  offset: number,
  limit: number,
  rows: ICollectionRow[]
}

export class CollectionData implements ICollectionData {
  name: string;
  count: number;
  offset: number;
  limit: number;
  rows: ICollectionRow[];

  constructor(name?: string, count?: number, offset?: number, limit?: number) {
    this.name = name || "";
    this.count = count || 0;
    this.offset = offset;
    this.limit = limit
    this.rows = [];
  }
  push(row: ICollectionRow) {
    this.rows.push(row);
  }
}

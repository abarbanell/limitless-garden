import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';

@Injectable()
export class AuthService {
  private _url = "/api/me";

  //public user: IProfile = new Profile();
  public listen = new BehaviorSubject<IProfile>(new Profile());

  constructor(private _http: HttpClient) {
    this.getProfile().subscribe(u => {
      this.listen.next(u);
    })
  }

  public getProfile(): Observable<IProfile> {
    return this._http.get(this._url)
    .map(res => {
      let p: IProfile = new Profile();
      p.displayName = res['user'].profile.displayName; // TODO: need dig deeper in resource object, once we get it....
      p.rc = res['rc'] || "UNDEFINED"
      if ( p.rc == "OK") {
        p.httpStatus = 200;        
      } else { 
        p.httpStatus = 403;
      }
      return p;
    })
    .catch(e => {
      console.log("AuthService.getProfile error object: " +  JSON.stringify(e));
      let p: IProfile = new Profile();
      p.httpStatus = e['status'] || 0;
      p.rc = e['statusText'] || "";
      p.displayName = ""
      return Observable.of(p)
    })
  }

}

export interface IProfile {
  displayName: string,
  rc: string,
  httpStatus: number
}

export class Profile implements IProfile {
  displayName: string;
  rc: string;
  httpStatus: number;

  constructor() {
    this.displayName = "I. N. Itializing";
    this.rc = "INITIALIZING";
    this.httpStatus = 503;
  } 
}



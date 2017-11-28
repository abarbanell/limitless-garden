import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';

@Injectable()
export class AuthService {
  private _url = "/api/me";
  private _baseurl = "";

  public user: IProfile;
  public listen = new Subject<IProfile>();

  constructor(private _http: HttpClient) {
    this.getProfile().subscribe(u => {
      this.user = u;
      this.listen.next(u);
    })
  }

  public authenticated() {
    return true;
  }

  getProfile(): Observable<IProfile> {
    return this._http.get<Object>(this._baseurl + this._url).map(res => {
      let p = new Profile();
      p.displayName = res['user'].profile.displayName; // TODO: need dig deeper in resource object, once we get it....
      p.rc = res['rc'] || "UNDEFINED"
      p.httpStatus = 200;
      console.log("AuthService.getProfile response status: "+ p.httpStatus);
      return p;
    }).catch(e => {
      let p = new Profile();
      p.httpStatus = e.status;
      p.rc = e.statusText;
      p.displayName = ""
      console.log("AuthService.getProfile catch status: "+ p.httpStatus);
      return Observable.of(p)
    })
  }

}

export interface IProfile {
  displayName: string,
  rc: string,
  httpStatus: number
}

class Profile implements IProfile {
  displayName: string;
  rc: string;
  httpStatus: number;
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';

@Injectable()
export class AuthService {
  private _url = "/api/me?user_key=true";
  private _baseurl = "http://localhost:5000";

  public user: any;
  public initializing = true;

  constructor(private _http: HttpClient) {
    this.getProfile().subscribe(u => {
      this.user = u;
      this.initializing = false;
    })
  }

  public authenticated() {
    return true;
  }

  getProfile(): Observable<any> {
    return this._http.get<Object>(this._baseurl + this._url)
  }

}

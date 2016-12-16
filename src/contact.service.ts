import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ContactService {
  getContact() : Observable<Contact> {
    return Observable.from([{
      title: "Limitless Spa",
      text: "This is a Single Page Application connecting to the Limitless Garden API backend",
      repoUrl: "https://github.com/abarbanell/limitless-garden"
    }]);
  }
}

export interface Contact{
  title: string,
  text: string,
  repoUrl: string,
}
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class DataService {

  constructor() { }

  getCollections() {
    return Observable.of([
      "table1",
      "table2",
      "table3"
    ]);
  }

}

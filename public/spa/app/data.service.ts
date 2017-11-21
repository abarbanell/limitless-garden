import { Injectable } from '@angular/core';

@Injectable()
export class DataService {

  constructor() { }

  getCollections() {
    return [
      "table1",
      "table2",
      "table3"
    ]
  }

}

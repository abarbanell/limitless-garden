var logger = require('../util/logger');
var db = require('../util/db');

export class SensorModel {
  private  _schema_version = 1;
  private _dummyval: ISensor[] = [{
    _id: "id17"
  }];

  get(): ISensor[] {
    return this._dummyval;
  }

  getByID(id: string): ISensor {
    return this._dummyval[0];
  }

  post(data: ISensor): string {
    var id: string = "error";
    return id;
  }
}

export interface ISensor {
  _id: string,
}
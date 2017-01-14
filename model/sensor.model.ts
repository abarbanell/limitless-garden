var logger = require('../util/logger');
var db = require('../util/db');
import mongodb = require('mongodb');

export class SensorModel {
  private  _schema_version = 1;
  private _dummyval: ISensor[] = 
  [{
    _id: "id17",
    name: "sensor 1",
    host: "rpi99",
    type: {
      name: "soil"
    }
  },{
        _id: "id18",
    name: "sensor 2",
    host: "rpi97",
    type: {
      name: "temp"
    }
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

// our payload data model: 
interface SensorPayload {
  name: string,
  host: string,
  type: {
    name: string,
    uom?: string,
    min?: number,
    max?: number,
    tolerance?: number
  }
}

// this should be the object stored in DB. 
// payload plus mongo id plus schema_version
// 
interface MongoSensor extends SensorPayload {
  _id: mongodb.ObjectId,
  schema_version: 1 //0 reserved for rows without schema_version field
}

// exposed interface 
export interface ISensor extends SensorPayload {
  _id: string
}
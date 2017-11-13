var logger = require('../util/logger');
var db = require('../util/db');
import mongodb = require('mongodb');
import { Observable, Subject } from 'rxjs/Rx';
import * as util from 'util';


export class SensorModel {
  private _schema_version = 1;
  private static _collectionName = db.collectionName('model.sensor');
  private static _dataCollectionName = db.collectionName('model.sensorData');
  private static  _instance: SensorModel = null;
  private static _indexName: string = null;

  private constructor() {
    this.createIndex();
  }

  private createIndex() {
    logger.error("model.sensor.createIndex - called");
    var options = {unique:true, background:true, w:1};
    db.connect(function(err, dbObj) {
      var collection = dbObj.collection(SensorModel._collectionName);
      // delete all - remove this later...
      collection.deleteMany({}, function (e, results) {
        collection.createIndex({name:1}
          , options, function(err: string, indexName: string) {
            logger.error("model.sensor.createIndex - callback");
            if (err) {
              logger.error("model.sensor.createIndex - error: %s", err);         
            }
            if (indexName) {
              SensorModel._indexName = indexName;
              logger.error("model.sensor.createIndex - indexName: %s", util.inspect(indexName));            
            }
        });
      });
    });
    logger.error("model.sensor.createIndex - return(void)");    
  }

  static getInstance() {
    if (SensorModel._instance == null) {
      SensorModel._instance = new SensorModel();
    }
    return SensorModel._instance;
  }

  get(): Observable<ISensor[]> {
    var cn = SensorModel._collectionName;
    var obs = new Subject<ISensor[]>();
    var sv = this._schema_version;
    db.connect(function(err, dbObj) {
      var coll = dbObj.collection(cn);
      try {
        coll.find({ schema_version: sv }).toArray().then(function(docs) {
          obs.next(docs);
        })
      } catch (ex) {
        obs.error(ex);
      }
    }); 
    return obs.asObservable();
  }

  getById(id: string): Observable<ISensor> {
    var cn = SensorModel._collectionName;
    var obs = new Subject<ISensor>();

    db.connect(function (err, dbObj) {
      var coll = dbObj.collection(cn);
      try {
        var oid = mongodb.ObjectID.createFromHexString(id)
        coll.findOne({ _id: oid }, {}, function (e, results) {
          if (e) {
            logger.error("SensorModel.getById.findOne: ", e);
            obs.error(e);
          }
          if (results && results._id) {
            if (results._id instanceof mongodb.ObjectID) {
              results._id = results._id.toString();
            }     
          }
          obs.next(results);
        });
      } catch (ex) {
        obs.error(ex);
      }
    });
    return obs.asObservable();
  }

  post(data: ISensor): Observable<string> {
    let id: string = "error";
    if (!data.name) {
      data.name = data.host + "." + data.type;
      logger.error("sensor.post(): name set to %s", data.name);
    }
    let ms = new MongoSensor(data);
    let obs = new Subject<string>();
    let cn = SensorModel._collectionName;

    db.connect(function(err,dbObj){
      let coll = dbObj.collection(cn);
      try {
        coll.insert(ms, {}, function(e, results){
          if (e) {
            return obs.error("insert error: "+ e)
          }
          if (results) {
            return obs.next(results.ops[0]._id.toString());
          }
        });
      } catch (ex) {
        obs.error("exception: " + ex);
      }
   })
    return obs.asObservable();
  }

  postData(sensorId: string, host: string, type: string, val: number) {
    var obs = new Subject<string>();
    var mongoSensorId: mongodb.ObjectID;
    try {
      logger.error("sensor.postData() - try to convert to ObjectID: %s [%s]", sensorId, typeof(sensorId))
      mongoSensorId = mongodb.ObjectID.createFromHexString(sensorId.toString())
      db.connect(function(err,dbObj){
        var coll = dbObj.collection(SensorModel._dataCollectionName);
        coll.insert({
          sensorId: mongoSensorId,
          host: host,
          type: type,
          val: val
        }, {}, function(e, results){
          if (e) {
            var msg = e.toString();
            logger.error(msg);
            obs.error(msg);
          }
          if (results) {
            obs.next(results.ops[0]._id.toString());
          }
        })
      })
    } catch (e) {
      logger.error("sensor.postData() - could not convert to ObjectID: %s, error: %s", 
            sensorId, e.toString())
      obs.error(e.toString())
    }

    return obs.asObservable();
  };


  delete(id: string): Observable<Number> {
    var cn = SensorModel._collectionName;
    var obs = new Subject<Number>();

    db.connect(function (err, dbObj) {
      var coll = dbObj.collection(cn);
      try {
        var oid = mongodb.ObjectID.createFromHexString(id)
        coll.deleteOne({ _id: oid }, function (e, results) {
          if (e) {
            obs.error(e);
          }
          if (results) {
            obs.next(results.deletedCount);
          }
        });
      } catch (ex) {
        obs.error(ex);
      }
    });
    return obs.asObservable();
  }

  deleteAll(): Observable<Number> {
    var cn = SensorModel._collectionName;
    var obs = new Subject<Number>();

    db.connect(function (err, dbObj) {
      var coll = dbObj.collection(cn);
      try {
        coll.deleteMany({}, function (e, results) {
          if (e) {
            obs.error(e);
          }
          if (results) {
            obs.next(results.deletedCount);
          }
        });
      } catch (ex) {
        obs.error(ex);
      }
    });
    return obs.asObservable();
  }


  getCollectionName(): string {
    return SensorModel._collectionName;
  }

  getByHost(host: string): Observable<ISensor[]> {
    var cn = SensorModel._collectionName;
    var obs = new Subject<ISensor[]>();
    
    db.connect(function (err, dbObj) {
      var coll = dbObj.collection(cn);
      try {
        coll.find({ host: host }, {}, function (e, results) {
          if (e) {
            obs.error(e);
          }
          results.toArray(function(err, docs) {
            obs.next(docs);
          })
        });
      } catch (ex) {
        obs.error(ex);
      }
    });
    return obs.asObservable();
  }

  find(pattern: ISensor): Observable<ISensor[]> {
    var cn = SensorModel._collectionName;
    var obs = new Subject<ISensor[]>();
    var mpattern = this.mongofy(pattern);
    db.connect(function (err, dbObj) {
      var coll = dbObj.collection(cn);
      try {
        coll.find(mpattern, {}, function (e, results) {
          if (e) {
            obs.error(e);
          }
          results.toArray(function(err, docs) {
            obs.next(docs);
          })
        });
      } catch (ex) {
        obs.error(ex);
      }
    });
    return obs.asObservable();
  } 

  private mongofy(s: ISensor):any {
    var lrc: any = {};
    if (s._id) {
      lrc._id = new mongodb.ObjectId.createFromHexString(s._id)
    }
    if (s.host) {
      lrc.host = s.host
    }
    if (s.name) {
      lrc.name = s.name
    }
    if (s.type) {
      lrc.type = s.type;
    }
    return lrc;
  }
}

// our payload data model: 
interface SensorPayload {
  name: string,
  host: string,
  type: string
}

// this should be the object stored in DB. 
// payload plus mongo id plus schema_version
// 
interface IMongoSensor extends SensorPayload {
  _id: mongodb.ObjectId,
  schema_version: number //0 reserved for rows without schema_version field
}

// exposed interface 
export interface ISensor extends SensorPayload {
  _id?: string
}

export class Sensor implements ISensor {
  _id?: string;
  name: string;
  host: string;
  type: string;
}

class MongoSensor implements IMongoSensor { 
  _id = null;
  schema_version = 1;
  name = null;
  host = null;
  type = null;

  constructor(is: ISensor) {
    if (is._id) {
      this._id = new mongodb.ObjectId.createFromHexString(is._id);
    }
    this.name = is.name;
    this.host = is.host;
    this.type = is.type;
  }
}
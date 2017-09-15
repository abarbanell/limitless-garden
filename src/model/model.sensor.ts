var logger = require('../util/logger');
var db = require('../util/db');
import mongodb = require('mongodb');
import { Observable, Subject } from 'rxjs/Rx';
import * as util from 'util';


export class SensorModel {
  private _schema_version = 1;
  private _collectionName = db.collectionName('model.sensor');

  get(): Observable<ISensor[]> {
    var cn = this._collectionName;
    var obs = new Subject<ISensor[]>();
    db.connect(function(err, dbObj) {
      var coll = dbObj.collection(cn);
      try {
        coll.find({ schema_version: 1 }).toArray().then(function(docs) {
          obs.next(docs);
        })
      } catch (ex) {
        logger.error("SensorModel.get.catch: ", ex)
        obs.error(ex);
      }
    }); 
    return obs.asObservable();
  }

  getById(id: string): Observable<ISensor> {
    var cn = this._collectionName;
    var obs = new Subject<ISensor>();
    logger.info("SensorModel.getById before mongo call");

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
        logger.error("SensorModel.getById.catch: ", ex)
        obs.error(ex);
      }
    });
    return obs.asObservable();
  }

  post(data: ISensor): Observable<string> {
    var id: string = "error";
    var ms = new MongoSensorClass(data);
    var obs = new Subject<string>();
    var cn = this._collectionName;

    db.connect(function(err,dbObj){
      var coll = dbObj.collection(cn);
      coll.insert(ms, {}, function(e, results){
        if (e) obs.error(e)
        if (results) {
          obs.next(results.ops[0]._id.toString());
        }
      })
    })
    return obs.asObservable();
  }

  delete(id: string): Observable<Number> {
    var cn = this._collectionName;
    var obs = new Subject<Number>();
    logger.info("SensorModel.delete before mongo call");

    db.connect(function (err, dbObj) {
      var coll = dbObj.collection(cn);
      try {
        var oid = mongodb.ObjectID.createFromHexString(id)
        coll.deleteOne({ _id: oid }, function (e, results) {
          if (e) {
            logger.error("SensorModel.delete.delete error: ", e);
            obs.error(e);
          }
          if (results) {
            logger.error('SensorModel.delete.delete results: ', results.deletedCount)
            obs.next(results.deletedCount);
          }
        });
      } catch (ex) {
        logger.error("SensorModel.delete.catch: ", ex)
        obs.error(ex);
      }
    });
    return obs.asObservable();
  }

  deleteAll(): Observable<Number> {
    var cn = this._collectionName;
    var obs = new Subject<Number>();
    logger.info("SensorModel.deleteAll before mongo call");

    db.connect(function (err, dbObj) {
      var coll = dbObj.collection(cn);
      try {
        coll.deleteOne({}, function (e, results) {
          if (e) {
            logger.error("SensorModel.deleteAll.delete error: ", e);
            obs.error(e);
          }
          if (results) {
            logger.info('SensorModel.deleteAll.delete results: ', results.deletedCount)
            obs.next(results.deletedCount);
          }
        });
      } catch (ex) {
        logger.error("SensorModel.deleteAll.catch: ", ex)
        obs.error(ex);
      }
    });
    return obs.asObservable();
  }

  getCollectionName(): string {
    return this._collectionName;
  }

  getByHost(host: string): Observable<ISensor[]> {
    var cn = this._collectionName;
    var obs = new Subject<ISensor[]>();
    logger.error("SensorModel.getByhost.entry: %s", host);
    
    db.connect(function (err, dbObj) {
      var coll = dbObj.collection(cn);
      try {
        coll.find({ host: host }, {}, function (e, results) {
          if (e) {
            logger.error("SensorModel.getByhost.find: error %s", util.inspect(e));
            obs.error(e);
          }
          results.toArray(function(err, docs) {
            logger.error("SensorModel.getByhost.find: results %s", util.inspect(docs));
            obs.next(docs);
          })
        });
      } catch (ex) {
        logger.error("SensorModel.getByHost.catch: ", ex)
        obs.error(ex);
      }
    });
    return obs.asObservable();
  }

  find(pattern: ISensor): Observable<ISensor[]> {
    var cn = this._collectionName;
    var obs = new Subject<ISensor[]>();
    logger.error("SensorModel.find.entry: %s", util.inspect(pattern));
    var mpattern = this.mongofy(pattern);
    db.connect(function (err, dbObj) {
      var coll = dbObj.collection(cn);
      try {
        coll.find(mpattern, {}, function (e, results) {
          if (e) {
            logger.error("SensorModel.find: error %s", util.inspect(e));
            obs.error(e);
          }
          results.toArray(function(err, docs) {
            logger.error("SensorModel.find: results %s", util.inspect(docs));
            obs.next(docs);
          })
        });
      } catch (ex) {
        logger.error("SensorModel.find.catch: ", ex)
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
      lrc.type = {}
      if (s.type.name) {
        lrc.type.name = s.type.name
      }
    }
    return lrc;
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
  type: {
    name: string,
    uom?: string,
    min?: number,
    max?: number,
    tolerance?: number
  }
}

class MongoSensorClass implements MongoSensor { 
  _id = null;
  schema_version = 1;
  name = null;
  host = null;
  type = { name: null };

  constructor(is: ISensor) {
    if (is._id) {
      this._id = new mongodb.ObjectId.createFromHexString(is._id);
    }
    this.name = is.name;
    this.host = is.host;
    this.type = is.type;
  }
}

import { Observable, Subject } from 'rxjs/Rx';
import mongodb = require('mongodb');
import * as util from 'util';

var logger = require('../util/logger');
var db = require('../util/db');
import { statsdHeartbeat } from '../util/statsd';
import { SensorModel, ISensor } from './model.sensor';

export class Value {
  public type: string;
  public val: number;
}

export class HeartbeatPayload {
  public date?: Date;
  public host: string;
  public uptime?: number;
  public i2cDevices?: number;
  public values?: Value[];
}

export class MongoHeartbeat extends HeartbeatPayload {
  _id: mongodb.ObjectId;

  fromHeartBeat(hb: Heartbeat) {
    if (hb._id) {
      this._id = new mongodb.ObjectId.createFromHexString(hb._id)
    }
    this.host = hb.host || "UNKNOWN";
    if (hb.uptime) { 
      this.uptime = hb.uptime
    }
    if (hb.i2cDevices) { 
      this.i2cDevices = hb.i2cDevices
    }
    this.date = hb.date ||  new Date()
    this.values = hb.values || []
    logger.info("Mongo object: %s", util.inspect(this))
    return this;
  }
}

// class SensorClass  implements ISensor { 
//   _id: string = null;
//   name: string = null;
//   host: string = null;
//   type = { name: null };

//   constructor(host: string, type: string) {
//     this.host = host;
//     this.type.name = type;
//   }
// }

export class Heartbeat extends HeartbeatPayload {
  public _id: string;
  private static  _pubsub = new Subject<MongoHeartbeat>();
  private static sub =  Heartbeat._pubsub.subscribe(s => {
    var host = s.host;
    var sensor = new SensorModel();
    for (var value of s.values) {
      logger.error("TODO: insert or update sensor %s for host %s", value.type, host)
    }
    
  })

  private static _collectionName = db.collectionName('model.heartbeat');

  post(): Observable<string> {
    var mongoObject = new MongoHeartbeat().fromHeartBeat(this);
    var obs = new Subject<string>();

    if (this.host && this.uptime) {
      statsdHeartbeat(this.host, this.uptime);
    }

    db.connect(function(err,dbObj){
      var coll = dbObj.collection(Heartbeat._collectionName);
      coll.insert(mongoObject, {}, function(e, results){
        if (e) obs.error(e)
        if (results) {
          obs.next(results.ops[0]._id.toString());
          // now process results - fire and forget...
          Heartbeat._pubsub.next(mongoObject);
        }
      })
    })
    return obs.asObservable();
  }

  public static getByID(id: string): Observable<Heartbeat> {
    var obs = new Subject<Heartbeat>();
    db.connect(function(err,dbObj){
      var coll = dbObj.collection(Heartbeat._collectionName);
      var objId = mongodb.ObjectId.createFromHexString(id);
      coll.findOne({ _id: objId}, function(e, results){
        if (e) obs.error(e)
        if (results) {
          var hb = new Heartbeat();
          hb.populate(results);
          obs.next(hb);
        } else {
          obs.error("NOT FOUND");
        }
      });
    });
    return obs.asObservable();
  }

  deleteAll(): Observable<Number> {
    var obs = new Subject<Number>();
    
    db.connect(function (err, dbObj) {
      var coll = dbObj.collection(Heartbeat._collectionName);
      try {
        coll.deleteMany({}, function (e, results) {
          if (e) {
            logger.error("Heartbeat.deleteAll.delete error: ", e);
            obs.error(e);
          }
          if (results) {
            obs.next(results.deletedCount);
          }
        });
      } catch (ex) {
        logger.error("Heartbeat.deleteAll.catch: ", ex)
        obs.error(ex);
      }
    });
    return obs.asObservable();
  }

  // private mongofy(): MongoHeartbeat  {
  //   var rc: any = {};

  //   if (this._id) {
  //     rc._id = new mongodb.ObjectId.createFromHexString(this._id)
  //   }
  //   rc.host = this.host || "UNKNOWN";
  //   if (this.uptime) { 
  //     rc.uptime = this.uptime
  //   }
  //   if (this.i2cDevices) { 
  //     rc.i2cDevices = this.i2cDevices
  //   }
  //   rc.date = this.date ||  new Date().toISOString()
  //   logger.info("Mongo object: %s", util.inspect(rc))
  //   return rc;
  // }

  public populate(obj: any) {
    if (obj.host) { 
      this.host = obj.host;
    }
    if (obj.uptime && (typeof(obj.uptime == 'number'))) {
      this.uptime = obj.uptime;
    }
    if (obj.i2cDevices && (typeof(obj.i2cDevices == 'number'))) {
      this.i2cDevices = obj.i2cDevices
    }
    if (obj.values) {
      this.values = obj.values;
    }
    return this;
  }
}



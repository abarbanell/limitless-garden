
import { Observable, Subject } from 'rxjs/Rx';
import mongodb = require('mongodb');
import * as util from 'util';

var logger = require('../util/logger');
var db = require('../util/db');
import { statsdHeartbeat } from '../util/statsd';
import { SensorModel, ISensor, Sensor } from './model.sensor';

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

  static fromHeartbeat(hb: Heartbeat) {
    var mhb = new MongoHeartbeat();
    if (hb._id) {
      mhb._id = new mongodb.ObjectId.createFromHexString(hb._id)
    }
    mhb.host = hb.host || "UNKNOWN";
    if (hb.uptime) { 
      mhb.uptime = hb.uptime
    }
    if (hb.i2cDevices) { 
      mhb.i2cDevices = hb.i2cDevices
    }
    mhb.date = hb.date ||  new Date()
    mhb.values = hb.values || []
    logger.info("Mongo object: %s", util.inspect(mhb))
    return mhb;
  }

  static observeHeartbeat(s:MongoHeartbeat): Observable<string> {
    var obs = new Subject<string>();
    var host = s.host;
    var sensor = new SensorModel();
    for (var value of s.values) {
      var pattern: ISensor = new Sensor();
      pattern.host = host;
      pattern.type = { name: value.type };
      sensor.find(pattern).subscribe(d => {
        if (d.length ==0 ) {
          obs.next("TODO: insert or update sensor " + value.type + " for host " + host);
        } 
        if (d.length == 1) {
          obs.next("TODO: sensor exists, need to insert sensor data");
        }
        if (d.length > 1) {
          obs.next("TODO: handle duplicate sensor on same host");
        }
      })
    }
    return obs.asObservable();
  }
}

export class Heartbeat extends HeartbeatPayload {
  public _id: string;
  private static  _pubsub = new Subject<MongoHeartbeat>();
  private static sub =  Heartbeat._pubsub.subscribe(MongoHeartbeat.observeHeartbeat);



  private static _collectionName = db.collectionName('model.heartbeat');

  post(): Observable<string> {
    var mongoObject = MongoHeartbeat.fromHeartbeat(this);
    var obs = new Subject<string>();

    if (this.host && this.uptime) {
      statsdHeartbeat(this.host, this.uptime);
    }

    db.connect(function(err,dbObj){
      var coll = dbObj.collection(Heartbeat._collectionName);
      coll.insert(mongoObject, {}, function(e, results){
        if (e) obs.error(e)
        if (results) {
          // now process results - fire and forget...
          // Heartbeat._pubsub.next(mongoObject);
          // lets first keep this sync at this point
          MongoHeartbeat.observeHeartbeat(mongoObject);
          obs.next(results.ops[0]._id.toString());
 
  
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



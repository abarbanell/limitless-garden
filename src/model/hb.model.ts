
import { Observable, Subject } from 'rxjs/Rx';
import mongodb = require('mongodb');

var logger = require('../util/logger');
var db = require('../util/db');
import { statsdHeartbeat } from '../util/statsd';

export class Heartbeat {
  public _id: string;
  public date?: Date;
  public host: string;
  public uptime?: number;
  public i2cDevices?: number;

  private _collectionName = db.collectionName('model.heartbeat');

  post(): Observable<string> {
    // var id: string = "error";
    var mongoObject = this.mongofy();
    var obs = new Subject<string>();
    var cn = this._collectionName;

    if (this.host && this.uptime) {
      statsdHeartbeat(this.host, this.uptime);
    }

    db.connect(function(err,dbObj){
      var coll = dbObj.collection(cn);
      coll.insert(mongoObject, {}, function(e, results){
        if (e) obs.error(e)
        if (results) {
          obs.next(results.ops[0]._id.toString());
        }
      })
    })
    
    return obs.asObservable();
  }

  private mongofy(): any  {
    var rc: any = {};

    if (this._id) { 
      rc._id = new mongodb.ObjectId.createFromHexString(this._id)
    }
    if (this.host) { 
      rc.host = this.host
    }
    if (this.uptime) { 
      rc.host = this.uptime
    }
    if (this.i2cDevices) { 
      rc.host = this.i2cDevices
    }
    if (this.date) { 
      rc.host = this.date
    } else { 
      rc.host = new Date().toISOString()
    }
    logger.info("Mongo object: %s", rc)
    return rc;
  }

  public populate(obj: any) {
    if (obj.host) { 
      this.host = obj.host;
    }
    if (obj.uptime && (typeof(obj.uptime == 'number'))) {
      this.uptime = obj.uptime;
    }
  }
}



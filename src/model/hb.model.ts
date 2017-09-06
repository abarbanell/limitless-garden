
import { Observable, Subject } from 'rxjs/Rx';
import mongodb = require('mongodb');
import * as util from 'util';

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
    rc.host = this.host || "UNKNOWN";
    if (this.uptime) { 
      rc.uptime = this.uptime
    }
    if (this.i2cDevices) { 
      rc.i2cDevices = this.i2cDevices
    }
    rc.date = this.date ||  new Date().toISOString()
    logger.info("Mongo object: %s", util.inspect(rc))
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



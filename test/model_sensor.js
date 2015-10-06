var expect = require('expect.js');
var sensor = require('../model/sensor.js');

describe('Sensor Model ', function() {
  it('should contain get and getMulti methods ', function(){
      expect(sensor).to.be.an('object');
      expect(sensor.get).to.be.an('function');
      expect(sensor.getMulti).to.be.an('function');	
  });

});

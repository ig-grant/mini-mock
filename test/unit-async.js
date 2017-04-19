var expect = require('expect.js');
var Robot = require('./lib/robot');
var Motor = require('./lib/motor');
var MotorFactory = require('./lib/motor-factory');
var Mocker = require('../lib/mocker');

describe('unit - robot', function() {

    beforeEach('setup', function(done) {
        var mocker = new Mocker();

        this.__motor = mocker.mock(Motor.prototype)
            .withAsyncStub('start', [null, 250]) // callback args are [null, 250]
            .create();

        this.__motorFactory = mocker.mock(MotorFactory.prototype)
            .withSyncStub('getMotor', this.__motor)
            .create();

        done();
    });

    it('successfully uses async mock', function(done) {

        var self = this;

        var robot = new Robot(this.__motorFactory);
        robot.walk(function(e, result) {
            expect(self.__motorFactory.recorder['getMotor'].calls).to.equal(1);
            expect(self.__motor.recorder['start'].calls).to.equal(1);
            expect(result).to.equal(250);
            done();
        })
    })
});

/**
 * @leebow 2017/04/24.
 */

var expect = require('expect.js');
var Robot = require('./lib/robot');
var Motor = require('./lib/motor');
var MotorFactory = require('./lib/motor-factory');
var Mocker = require('../lib/mocker');

describe('unit - robot', function () {

    beforeEach('setup', function (done) {
        var mocker = new Mocker();

        this.__motor = mocker.mock(Motor.prototype)
            .withAsyncStub('start', [null, 250]) // callback args are [null, 250]
            .create();

        this.__motorFactory = mocker.mock(MotorFactory.prototype)
            .withSyncStub('getMotor', this.__motor)
            .create();

        done();
    });

    it('mock asynchronous callback returns correct result', function (done) {

        var robot = new Robot(this.__motorFactory);

        robot.walk(function (e, result) {

            if (e)
                return done(e);

            expect(result).to.equal(250);

            done();
        })
    });

    it('mock synchronous function returns correct result', function (done) {

        var result = this.__motorFactory.getMotor();
        expect(result).to.equal(this.__motor);

        done();
    });

    it('successfully increments call counter for each subsequent call to a synchronous function', function (done) {

        this.__motorFactory.getMotor();
        expect(this.__motorFactory.recorder['getMotor'].calls).to.equal(1);

        this.__motorFactory.getMotor();
        expect(this.__motorFactory.recorder['getMotor'].calls).to.equal(2);

        done();
    });

    it('successfully increments call counter for each subsequent call to an asynchronous function', function (done) {

        var self = this;

        var robot = new Robot(this.__motorFactory);

        robot.walk(function (e) {

            if (e)
                return done(e);

            expect(self.__motor.recorder['start'].calls).to.equal(1);

            robot.walk(function (e) {
                if (e)
                    return done(e);

                expect(self.__motor.recorder['start'].calls).to.equal(2);
                done();
            });
        })
    });
});
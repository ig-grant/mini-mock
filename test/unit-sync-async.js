/**
 * @leebow 2017/04/24.
 */

var expect = require('expect.js');
var Robot = require('./lib/robot');
var Motor = require('./lib/motor');
var MotorFactory = require('./lib/motor-factory');
var VoiceWidget = require('./lib/voice-widget');
var VoiceWidgetClass = require('./lib/voice-widget-class');
var WidgetFactory = require('./lib/widget-factory');

var Mocker = require('../lib/mocker');

describe('unit - robot', function () {

    beforeEach('setup', function (done) {
        var mocker = new Mocker();

        this.__motor = mocker.mock(Motor.prototype)
            .withAsyncStub('start', [null, 250]) // callback args are [null, 250]
            .create();

        this.__motorWithDelay = mocker.mock(Motor.prototype)
            .withAsyncStub('start', [null, 250], 1500) // callback args are [null, 250]
            .create();

        this.__motorFactory = mocker.mock(MotorFactory.prototype)
            .withSyncStub('getMotor', this.__motor)
            .create();

        this.__motorFactoryWithDelay = mocker.mock(MotorFactory.prototype)
            .withSyncStub('getMotor', this.__motorWithDelay)
            .create();

        this.__voiceWidget = mocker.mock(VoiceWidget.prototype)
            .withPromiseStub('speak', 'Zip zap!', null, null) // promise will resolve with 'Zip zap!'
            .create();

        this.__voiceWidgetClass = mocker.mock(VoiceWidgetClass.prototype)
            .withPromiseStub('speak', 'Wobble wobble!', null, null) // promise will resolve with 'Wobble wobble!'
            .create();

        this.__widgetFactory = mocker.mock(WidgetFactory.prototype)
            .withSyncStub('getVoiceWidget', this.__voiceWidget)
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

    it('mock promise function returns correct result', function (done) {

        var robot = new Robot(null, this.__widgetFactory);

        robot.talk(function (err, result) {
            expect(result).to.equal('Zip zap!');
            done();
        })
    });

    it('mock class promise function returns correct result', function (done) {

        this.__voiceWidgetClass.speak()
            .then((result) => {
                expect(result).to.equal('Wobble wobble!');
                done();
            })
            .catch((err)=> {
                done(err);
            });
    });

    it('mock asynchronous function with delay returns correct result', function (done) {

        var robot = new Robot(this.__motorFactoryWithDelay);

        var start = Date.now();

        robot.walk(function (e, result) {

            if (e)
                return done(e);

            var end = Date.now();
            var timeDiff = end - start;

            expect(timeDiff).to.be.greaterThan(1000);
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
})
;

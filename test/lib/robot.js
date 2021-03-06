/**
 * @leebow 2017/04/24.
 */

module.exports = Robot;

function Robot(motorFactory, widgetFactory) {
    this.__motorFactory = motorFactory;
    this.__widgetFactory = widgetFactory;
}

Robot.prototype.walk = function (cb) {

    var motor = this.__motorFactory.getMotor();

    motor.start(function (e, speed) {

        if (e)
            return cb(e);

        cb(null, speed);
    });
};

Robot.prototype.talk = function (cb) {

    var voiceWidget = this.__widgetFactory.getVoiceWidget();

    voiceWidget.speak()
        .then(function (result) {
            cb(null, result);
        })
};
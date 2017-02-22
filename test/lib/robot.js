/**
 * Created by grant on 2017/02/22.
 */

module.exports = Robot;

function Robot(motorFactory) {
    this.__motorFactory = motorFactory;
}

Robot.prototype.walk = function (cb) {

    var motor = this.__motorFactory.getMotor();

    motor.start(function (e, speed) {
        if (e)
            return cb(e);

        cb(null, speed);
    });
};
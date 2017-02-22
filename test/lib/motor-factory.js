/**
 * Created by grant on 2017/02/22.
 */

module.exports = MotorFactory;

function MotorFactory() {
}

MotorFactory.prototype.getMotor = function () {
    var Motor = require('./motor');
    return new Motor();
};
/**
 * @leebow 2017/04/24.
 */

module.exports = MotorFactory;

function MotorFactory() {
}

MotorFactory.prototype.getMotor = function () {
    var Motor = require('./motor');
    return new Motor();
};
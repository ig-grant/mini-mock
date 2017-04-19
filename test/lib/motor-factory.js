module.exports = MotorFactory;

function MotorFactory() {
}

MotorFactory.prototype.getMotor = function () {
    var Motor = require('./motor');
    return new Motor();
};
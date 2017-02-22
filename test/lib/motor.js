/**
 * Created by grant on 2017/02/22.
 */

module.exports = Motor;

function Motor() {
}

Motor.prototype.start = function (callback) {
    callback(null, 250);
};
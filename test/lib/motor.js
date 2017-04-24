/**
 * @leebow 2017/04/24.
 */

module.exports = Motor;

function Motor() {
}

Motor.prototype.start = function (callback) {
    callback(null, 250);
};
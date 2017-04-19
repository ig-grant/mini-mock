module.exports = Motor;

function Motor() {
}

Motor.prototype.start = function (callback) {
    callback(null, 250);
};
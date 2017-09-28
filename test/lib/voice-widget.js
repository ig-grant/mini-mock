/**
 * @leebow 2017/09/28.
 */

module.exports = VoiceWidget;

function VoiceWidget() {
}

VoiceWidget.prototype.speak = function () {
    return new Promise(function (resolve, reject) {
        resolve('Hello world!');
    })
};
/**
 * @leebow 2017/09/28.
 */

module.exports = WidgetFactory;

function WidgetFactory() {
}

WidgetFactory.prototype.getVoiceWidget = function () {
    var VoiceWidget = require('./voice-widget');
    return new VoiceWidget();
};
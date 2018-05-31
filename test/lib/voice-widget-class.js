
class VoiceWidgetClass{

    constructor(){}

    speak(){
        return new Promise(function (resolve, reject) {
            resolve('Hello world!');
        })
    }
}

module.exports = VoiceWidgetClass;
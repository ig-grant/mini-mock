/**
 * Created by grant on 2017/02/22.
 */

module.exports = Mocker;

function Mocker() {
    this.clear();
}

Mocker.prototype.mock = function (proto) {

    this.__currentProto = proto;
    this.__mockedSyncFuncs = [];
    this.__mockedAsyncFuncs = [];

    return this;
};

Mocker.prototype.withStubSyncFunc = function (funcName, expectedResult) {
    this.__mockedSyncFuncs.push({name: funcName, expected: expectedResult});
    return this;
};

Mocker.prototype.withStubAsyncFunc = function (funcName, expectedCallbackArgs) {
    this.__mockedAsyncFuncs.push({name: funcName, expectedCbArgs: expectedCallbackArgs});
    return this;
};

Mocker.prototype.create = function () {

    var mock = Object.assign({}, this.__currentProto);
    mock.recorder = {};

    this.__mockedAsyncFuncs.forEach((x) => {
        if (!mock[x.name]) throw new Error('Function not found!');

        mock.recorder[x.name] = {calls: 0};

        mock[x.name] = function () {
            //console.log('INVOKING', arguments[0]);
            console.log('INVOKING', x.name);

            this.recorder[x.name].calls += 1;

            // invoke callback function (last arg)
            var argCount = arguments.length > 0 ? arguments.length - 1 : 0;
            var cbFunc = arguments[argCount];
            return cbFunc.apply(undefined, x.expectedCbArgs);
        };
    });

    this.__mockedSyncFuncs.forEach((x) => {
        if (!mock[x.name]) throw new Error('Function not found!');

        mock.recorder[x.name] = {calls: 0};

        mock[x.name] = function () {
            console.log('INVOKING', x.name);

            this.recorder[x.name].calls += 1;
            return x.expected;
        };
    });

    this.clear();
    return mock;
};

Mocker.prototype.clear = function () {
    this.__currentProto = undefined;
    this.__mockedAsyncFuncs = [];
    this.__mockedSyncFuncs = [];
};
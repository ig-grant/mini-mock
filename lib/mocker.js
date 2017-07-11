/**
 * @leebow 2017/04/24.
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

Mocker.prototype.withSyncStub = function (funcName, expectedResult) {
    this.__mockedSyncFuncs.push({
        name: funcName,
        expected: expectedResult
    });
    return this;
};

Mocker.prototype.withAsyncStub = function (funcName, expectedCallbackArgs, delay) {
    this.__mockedAsyncFuncs.push({
        name: funcName,
        expectedCbArgs: expectedCallbackArgs,
        delay: delay
    });
    return this;
};

Mocker.prototype.create = function () {

    var mock = Object.assign({}, this.__currentProto);
    mock.recorder = {};

    this.__mockedAsyncFuncs.forEach((x) => {
        if (!mock[x.name]) throw new Error('Function not found!');

        mock.recorder[x.name] = {
            calls: 0
        };

        mock[x.name] = function () {
            console.log('INVOKING', x.name);

            mock.recorder[x.name].calls += 1;

            // invoke callback function (last arg)
            var argCount = arguments.length > 0 ? arguments.length - 1 : 0;
            var cbFunc = arguments[argCount];

            if (x.delay != null) {
                setTimeout(function () {
                    return cbFunc.apply(undefined, x.expectedCbArgs);
                }, x.delay)
            }else
                return cbFunc.apply(undefined, x.expectedCbArgs);
        };
    });

    this.__mockedSyncFuncs.forEach((x) => {
        if (!mock[x.name]) throw new Error('Function not found!');

        mock.recorder[x.name] = {
            calls: 0
        };

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

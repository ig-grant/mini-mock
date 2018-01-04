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
    this.__mockedPromiseFuncs = [];

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
        type: 'callback',
        expectedCbArgs: expectedCallbackArgs,
        delay: delay
    });
    return this;
};

Mocker.prototype.withPromiseStub = function (funcName, expectedResolveArg, expectedRejectArg, delay) {
    this.__mockedPromiseFuncs.push({
        name: funcName,
        type: 'promise',
        expectedResolveArg: expectedResolveArg,
        expectedRejectArg: expectedRejectArg,
        delay: delay
    });
    return this;
};

Mocker.prototype.create = function () {

    var self = this;
    var mock = {};

    if (Object.keys(this.__currentProto).length > 0)
        mock = Object.assign({}, this.__currentProto);
    else {
        console.log(this.__currentProto);
        console.log(Object.keys(this.__currentProto));

        Object.getOwnPropertyNames(this.__currentProto).forEach(function (key) {
            var descriptor = Object.getOwnPropertyDescriptor(self.__currentProto, key);
            Object.defineProperty(mock, key, {value: descriptor.value, enumerable: true});
        });
    }

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
            } else
                return cbFunc.apply(undefined, x.expectedCbArgs);
        };
    });

    this.__mockedPromiseFuncs.forEach((x) => {
        if (!mock[x.name]) throw new Error('Function not found!');

        mock.recorder[x.name] = {
            calls: 0
        };

        mock[x.name] = function () {
            console.log('INVOKING', x.name);

            mock.recorder[x.name].calls += 1;

            if (x.delay != null) {
                setTimeout(function () {
                    return new Promise(function (resolve, reject) {
                        if (x.expectedRejectArg != null)
                            return reject(x.expectedRejectArg);

                        resolve(x.expectedResolveArg);
                    });
                }, x.delay)
            } else
                return new Promise(function (resolve, reject) {
                    if (x.expectedRejectArg != null)
                        return reject(x.expectedRejectArg);

                    resolve(x.expectedResolveArg);
                });
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

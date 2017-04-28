![npm](https://badge.fury.io/js/mini-mock.svg)
[![travis](https://travis-ci.org/leebow/mini-mock.svg?branch=master)](https://travis-ci.org/leebow/mini-mock)

# mini-mock
An ultra-lightweight mocking framework for Node

## Why?
I got tired of the unnecessary complexity of existing mocking frameworks for JS. I wanted something really simple, that does
JUST what I want it to do.

## General
- For Javascript version: ECMAScript 6
- Written with the 'single object under test' approach in mind
- Object under test should ideally use constructor injection (all dependencies injected via the constructor)
- Records call count on every stubbed function
- Stubs asynchronous and synchronous functions
- After mock instances are returned via the `create()` function, Mocker resets its internal references, so it can immediately be reused

## Usage examples

Assuming the following prototype is to be mocked:

```javascript

module.exports = MyModule;

function MyModule(){}

MyModule.prototype.myAsyncFunction1 = (callback){
    var result = myService.doStuff();
    callback(null, result);
}

MyModule.prototype.myAsyncFunction2 = (callback){
    var result = myService.doOtherStuff();
    callback(null, result);
}

MyModule.prototype.mySyncFunction = (arg1){
    var result = myOtherService.doStuff(arg1);
    return {key1: result};
}

```

### Async mocks

```javascript
var mocker = new(require('mini-mock'))();

var mockResult1 = {key1: 'mocked data returned from myService'};
var mockResult2 = 'mocked data returned from myOtherService';

// create mock and expectations
var mockedObject = mocker.mock(MyModule.prototype)
    .withAsyncStub('myAsyncFunction1', [null, mockResult1])   // callback returns null error and mockResult1
    .withAsyncStub('myAsyncFunction2', [null, mockResult2])   // callback returns null error and mockResult2
    .create();

// invoke
mockedObject.myAsyncFunction1(function(err, result){

    var callCount = mockedObject.recorder['myAsyncFunction1'].calls;

    // assert
    expect(callCount).to.equal(1);
    expect(result).to.equal(mockResult1);
});

// invoke
mockedObject.myAsyncFunction2(function(err, result){

    var callCount = mockedObject.recorder['myAsyncFunction2'].calls;

    // assert
    expect(callCount).to.equal(1);
    expect(result).to.equal(mockResult2);
});
```

### Synchronous function

```javascript
/var mocker = new(require('mini-mock'))();

var mockResult = {key1: 'mocked data returned from myOtherService'};

// create mock and expectation
var mockedObject = mocker.mock(MyModule.prototype)
    .withSyncStub('mySyncFunction', mockResult)
    .create();

// invoke
var result = mockedObject.mySyncFunction('blah');

var callCount = mockedObject.recorder['mySyncFunction'].calls;

// assert
expect(callCount).to.equal(1);
expect(result).to.equal(mockResult);
```

See also the tests in `/test`


## Attribution & license

Please credit the author where appropriate. License below.

**MIT License**

Copyright (c) 2017

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

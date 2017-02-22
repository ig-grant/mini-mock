# mini-mock
An ultra-lightweight mocking framework for Node

# Why?
I got tired of the complexity of using mocking frameworks for JS. I wanted something really simple, that does
just what I want it to do.

# General
- Written for Javascript version: ECMAScript 6

# Usage

Asynchronous mocks (ie: functions using callbacks)

```javascript

/*************
 TEST FILE
**************/

// set up mock

var Mocker = require('mini-mock');
var mocker = new Mocker();

var foo = mocker.mock(Foo.prototype)
    // async function stubs
    .withStubAsyncFunc('forward', null) // 1st arg: function name; 2nd arg: callback arguments (null in this case)
    .withStubAsyncFunc('reverse', null)
    .create();

// object under test
var objTotest = new Bar(foo);
objToTest.go();

// assertions
expect(foo.recorder['forward'].calls).to.equal(1);
expect(foo.recorder['reverse'].calls).to.equal(1);

```

Synchronous mocks (ie: immediate return)

```javascript

/*************
 TEST FILE
**************/

// set up mock

var Mocker = require('mini-mock');
var mocker = new Mocker();

var bar = mocker.mock(Bar.prototype)
    // sync function stubs
    .withStubSyncFunc('go', foo) // 1st arg: function name; 2nd arg: expected result
    .create();

// object under test
var objTotest = new Robot(bar);
objToTest.walk();

// assertions
expect(bar.recorder['go'].calls).to.equal(1);

```
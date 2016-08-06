# [redux-storage][]

[![build](https://travis-ci.org/michaelcontento/redux-storage.svg?branch=master)](https://travis-ci.org/michaelcontento/redux-storage)
[![dependencies](https://david-dm.org/michaelcontento/redux-storage.svg)](https://david-dm.org/michaelcontento/redux-storage)
[![devDependencies](https://david-dm.org/michaelcontento/redux-storage/dev-status.svg)](https://david-dm.org/michaelcontento/redux-storage#info=devDependencies)

[![license](https://img.shields.io/npm/l/redux-storage.svg?style=flat-square)](https://www.npmjs.com/package/redux-storage)
[![npm version](https://img.shields.io/npm/v/redux-storage.svg?style=flat-square)](https://www.npmjs.com/package/redux-storage)
[![npm downloads](https://img.shields.io/npm/dm/redux-storage.svg?style=flat-square)](https://www.npmjs.com/package/redux-storage)
[![Code Climate](https://codeclimate.com/github/michaelcontento/redux-storage/badges/gpa.svg)](https://codeclimate.com/github/michaelcontento/redux-storage)

Save and load the [Redux][] state with ease.

## Features

* Flexible storage engines
    * [localStorage][]: based on window.localStorage
        * Or for environments without `Promise` support [localStorageFakePromise][]
    * [reactNativeAsyncStorage][]: based on `react-native/AsyncStorage`
* Flexible state merger functions
    * [simple][merger-simple]: merge plain old JS structures (default)
    * [immutablejs][merger-immutablejs]: merge plain old JS **and** [Immutable][]
        objects
* Storage engines can be async
* Load and save actions that can be observed
    * [SAVE][]: `{ type: 'REDUX_STORAGE_SAVE', payload: /* state tree */ }`
    * [LOAD][]: `{ type: 'REDUX_STORAGE_LOAD', payload: /* state tree */ }`
* Various engine decorators
    * [debounce][]: batch multiple save operations
    * [engines][]: use different storage types
    * [filter][]: only store a subset of the whole state tree
    * [immutablejs][]: load parts of the state tree as [Immutable][] objects
    * [migrate][]: versioned storage with migrations
* Black- and whitelist actions from issuing a save operation

## Installation

    npm install --save redux-storage

And you need to install at least one [redux-storage-engine][npm-engine], as
[redux-storage][] is only the *"management core"*.

## Usage

```js
import * as storage from 'redux-storage'

// Import redux and all your reducers as usual
import { createStore, applyMiddleware, combineReducers } from 'redux';
import * as reducers from './reducers';

// We need to wrap the base reducer, as this is the place where the loaded
// state will be injected.
//
// Note: The reducer does nothing special! It just listens for the LOAD
//       action and merge in the provided state :)
// Note: A custom merger function can be passed as second argument
const reducer = storage.reducer(combineReducers(reducers));

// Now it's time to decide which storage engine should be used
//
// Note: The arguments to `createEngine` are different for every engine!
import createEngine from 'redux-storage-engine-localstorage';
const engine = createEngine('my-save-key');

// And with the engine we can create our middleware function. The middleware
// is responsible for calling `engine.save` with the current state afer
// every dispatched action.
//
// Note: You can provide a list of action types as second argument, those
//       actions will be filtered and WON'T trigger calls to `engine.save`!
const middleware = storage.createMiddleware(engine);

// As everything is prepared, we can go ahead and combine all parts as usual
const createStoreWithMiddleware = applyMiddleware(middleware)(createStore);
const store = createStoreWithMiddleware(reducer);

// At this stage the whole system is in place and every action will trigger
// a save operation.
//
// BUT (!) an existing old state HAS NOT been restored yet! It's up to you to
// decide when this should happen. Most of the times you can/should do this
// right after the store object has been created.

// To load the previous state we create a loader function with our prepared
// engine. The result is a function that can be used on any store object you
// have at hand :)
const load = storage.createLoader(engine);
load(store);

// Notice that our load function will return a promise that can also be used
// to respond to the restore event.
load(store)
    .then((newState) => console.log('Loaded state:', newState))
    .catch(() => console.log('Failed to load previous state'));
```

## Details

### Engines, Decorators & Mergers

They all are published as own packages on npm. But as a convention all engines
share the keyword [redux-storage-engine][npm-engine], decorators can be found
with [redux-storage-decorator][npm-decorator] and mergers with
[redux-storage-merger][npm-merger]. So it's pretty trivial to find all
the additions to [redux-storage][] you need :smile:

### Actions

[redux-storage][] will trigger actions after every load or save operation from
the underlying engine.

You can use this, for example, to display a loading screen until the old state
has been restored like this:

```js
import { LOAD, SAVE } from 'redux-storage';

function storeageAwareReducer(state = { loaded: false }, action) {
    switch (action.type) {
        case LOAD:
            return { ...state, loaded: true };

        case SAVE:
            console.log('Something has changed and written to disk!');

        default:
            return state;
    }
}
```

### Middleware

If you pass an array of action types as second argument to `createMiddleware`,
those will be added to a internal blacklist and won't trigger calls to
`engine.save`.

```js
import { createMiddleware } from 'redux-storage'

import { APP_START } from './constants';

const middleware = createMiddleware(engine, [ APP_START ]);
```

If you want to whitelist all actions that are allowed to issue a `engine.save`,
just specify them as third argument.

```js
import { createMiddleware } from 'redux-storage'

import { SHOULD_SAVE } from './constants';

const middleware = createMiddleware(engine, [], [ SHOULD_SAVE ]);
```

## License

    The MIT License (MIT)

    Copyright (c) 2015 Michael Contento

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
    the Software, and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
    FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
    COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
    IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  [merger-simple]: https://github.com/michaelcontento/redux-storage-merger-simple
  [merger-immutablejs]: https://github.com/michaelcontento/redux-storage-merger-immutablejs
  [npm-engine]: https://www.npmjs.com/browse/keyword/redux-storage-engine
  [npm-decorator]: https://www.npmjs.com/browse/keyword/redux-storage-decorator
  [npm-merger]: https://www.npmjs.com/browse/keyword/redux-storage-merger
  [Redux]: https://github.com/gaearon/redux
  [Immutable]: https://github.com/facebook/immutable-js
  [redux-storage]: https://github.com/michaelcontento/redux-storage
  [react-native]: https://facebook.github.io/react-native/
  [localStorage]: https://github.com/michaelcontento/redux-storage-engine-localStorage
  [localStorageFakePromise]: https://github.com/michaelcontento/redux-storage-engine-localStorageFakePromise
  [reactNativeAsyncStorage]: https://github.com/michaelcontento/redux-storage-engine-reactNativeAsyncStorage
  [LOAD]: https://github.com/michaelcontento/redux-storage/blob/master/src/constants.js#L1
  [SAVE]: https://github.com/michaelcontento/redux-storage/blob/master/src/constants.js#L2
  [debounce]: https://github.com/michaelcontento/redux-storage-decorator-debounce
  [engines]: https://github.com/allegro/redux-storage-decorator-engines
  [filter]: https://github.com/michaelcontento/redux-storage-decorator-filter
  [migrate]: https://github.com/mathieudutour/redux-storage-decorator-migrate
  [immutablejs]: https://github.com/michaelcontento/redux-storage-decorator-immutablejs

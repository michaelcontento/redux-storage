redux-storage
=============

[![license](https://img.shields.io/npm/l/redux-storage.svg?style=flat-square)](https://www.npmjs.com/package/redux-storage)
[![npm version](https://img.shields.io/npm/v/redux-storage.svg?style=flat-square)](https://www.npmjs.com/package/redux-storage)
[![npm downloads](https://img.shields.io/npm/dm/redux-storage.svg?style=flat-square)](https://www.npmjs.com/package/redux-storage)
[![Code Climate](https://codeclimate.com/github/michaelcontento/redux-storage/badges/gpa.svg)](https://codeclimate.com/github/michaelcontento/redux-storage)

## Installation

    npm install --save redux-storage

## Usage

```js
import storage from 'redux-storage'
import createEngine from 'redux-storage/engines/reactNativeAsyncStorage';

// You should know how to gather your reducers, as this part is plain redux :)
import { createStore, applyMiddleware } from 'redux';
import * as reducers from './reducers';

// Inject the storage reducer as first reducer in the whole chain/stack, as this
// will be the point where the loaded state will be "injected"
const reducer = storage.reducer(combineReducers(reducers));

// Now we need a engine that does the real load/save operation
let engine = createEngine('my-save-key');

// The middleware is required to detect changes and issue the save operations
const middleware = storage.createMiddleware(engine);

// Everything is ready now! Go ahead and use the store as usual, with the
// added benefit that every action will trigger a save operation :)
const store = applyMiddleware(middleware)(createStore)(reducer);

// Just create a loader function associated with your engine and you're ready
// to load the saved state into your store instance
const load = storage.createLoader(engine);
load(store);
```

## Details

### Engines

#### `redux-storage/engines/reactNativeAsyncStorage`

This will use `AsyncStorage` out of `react-native`.

#### `redux-storage/engines/localStorage`

Stores everything inside `window.localStorage`. **Warning!** `localStorage` does
not expose a async API and every save/load operation will block the JS thread!

### Actions

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
those will be added to a internal blacklist and wont trigger calls to
`engien.save`.

```js
import storage from 'redux-storage'

import { APP_START } from './constants';

const middleware = storage.createMiddleware(engine, [ APP_START ]);
```

### Decorators

#### Filter

Use this decorator to write only part of your state tree to disk.

```js
import storage from 'redux-storage'

engine = storage.decorators.filter(engine, [
    ['some', 'key'],
    ['another', 'very', 'nested', 'key']
]);
```

#### Debounce

This decorator will delay the expensive save operation for the given ms. Every
new change to the state tree will reset the timeout!

```js
import storage from 'redux-storage'

engine = storage.decorators.debounce(engine, 1500);
```

#### Immutable

Convert parts of the state tree into [ImmutableJS](https://github.com/facebook/immutable-js)
objects on `engine.load`.

```js
import storage from 'redux-storage'

engine = storage.decorators.immutablejs(engine, [
    ['immutablejs-reducer'],
    ['plain-object-reducer', 'with-immutablejs-key']
]);
```

## Todo

- Write tests for everything!

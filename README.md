redux-storage
=============

[![npm version](https://img.shields.io/npm/v/redux-storage.svg?style=flat-square)](https://www.npmjs.com/package/redux-storage)

## Installation

    npm install --save redux-storage

## Usage

```js
import storage from 'redux-storage'
import createEngine from 'redux-storage/engines/reactNativeAsyncStorage';

const storageMiddleware = storage.middleware(createEngine('redux'));

import { createStore, applyMiddleware } from 'redux';
const store = applyMiddleware(storageMiddleware)(createStore)(reducer);
```

## Details

### Engines

#### `redux-storage/engines/reactNativeAsyncStorage`

This will use `AsyncStorage` out of `react-native`.

#### `redux-storage/engiens/localStorage`

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

### Decorators

#### Filter

Use this decorator to write only part of your state tree to disk.

```js

import storage from 'redux-storage'

storageMiddleware = storage.decorators.filter([
    ['some', 'key'],
    ['another', 'very', 'nested', 'key']
])(storageMiddleware);
```

#### Debounce

This decorator will delay the expensive save operation for the given ms. Every
new change to the state tree will reset the timeout!

```js
import storage from 'redux-storage'

storageMiddleware = storage.decorators.debounce(1500)(storageMiddleware);
```

## Todo

- Write tests for everything!

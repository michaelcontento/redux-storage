export { default as createLoader } from './createLoader';
export { default as createMiddleware } from './createMiddleware';
export { default as reducer } from './reducer';
export { LOAD, SAVE } from './constants';

// The full default export is required to be BC with redux-storage <= v1.3.2
export default {
    ...require('./constants'),
    createLoader: require('./createLoader').default,
    createMiddleware: require('./createMiddleware').default,
    reducer: require('./reducer').default
};

import * as constants from './constants';
import decorators from './decorators';
import createMiddleware from './createMiddleware';
import createLoader from './createLoader';
import reducer from './reducer';

export default { ...constants, createMiddleware, reducer, decorators, createLoader };

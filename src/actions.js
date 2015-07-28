import { createAction } from 'redux-actions';

import * as constants from './constants';

export const load = createAction(constants.LOAD);
export const save = createAction(constants.SAVE);

import { merge } from 'lodash';

import { LOAD } from './constants';

export default function(reducer) {
    return (state, action) => reducer(
        action.type === LOAD
            ? merge({}, state, action.payload)
            : state,
        action
    );
}

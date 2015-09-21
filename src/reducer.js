import { merge, isFunction } from 'lodash';
import { fromJS } from 'immutable';

import { LOAD } from './constants';

function myMerge(oldState, newState) {
    if (isFunction(oldState.mergeDeep)) {
        return oldState.mergeDeep(newState);
    }
    if (isFunction(newState.mergeDeep)) {
        return fromJS(oldState).mergeDeep(newState);
    }
    return merge({}, oldState, newState);
}

export default function(reducer) {
    return (state, action) => reducer(
        action.type === LOAD
            ? myMerge(state, action.payload)
            : state,
        action
    );
}

import isFunction from 'lodash.isfunction';
import isObject from 'lodash.isobject';
import isArray from 'lodash.isarray';
import merge from 'lodash.merge';
import pairs from 'lodash.pairs';
import { fromJS } from 'immutable';

import { LOAD } from './constants';

function myMerge(oldState, newState) {
    // Whole state is ImmutableJS? Easiest way to merge
    if (isFunction(oldState.mergeDeep)) {
        return oldState.mergeDeep(newState);
    }

    // newState is ImmutableJS? We can safely use fromJS and merge
    if (isFunction(newState.mergeDeep)) {
        return fromJS(oldState).mergeDeep(newState);
    }

    // Otherwise we need to carefully merge to avoid deprecated warnings from
    // ImmutableJS see #8. We inspect only the first object level, as this is
    // a common pattern with redux!
    const result = Object.assign({}, oldState);
    for (const [key, value] of pairs(newState)) {
        // Assign if we don't need to merge at all
        if (!result.hasOwnProperty(key)) {
            result[key] = isObject(value) && !isArray(value)
                ? merge({}, value)
                : value;
            continue;
        }

        const oldValue = result[key];
        if (isFunction(oldValue.mergeDeep)) {
            result[key] = oldValue.mergeDeep(value);
        } else if (isFunction(value.mergeDeep)) {
            result[key] = fromJS(oldValue).mergeDeep(value);
        } else if (isObject(value) && !isArray(value)) {
            result[key] = merge({}, oldValue, value);
        } else {
            result[key] = value;
        }
    }

    return result;
}

export default function(reducer) {
    return (state, action) => reducer(
        action.type === LOAD
            ? myMerge(state, action.payload)
            : state,
        action
    );
}

import _ from 'lodash';

import { LOAD } from './constants';

export default function(reducer) {
    return (state, action) => reducer(
        action.type === LOAD
            ? _.merge(state, action.payload)
            : state,
        action
    );
}

import simpleMerger from 'redux-storage-merger-simple';

import { LOAD } from './constants';

export default (reducer, merger = simpleMerger) => {
    return (state, action) => reducer(
        action.type === LOAD
            ? merger(state, action.payload)
            : state,
        action
    );
};

import isFunction from 'lodash.isfunction';
import isObject from 'lodash.isobject';

import { save as actionSave } from './actions';
import { LOAD, SAVE } from './constants';

function swallow() {
}

function warnAboutConfusingFiltering(blacklist, whitelist) {
    blacklist
        .filter((item) => whitelist.indexOf(item) !== -1)
        .forEach((item) => {
            console.warn( // eslint-disable-line no-console
                `[redux-storage] Action ${item} is on BOTH black- and whitelist.`
                + ` This is most likely a mistake!`
            );
        });
}

function isValidAction(action) {
    const isFunc = isFunction(action);
    const isObj = isObject(action);
    const hasType = isObj && action.hasOwnProperty('type');

    if (!isFunc && isObj && hasType) {
        return true;
    }

    if (process.env.NODE_ENV !== 'production') {
        if (isFunc) {
            console.warn( // eslint-disable-line no-console
                `[redux-storage] ACTION IGNORED! Actions should be objects`
                + ` with a type property but received a function! Maybe your`
                + ` function resolving middleware (e.g. redux-thunk) should be`
                + ` placed before redux-storage?`
            );
        } else if (!isObj) {
            console.warn( // eslint-disable-line no-console
                `[redux-storage] ACTION IGNORED! Actions should be objects`
                + ` with a type property but received: ${action}`
            );
        } else if (!hasType) {
            console.warn( // eslint-disable-line no-console
                `[redux-storage] ACTION IGNORED! Action objects should have`
                + ` a type property.`
            );
        }
    }

    return false;
}


export default (engine, actionBlacklist = [], actionWhitelist = []) => {
    // Also don't save if we process our own actions
    const blacklistedActions = [...actionBlacklist, LOAD, SAVE];

    if (process.env.NODE_ENV !== 'production') {
        warnAboutConfusingFiltering(actionBlacklist, actionWhitelist);
    }

    return ({ dispatch, getState }) => {
        return (next) => (action) => {
            const result = next(action);

            if (!isValidAction(action)) {
                return result;
            }

            const isOnBlacklist = blacklistedActions.indexOf(action.type) !== -1;
            const isOnWhitelist = actionWhitelist.length === 0
                ? true // Don't filter if the whitelist is empty
                : actionWhitelist.indexOf(action.type) !== -1;

            // Skip blacklisted actions
            if (!isOnBlacklist && isOnWhitelist) {
                const saveState = getState();
                const dispatchSave = () => dispatch(actionSave(saveState));
                engine.save(saveState).then(dispatchSave).catch(swallow);
            }

            return result;
        };
    };
};

import { save as actionSave } from './actions';
import { LOAD, SAVE } from './constants';

function swallow() {
}

function warnAboutConfusingFiltering(blacklist, whitelist) {
    for (const item of blacklist) {
        if (whitelist.indexOf(item) === -1) {
            continue;
        }

        console.warn( // eslint-disable-line no-console
            `[redux-storage] Action ${item} is on BOTH black- and whitelist.`
            + ` This is most likely a mistake!`
        );
    }
}

export default function(engine, actionBlacklist = [], actionWhitelist = []) {
    // Also don't save if we process our own actions
    const blacklistedActions = [...actionBlacklist, LOAD, SAVE];

    if (process.env.NODE_ENV !== 'production') {
        warnAboutConfusingFiltering(actionBlacklist, actionWhitelist);
    }

    return ({ dispatch, getState }) => {
        return (next) => (action) => {
            const result = next(action);

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
}

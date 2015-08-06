import { save as actionSave } from './actions';
import { LOAD, SAVE } from './constants';

export default function(engine, actionBlacklist = []) {
    // Also don't save if we process our own actions
    const actionsToIgnore = [...actionBlacklist, LOAD, SAVE];

    return ({ dispatch, getState }) => {
        return (next) => (action) => {
            next(action);

            // Skip blacklisted actions
            if (actionsToIgnore.indexOf(action.type) === -1) {
                const saveState = getState();
                const dispatchSave = () => dispatch(actionSave(saveState));
                engine.save(saveState).then(dispatchSave);
            }
        };
    };
}

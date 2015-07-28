import * as actions from './actions';
import * as constants from './constants';

export default function(engine) {
    let hasBeenLoaded = false;

    return ({ dispatch, getState }) => {
        // Load previous state if possible
        if (!hasBeenLoaded) {
            hasBeenLoaded = true;
            const dispatchLoad = (state) => dispatch(actions.load(state));
            engine.load().then(dispatchLoad);
        }

        return (next) => (action) => {
            next(action);

            // Don't save if we process our own actions
            if (action.type !== constants.SAVE && action.type !== constants.LOAD) {
                const saveState = getState();
                const dispatchSave = () => dispatch(actions.save(saveState));
                engine.save(saveState).then(dispatchSave);
            }
        };
    };
}

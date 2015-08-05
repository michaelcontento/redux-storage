import { save as actionSave } from './actions';
import { LOAD, SAVE } from './constants';

export default function(engine) {
    return ({ dispatch, getState }) => {
        return (next) => (action) => {
            next(action);

            // Don't save if we process our own actions
            if (action.type !== SAVE && action.type !== LOAD) {
                const saveState = getState();
                const dispatchSave = () => dispatch(actionSave(saveState));
                engine.save(saveState).then(dispatchSave);
            }
        };
    };
}

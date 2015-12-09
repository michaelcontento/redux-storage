import { load as actionLoad } from './actions';

export default (engine) => (store) => {
    const dispatchLoad = (state) => store.dispatch(actionLoad(state));
    return engine.load().then((newState) => {
        dispatchLoad(newState);
        return newState;
    });
};

import { load as actionLoad } from './actions';

export default (engine) => (store, ...engineOpts) => {
    const dispatchLoad = (state) => store.dispatch(actionLoad(state));
    return engine.load(...engineOpts).then((newState) => {
        dispatchLoad(newState);
        return newState;
    });
};

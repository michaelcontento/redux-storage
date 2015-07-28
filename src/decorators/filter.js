import _ from 'lodash';

export default function(whitelist = []) {
    function select(state) {
        let saveState = {};
        whitelist.forEach((copyPath) => {
            const value = _.property(copyPath)(state);
            if (value !== undefined) {
                _.set(saveState, copyPath, value);
            }
        });
        return saveState;
    }

    return (middleware) => ({ dispatch, getState }) => {
        const getStateSelect = () => select(getState());
        return middleware({ dispatch, getState: getStateSelect });
    };
}

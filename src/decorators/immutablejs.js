import { fromJS } from 'immutable';

export default (engine, whitelist = []) => {
    return {
        ...engine,

        load() {
            return engine.load().then((result) => {
                whitelist.forEach((key) => {
                    result[key] = fromJS(result[key]);
                });
                return result;
            });
        },
    };
};

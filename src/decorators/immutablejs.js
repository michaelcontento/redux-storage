import { fromJS } from 'immutable';

export default function(engine, whitelist = []) {
    return {
        load() {
            return engine.load().then((result) => {
                whitelist.forEach((key) => {
                    result[key] = fromJS(result[key]);
                });
                return result;
            });
        },

        save(state) {
            return engine.save(state);
        }
    };
}

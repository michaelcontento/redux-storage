import set from 'lodash.set';
import isFunction from 'lodash.isfunction';

export default function(engine, whitelist = []) {
    return {
        load() {
            return engine.load();
        },

        save(state) {
            const saveState = {};

            whitelist.forEach((key) => {
                let value = state;

                // Support strings for one-level paths
                if (typeof key === 'string') {
                    key = [key]; // eslint-disable-line no-param-reassign
                }

                key.forEach((keyPart) => {
                    // Support immutable structures
                    if (isFunction(value.has) && isFunction(value.get)) {
                        if (!value.has(keyPart)) {
                            // No value stored
                            return;
                        }

                        value = value.get(keyPart);
                    } else if (value[keyPart]) {
                        value = value[keyPart];
                    } else {
                        // No value stored
                        return;
                    }

                    set(saveState, key, value);
                });
            });

            return engine.save(saveState);
        }
    };
}

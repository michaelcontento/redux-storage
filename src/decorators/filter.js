import set from 'lodash.set';
import isFunction from 'lodash.isfunction';

export default (engine, whitelist = []) => {
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
                    // If we get to a point where there is a null or undefined
                    // value, we stop walking down the key path
                    if (value === undefined || value === null) { return; }

                    // Support immutable structures
                    if (isFunction(value.has) && isFunction(value.get)) {
                        if (!value.has(keyPart)) {
                            // No value stored
                            return;
                        }

                        value = value.get(keyPart);
                    } else {
                        // Always make sure to write out the value
                        value = value[keyPart];
                    }

                    set(saveState, key, value);
                });
            });

            return engine.save(saveState);
        }
    };
};

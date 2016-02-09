import set from 'lodash.set';
import unset from 'lodash.unset';
import isFunction from 'lodash.isfunction';

export default (engine, whitelist = [], blacklist = []) => {
    return {
        ...engine,

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
                    } else if (value.hasOwnProperty(keyPart)) {
                        value = value[keyPart];
                    } else {
                        // No value stored
                        return;
                    }

                    set(saveState, key, value);
                });
            });

            blacklist.forEach((key) => {
                // Support strings for one-level paths
                if (typeof key === 'string') {
                    key = [key]; // eslint-disable-line no-param-reassign
                }

                unset(saveState, key);
            });

            return engine.save(saveState);
        }
    };
};

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

                for (const keyPart of key) {
                    // Support immutable structures
                    if (isFunction(value.has) && isFunction(value.get)) {
                        if (!value.has(keyPart)) {
                            // No value stored - continue whiteliste.forEach!
                            return;
                        }

                        value = value.get(keyPart);
                    } else if (value[keyPart]) {
                        value = value[keyPart];
                    } else {
                        // No value stored - continue whiteliste.forEach!
                        return;
                    }
                }

                set(saveState, key, value);
            });

            return engine.save(saveState);
        }
    };
}

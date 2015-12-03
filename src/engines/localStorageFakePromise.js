const noop = () => {};

export default function(key) {
    return {
        load() {
            const jsonState = localStorage.getItem(key);
            const jsonObj = JSON.parse(jsonState) || {};
            return {
                then: (cb = noop) => cb(jsonObj),
                catch: () => {}
            };
        },

        save(state) {
            const jsonState = JSON.stringify(state);
            localStorage.setItem(key, jsonState);
            return {
                then: (cb = noop) => cb(),
                catch: () => {}
            };
        }
    };
}

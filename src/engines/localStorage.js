export default function(key) {
    return {
        load() {
            const jsonState = localStorage.getItem(key);
            return Promise.resolve(JSON.parse(jsonState) || {});
        },

        save(state) {
            const jsonState = JSON.stringify(state);
            localStorage.setItem(key, jsonState);
            return Promise.resolve();
        }
    };
}

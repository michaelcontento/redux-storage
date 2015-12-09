const noop = () => {};

function createFakePromise(thenResult) {
    return {
        then: (cb = noop) => {
            cb(thenResult);
            return createFakePromise();
        },
        catch: () => createFakePromise()
    };
}

export default (key) => ({
    load() {
        const jsonState = localStorage.getItem(key);
        const jsonObj = JSON.parse(jsonState) || {};
        return createFakePromise(jsonObj);
    },

    save(state) {
        const jsonState = JSON.stringify(state);
        localStorage.setItem(key, jsonState);
        return createFakePromise();
    }
});

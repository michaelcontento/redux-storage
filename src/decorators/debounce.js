export default function(engine, ms) {
    let lastTimeout;
    let lastReject;

    return {
        load() {
            return engine.load();
        },

        save(state) {
            clearTimeout(lastTimeout);
            if (lastReject) {
                lastReject();
                lastReject = null;
            }

            return new Promise((resolve, reject) => {
                lastReject = reject;
                lastTimeout = setTimeout(() => {
                    lastReject = null;
                    engine.save(state).then(resolve).catch(reject);
                }, ms);
            });
        }
    };
}

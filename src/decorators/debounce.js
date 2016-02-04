export default (engine, ms) => {
    let lastTimeout;
    let lastReject;

    return {
        ...engine,

        save(state) {
            clearTimeout(lastTimeout);
            if (lastReject) {
                lastReject(Error('Debounced, newer action pending'));
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
};

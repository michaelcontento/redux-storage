function noop() {}

export default function(ms) {
    let currentTimeout;

    return (middleware) => (store) => {
        const unwrapped = middleware(store)(noop);

        return (next) => (action) => {
            next(action);

            clearTimeout(currentTimeout);
            currentTimeout = setTimeout(() => unwrapped(action), ms);
        };
    };
}

import { AsyncStorage } from 'react-native';

export default (key) => ({
    load() {
        return AsyncStorage.getItem(key)
            .then((jsonState) => JSON.parse(jsonState) || {});
    },

    save(state) {
        const jsonState = JSON.stringify(state);
        return AsyncStorage.setItem(key, jsonState);
    }
});

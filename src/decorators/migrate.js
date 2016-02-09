export default (engine, currentVersion = 0, key = 'redux-storage-decorators-migrate-version') => {
    const migrations = [];
    return {
        ...engine,

        load() {
            return engine.load().then(state => {
                const fromVersion = state[key] || 0;
                let migratedState = state;

                const migrationsToApply = migrations.filter(migration => {
                    return migration.version > fromVersion && migration.version <= currentVersion;
                }).sort((m1, m2) => m2.version < m1.version).map(m => m.migration);

                migrationsToApply.forEach(migration => {
                    // Do nothing if migration returns nothing. Good for experiments.
                    // Migration isn't applied until it returns something.
                    migratedState = migration(migratedState) || migratedState;
                });

                // Version doesn't belong to app state, it's meta property.
                // Otherwise combineReducers would complain about missing reducer.
                delete migratedState[key];
                return migratedState;
            });
        },

        save(state) {
            return engine.save({
                ...state,
                [key]: currentVersion // don't mutate the state
            });
        },

        addMigration(version, migration) {
            migrations.push({ version, migration });
        }
    };
};

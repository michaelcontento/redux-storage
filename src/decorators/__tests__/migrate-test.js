import migrate from '../migrate';

function identityStub(arg) {
    return new Promise(resolve => resolve(arg));
}

describe('decorators/migrate', () => {
    it('should proxy save to engine.save', async () => {
        const save = sinon.spy();
        const engine = migrate({ save });

        await engine.save({});

        save.should.have.been.called;
    });

    it('should save the current version at the default key', async () => {
        const save = identityStub;
        const engine = migrate({ save }, 42);

        return engine.save({}).should.become({ 'redux-storage-decorators-migrate-version': 42 });
    });

    it('should save the current version at the custom key', async () => {
        const save = identityStub;
        const engine = migrate({ save }, 42, 'custom-key');

        return engine.save({}).should.become({ 'custom-key': 42 });
    });

    it('should proxy load to engine.load without migrations', async () => {
        const load = sinon.stub().resolves({});
        const engine = migrate({ load });

        return engine.load().should.become({});
    });

    it('should remove the key from the loaded state with default key', async () => {
        const load = sinon.stub().resolves({ 'redux-storage-decorators-migrate-version': 42 });
        const engine = migrate({ load });

        return engine.load().should.become({});
    });

    it('should remove the key from the loaded state with custom key', async () => {
        const load = sinon.stub().resolves({ 'custom-key': 42 });
        const engine = migrate({ load }, 0, 'custom-key');

        return engine.load().should.become({});
    });

    it('should applied migrations to the loaded state when the current version is higher', async () => {
        const load = sinon.stub().resolves({
            'redux-storage-decorators-migrate-version': 0,
            key: 1
        });
        const engine = migrate({ load }, 1);

        engine.addMigration(1, (state) => {
            return {
                ...state,
                key: 2
            };
        });

        return engine.load().should.become({ key: 2 });
    });

    it('should not applied migrations to the loaded state when the current version is the same', async () => {
        const load = sinon.stub().resolves({
            'redux-storage-decorators-migrate-version': 1,
            key: 1
        });
        const engine = migrate({ load }, 1);

        engine.addMigration(1, (state) => {
            return {
                ...state,
                key: 2
            };
        });

        return engine.load().should.become({ key: 1 });
    });

    it('should not applied all migrations to the loaded state between the current version and the loaded version', async () => {
        const load = sinon.stub().resolves({
            'redux-storage-decorators-migrate-version': 1
        });
        const engine = migrate({ load }, 3);

        engine.addMigration(1, (state) => {
            return {
                ...state,
                step1: true
            };
        });

        engine.addMigration(2, (state) => {
            return {
                ...state,
                step2: true
            };
        });
        engine.addMigration(3, (state) => {
            return {
                ...state,
                step3: true
            };
        });
        engine.addMigration(4, (state) => {
            return {
                ...state,
                step4: true
            };
        });

        return engine.load().should.become({ step2: true, step3: true });
    });
});

import localStorageFakePromise from '../localStorageFakePromise';

describe('engine/localStorageFakePromise', () => {
    describe('load', () => {
        beforeEach(() => {
            global.localStorage = {
                getItem: sinon.stub().returns(null)
            };
        });

        afterEach(() => {
            delete global.localStorage;
        });

        it('should return a promise-like object', () => {
            const engine = localStorageFakePromise('key');

            const prom = engine.load();
            prom.should.be.a.object;
            prom.should.have.a.property('then');
            prom.should.have.a.property('catch');
            prom.then.should.be.a.func;
            prom.catch.should.be.a.func;
        });

        it('should call the cb on then', () => {
            const engine = localStorageFakePromise('key');
            const spy = sinon.spy();

            engine.load().then(spy);

            spy.should.have.been.called;
        });

        it('should pass the resolved object on load', () => {
            const engine = localStorageFakePromise('key');
            const spy = sinon.spy();
            localStorage.getItem.returns('{"key":"value"}');

            engine.load().then(spy);

            spy.should.have.been.calledWith({ key: 'value' });
        });

        it('should support then without a callback', () => {
            const engine = localStorageFakePromise('foo');

            engine.load().then();
        });

        it('should be chainable like normal promises', () => {
            const engine = localStorageFakePromise('foo');

            engine.load().then().catch().then().catch();
            engine.load().then().then();
            engine.load().catch().catch();
        });

        it('should load with the right key', () => {
            const engine = localStorageFakePromise('foo');

            engine.load().then();

            localStorage.getItem.should.have.been.calledWith('foo');
        });

        it('should return a empty object if nothing stored', () => {
            const engine = localStorageFakePromise('key');
            const spy = sinon.spy();
            localStorage.getItem.returns(null);

            engine.load().then(spy);

            spy.should.have.been.calledWith({});
        });

        it('should NOT call the cb on catch', () => {
            const engine = localStorageFakePromise('key');
            const spy = sinon.spy();

            engine.load().catch(spy);

            spy.should.not.have.been.called;
        });
    });

    describe('save', () => {
        let oldLocalStorage;
        beforeEach(() => {
            oldLocalStorage = root.localStorage;
            global.localStorage = {
                setItem: sinon.spy()
            };
        });

        afterEach(() => {
            global.localStorage = oldLocalStorage;
            oldLocalStorage = null;
        });

        it('should return a promise-like object', () => {
            const engine = localStorageFakePromise('key');

            const prom = engine.save();
            prom.should.be.a.object;
            prom.should.have.a.property('then');
            prom.should.have.a.property('catch');
            prom.then.should.be.a.func;
            prom.catch.should.be.a.func;
        });

        it('should call the cb on then', () => {
            const engine = localStorageFakePromise('key');
            const spy = sinon.spy();

            engine.save().then(spy);

            spy.should.have.been.called;
        });

        it('should support then without a callback', () => {
            const engine = localStorageFakePromise('foo');

            engine.save().then();
        });

        it('should be chainable like normal promises', () => {
            const engine = localStorageFakePromise('foo');

            engine.save().then().catch().then().catch();
            engine.save().then().then();
            engine.save().catch().catch();
        });

        it('should call localStorage.setItem with the json string', () => {
            const engine = localStorageFakePromise('key');

            engine.save({ key: 'value' });

            localStorage.setItem
                .should.have.been.calledWith(sinon.match.any, '{"key":"value"}');
        });

        it('should call localStorage.setItem with the right key', () => {
            const engine = localStorageFakePromise('foo');

            engine.save({});

            localStorage.setItem
                .should.have.been.calledWith('foo');
        });

        it('should NOT call the cb on catch', () => {
            const engine = localStorageFakePromise('key');
            const spy = sinon.spy();

            engine.save().catch(spy);

            spy.should.not.have.been.called;
        });
    });
});

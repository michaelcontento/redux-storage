import createMiddleware from '../createMiddleware';
import { LOAD, SAVE } from '../constants';

describe('createMiddleware', () => {
    let oldEnv;
    beforeEach(() => {
        oldEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';
    });

    afterEach(() => {
        process.env.NODE_ENV = oldEnv;
    });

    function describeConsoleWarnInNonProduction(msg, cb, msgCheck) {
        describe(msg, () => {
            let warn;

            beforeEach(() => {
                warn = sinon.stub(console, 'warn');
            });

            afterEach(() => {
                warn.restore();
            });

            it('should warn if NODE_ENV != production', () => {
                process.env.NODE_ENV = 'develop';
                cb();
                warn.should.have.been.called;
                if (msgCheck) {
                    msgCheck(warn.firstCall.args[0]);
                }
            });

            it('should NOT warn if NODE_ENV == production', () => {
                process.env.NODE_ENV = 'production';
                cb();
                warn.should.not.have.been.called;
            });
        });
    }

    it('should call next with the given action', () => {
        const engine = { save: sinon.stub().resolves() };
        const store = { getState: sinon.spy() };
        const next = sinon.spy();
        const action = { type: 'dummy' };

        createMiddleware(engine)(store)(next)(action);

        next.should.have.been.calledWith(action);
    });

    it('should return the result of next', () => {
        const engine = { save: sinon.stub().resolves() };
        const store = { getState: sinon.spy() };
        const next = sinon.stub().returns('nextResult');
        const action = { type: 'dummy' };

        const result = createMiddleware(engine)(store)(next)(action);

        result.should.equal('nextResult');
    });

    it('should ignore blacklisted actions', () => {
        const engine = { save: sinon.spy() };
        const store = {};
        const next = sinon.spy();
        const action = { type: 'IGNORE_ME' };

        createMiddleware(engine, ['IGNORE_ME'])(store)(next)(action);

        engine.save.should.not.have.been.called;
    });

    it('should ignore non-whitelisted actions', () => {
        const engine = { save: sinon.spy() };
        const store = {};
        const next = sinon.spy();
        const action = { type: 'IGNORE_ME' };

        createMiddleware(engine, [], ['ALLOWED'])(store)(next)(action);

        engine.save.should.not.have.been.called;
    });

    it('should process whitelisted actions', () => {
        const engine = { save: sinon.stub().resolves() };
        const store = { getState: sinon.spy() };
        const next = sinon.spy();
        const action = { type: 'ALLOWED' };

        createMiddleware(engine, [], ['ALLOWED'])(store)(next)(action);

        engine.save.should.have.been.called;
    });

    it('should allow whitelist function', () => {
        const engine = { save: sinon.stub().resolves() };
        const store = { getState: sinon.spy() };
        const next = sinon.spy();
        const action = { type: 'ALLOWED' };
        const whitelistFn = () => true;

        createMiddleware(engine, [], whitelistFn)(store)(next)(action);

        engine.save.should.have.been.called;
    });

    it('should ignore actions if the whitelist function returns false', () => {
        const engine = { save: sinon.stub().resolves() };
        const store = { getState: sinon.spy() };
        const next = sinon.spy();
        const action = { type: 'ALLOWED' };
        const whitelistFn = () => false;

        createMiddleware(engine, [], whitelistFn)(store)(next)(action);

        engine.save.should.not.have.been.called;
    });

    it('should pass the whole action to the whitelist function', (done) => {
        const engine = { save: sinon.stub().resolves() };
        const store = { getState: sinon.spy() };
        const next = sinon.spy();
        const action = { type: 'ALLOWED' };
        const whitelistFn = (checkAction) => {
            checkAction.should.deep.equal(action);
            done();
        };

        createMiddleware(engine, [], whitelistFn)(store)(next)(action);
    });

    describeConsoleWarnInNonProduction(
        'should not process functions',
        () => {
            const engine = { save: sinon.stub().resolves() };
            const store = { getState: sinon.spy() };
            const next = sinon.spy();
            const action = () => {};

            createMiddleware(engine)(store)(next)(action);

            engine.save.should.not.have.been.called;
        },
        (msg) => {
            msg.should.contain('ACTION IGNORED!');
            msg.should.contain('but received a function');
        }
    );

    describeConsoleWarnInNonProduction(
        'should not process strings',
        () => {
            const engine = { save: sinon.stub().resolves() };
            const store = { getState: sinon.spy() };
            const next = sinon.spy();
            const action = 'haha';

            createMiddleware(engine)(store)(next)(action);

            engine.save.should.not.have.been.called;
        },
        (msg) => {
            msg.should.contain('ACTION IGNORED!');
            msg.should.contain('but received: haha');
        }
    );

    describeConsoleWarnInNonProduction(
        'should not process objects without a type',
        () => {
            const engine = { save: sinon.stub().resolves() };
            const store = { getState: sinon.spy() };
            const next = sinon.spy();
            const action = { noType: 'damn it' };

            createMiddleware(engine)(store)(next)(action);

            engine.save.should.not.have.been.called;
        },
        (msg) => {
            msg.should.contain('ACTION IGNORED!');
            msg.should.contain('objects should have a type property');
        }
    );

    describeConsoleWarnInNonProduction(
        'should warn about action on both black- and whitelist',
        () => {
            const engine = {};
            createMiddleware(engine, ['A'], ['A']);
        }
    );

    it('should pass the current state to engine.save', () => {
        const engine = { save: sinon.stub().resolves() };
        const state = { x: 42 };
        const store = { getState: sinon.stub().returns(state) };
        const next = sinon.spy();
        const action = { type: 'dummy' };

        createMiddleware(engine)(store)(next)(action);

        engine.save.should.have.been.calledWith(state);
    });

    it('should trigger a SAVE action after engine.save', (done) => {
        const engine = { save: sinon.stub().resolves() };
        const state = { x: 42 };
        const store = {
            getState: sinon.stub().returns(state),
            dispatch: sinon.spy()
        };
        const next = sinon.spy();
        const action = { type: 'dummy' };

        createMiddleware(engine)(store)(next)(action);

        setTimeout(() => {
            const saveAction = { payload: state, type: SAVE };
            store.dispatch.should.have.been.calledWith(saveAction);
            done();
        }, 5);
    });

    it('should add the parent action as meta.origin to the saveAction', (done) => {
        process.env.NODE_ENV = 'develop';

        const engine = { save: sinon.stub().resolves() };
        const state = { x: 42 };
        const store = {
            getState: sinon.stub().returns(state),
            dispatch: sinon.spy()
        };
        const next = sinon.spy();
        const action = { type: 'dummy' };

        createMiddleware(engine)(store)(next)(action);

        setTimeout(() => {
            const saveAction = { payload: state, type: SAVE, meta: { origin: action } };
            store.dispatch.should.have.been.calledWith(saveAction);
            done();
        }, 5);
    });

    it('should do nothing if engine.save fails', () => {
        const engine = { save: sinon.stub().rejects() };
        const store = { getState: sinon.spy() };
        const next = sinon.spy();
        const action = { type: 'dummy' };

        createMiddleware(engine)(store)(next)(action);
    });

    it('should always ignore SAVE action', () => {
        const engine = { save: sinon.spy() };
        const store = {};
        const next = sinon.spy();
        const action = { type: SAVE };

        createMiddleware(engine)(store)(next)(action);

        engine.save.should.not.have.been.called;
    });

    it('should always ignore LOAD action', () => {
        const engine = { save: sinon.spy() };
        const store = {};
        const next = sinon.spy();
        const action = { type: LOAD };

        createMiddleware(engine)(store)(next)(action);

        engine.save.should.not.have.been.called;
    });
});

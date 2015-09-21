import createMiddleware from '../createMiddleware';
import { LOAD, SAVE } from '../constants';

describe('createMiddleware', () => {
    it('should call next with the given action', () => {
        const engine = { save: sinon.stub().resolves() };
        const store = { getState: sinon.spy() };
        const next = sinon.spy();
        const action = {};

        createMiddleware(engine)(store)(next)(action);

        next.should.have.been.calledWith(action);
    });

    it('should ignore blacklisted actions', () => {
        const engine = { save: sinon.spy() };
        const store = {};
        const next = sinon.spy();
        const action = { type: 'IGNORE_ME' };

        createMiddleware(engine, ['IGNORE_ME'])(store)(next)(action);

        engine.save.should.not.have.been.called;
    });

    it('should pass the current state to engine.save', () => {
        const engine = { save: sinon.stub().resolves() };
        const state = { x: 42 };
        const store = { getState: sinon.stub().returns(state) };
        const next = sinon.spy();
        const action = {};

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
        const action = {};

        createMiddleware(engine)(store)(next)(action);

        setTimeout(() => {
            const saveAction = { payload: state, type: SAVE };
            store.dispatch.should.have.been.calledWith(saveAction);
            done();
        }, 5);
    });

    it('should do nothing if engine.save fails', () => {
        const engine = { save: sinon.stub().rejects() };
        const store = { getState: sinon.spy() };
        const next = sinon.spy();
        const action = {};

        createMiddleware(engine)(store)(next)(action);
    });

    it('should always ignore SAVE action', () => {
        const engine = { save: sinon.spy() };
        const store = {};
        const next = sinon.spy();
        const action = { type: SAVE };

        createMiddleware(engine)(store)(next)(action);

        engine.save.should.not.have.been.called;
    }
    );
    it('should always ignore LOAD action', () => {
        const engine = { save: sinon.spy() };
        const store = {};
        const next = sinon.spy();
        const action = { type: LOAD };

        createMiddleware(engine)(store)(next)(action);

        engine.save.should.not.have.been.called;
    });
});

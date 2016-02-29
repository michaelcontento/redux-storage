import reducer from '../reducer';
import { LOAD } from '../constants';

describe('reducer', () => {
    it('should do nothing for non LOAD actions', () => {
        const spy = sinon.spy();
        const oldState = {};
        const action = { type: 'SOMETHING', payload: {} };

        reducer(spy)(oldState, action);

        spy.should.have.been.calledWith(oldState, action);
    });

    it('should have a default merger in place', () => {
        const spy = sinon.spy();
        const oldState = { x: 0, y: 0 };
        const action = { type: LOAD, payload: { y: 42 } };

        reducer(spy)(oldState, action);

        spy.should.have.been.calledWith({ x: 0, y: 42 }, action);
    });

    it('should allow me to change the merger', () => {
        const spy = sinon.spy();
        const oldState = { x: 0, y: 0 };
        const action = { type: LOAD, payload: { y: 42 } };

        const merger = (a, b) => {
            a.should.equal(oldState);
            b.should.deep.equal({ y: 42 });
            return { c: 1 };
        };

        reducer(spy, merger)(oldState, action);

        spy.should.have.been.calledWith({ c: 1 }, action);
    });
});

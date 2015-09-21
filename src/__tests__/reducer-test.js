import { Map as map } from 'immutable';

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

    it('should merge newState into oldState', () => {
        const spy = sinon.spy();
        const oldState = { x: 0, y: 0};
        const action = { type: LOAD, payload: { y: 42 } };

        reducer(spy)(oldState, action);

        spy.should.have.been.calledWith({ x: 0, y: 42 }, action);
    });

    it('should use mergeDeep on immutable structs', () => {
        const spy = sinon.spy();
        const oldState = map({ x: 0, y: 0});
        const action = { type: LOAD, payload: { y: 42 } };

        reducer(spy)(oldState, action);

        spy.should.have.been.calledWith(map({ x: 0, y: 42 }), action);
    });
});

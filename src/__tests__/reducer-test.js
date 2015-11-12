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
        const oldState = { x: 0, y: 0 };
        const action = { type: LOAD, payload: { y: 42 } };

        reducer(spy)(oldState, action);

        spy.should.have.been.calledWith({ x: 0, y: 42 }, action);
    });

    it('should use mergeDeep on immutable structs', () => {
        const spy = sinon.spy();
        const oldState = map({ x: 0, y: 0 });
        const action = { type: LOAD, payload: { y: 42 } };

        reducer(spy)(oldState, action);

        spy.should.have.been.calledWith(map({ x: 0, y: 42 }), action);
    });

    describe('issue #45 - arrays are converted to objects', () => {
        it('should not convert arrays to objects', () => {
            const spy = sinon.spy();
            const oldState = {};
            const action = { type: LOAD, payload: { arr: [ 1, 2 ] } };

            reducer(spy)(oldState, action);

            spy.should.have.been.calledWith({ arr: [ 1, 2 ] }, action);
        });

        it('should overwrite changed arrays', () => {
            const spy = sinon.spy();
            const oldState = { arr: [ 1, 2 ] };
            const action = { type: LOAD, payload: { arr: [ 3, 4 ] } };

            reducer(spy)(oldState, action);

            spy.should.have.been.calledWith({ arr: [ 3, 4 ] }, action);
        });
    });

    it('should use mergeDeep even if only newState is immutable', () => {
        const spy = sinon.spy();
        const oldState = { x: 0, y: 0 };
        const action = { type: LOAD, payload: map({ y: 42 }) };

        reducer(spy)(oldState, action);

        spy.should.have.been.calledWith(map({ x: 0, y: 42 }), action);
    });

    describe('issue #8 - ImmutableJS deprecated warnings', () => {
        it('should properly merge nested immutables', () => {
            const spy = sinon.spy();
            const oldState = { nested: map({ x: 42 }) };
            const action = { type: LOAD, payload: { nested: { x: 1337 } } };

            reducer(spy)(oldState, action);

            spy.should.have.been.calledWith({ nested: map({ x: 1337 }) }, action);
        });

        it('should properly merge nested immutables - switched sides', () => {
            const spy = sinon.spy();
            const oldState = { nested: { x: 42 } };
            const action = { type: LOAD, payload: { nested: map({ x: 1337 }) } };

            reducer(spy)(oldState, action);

            spy.should.have.been.calledWith({ nested: map({ x: 1337 }) }, action);
        });

        it('should properly merge nested non-immutable objects', () => {
            const spy = sinon.spy();
            const oldState = { nested: { x: 42 } };
            const action = { type: LOAD, payload: { nested: { x: 1337 } } };

            reducer(spy)(oldState, action);

            spy.should.have.been.calledWith({ nested: { x: 1337 } }, action);
        });

        it('should properly merge nested non-objects', () => {
            const spy = sinon.spy();
            const oldState = { x: 42 };
            const action = { type: LOAD, payload: { x: 1337 } };

            reducer(spy)(oldState, action);

            spy.should.have.been.calledWith({ x: 1337 }, action);
        });
    });
});

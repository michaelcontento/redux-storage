import { Map as map } from 'immutable';

import filter from '../filter';

describe('decorators/filter', () => {
    it('should proxy load to engine.load', () => {
        const load = sinon.spy();
        const engine = filter({ load });

        engine.load();

        load.should.have.been.called;
    });

    it('should have a empty whitelist by default', () => {
        const save = sinon.spy();
        const engine = filter({ save });

        engine.save({ key: 'value' });

        save.should.have.been.calledWith({});
    });

    it('should save whitelisted keys', () => {
        const save = sinon.spy();
        const engine = filter({ save }, ['key']);

        engine.save({ key: 'value', ignored: true });

        save.should.have.been.calledWith({ key: 'value' });
    });

    it('should save whitelisted keys paths', () => {
        const save = sinon.spy();
        const engine = filter({ save }, [['some', 'key']]);

        engine.save({ some: { key: 'value' }, ignored: true });

        save.should.have.been.calledWith({ some: { key: 'value' } });
    });

    it('should ignore not existing but whitelisted keys', () => {
        const save = sinon.spy();
        const engine = filter({ save }, ['key']);

        engine.save({ ignored: true });

        save.should.have.been.calledWith({});
    });

    it('should ignore not existing but whitelisted key paths', () => {
        const save = sinon.spy();
        const engine = filter({ save }, [['some', 'key']]);

        engine.save({ ignored: true });

        save.should.have.been.calledWith({});
    });

    it('should support immutable', () => {
        const save = sinon.spy();
        const engine = filter({ save }, [['some', 'key']]);

        engine.save({ some: map({ key: 42 }) });

        save.should.have.been.calledWith({ some: { key: 42 } });
    });

    it('should handle null values (PR #64)', () => {
        const save = sinon.spy();
        const engine = filter({ save }, [['a', 'first']]);

        engine.save({ a: { first: null, second: 2 } });

        save.should.have.been.calledWith({ a: { first: null } });
    });

    it('should handle null values (PR #64) - immutable', () => {
        const save = sinon.spy();
        const engine = filter({ save }, [['a', 'first']]);

        engine.save(map({ a: { first: null, second: 2 } }));

        save.should.have.been.calledWith({ a: { first: null } });
    });

    it('should have a empty blacklist by default', () => {
        const save = sinon.spy();
        const engine = filter({ save }, ['key']);

        engine.save({ key: 'value' });

        save.should.have.been.calledWith({ key: 'value' });
    });

    it('should not save blacklisted keys', () => {
        const save = sinon.spy();
        const engine = filter({ save }, ['ignored'], ['ignored']);

        engine.save({ key: 'value', ignored: true });

        save.should.have.been.calledWith({});
    });

    it('should not save blacklisted keys paths', () => {
        const save = sinon.spy();
        const engine = filter({ save }, ['key', 'some'], [['some', 'ignored']]);

        engine.save({ key: 'value', some: { ignored: true } });

        save.should.have.been.calledWith({ key: 'value', some: {} });
    });

    it('should ignore not existing but blacklisted keys', () => {
        const save = sinon.spy();
        const engine = filter({ save }, ['key'], ['ignored']);

        engine.save({ key: 'value' });

        save.should.have.been.calledWith({ key: 'value' });
    });

    it('should ignore not existing but blacklisted key paths', () => {
        const save = sinon.spy();
        const engine = filter({ save }, ['key'], [['some', 'ignored']]);

        engine.save({ key: 'value' });

        save.should.have.been.calledWith({ key: 'value' });
    });

    it('should support immutable', () => {
        const save = sinon.spy();
        const engine = filter({ save }, [['some', 'key']], [['some', 'key']]);

        engine.save({ some: map({ key: 42 }) });

        save.should.have.been.calledWith({ some: {} });
    });

    it('should handle null values (PR #64)', () => {
        const save = sinon.spy();
        const engine = filter({ save }, [['a', 'first']], [['a', 'first']]);

        engine.save({ a: { first: null, second: 2 } });

        save.should.have.been.calledWith({ a: {} });
    });

    it('should handle null values (PR #64) - immutable', () => {
        const save = sinon.spy();
        const engine = filter({ save }, [['a', 'first']], [['a', 'first']]);

        engine.save(map({ a: { first: null, second: 2 } }));

        save.should.have.been.calledWith({ a: {} });
    });
});

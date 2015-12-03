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
});

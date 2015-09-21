import debounce from '../debounce';

describe('decorators/debounce', () => {
    it('should proxy load to engine.load', async () => {
        const load = sinon.spy();
        const engine = debounce({ load }, 0);

        await engine.load();

        load.should.have.been.called;
    });

    it('should proxy save to engine.save with the right delay', (done) => {
        const save = sinon.stub().resolves();
        const engine = debounce({ save }, 10);

        engine.save({});

        setTimeout(() => { save.should.not.have.been.called; }, 5);
        setTimeout(() => { save.should.have.been.called; done(); }, 15);
    });

    it('should reject waiting save calls if another comes in', async () => {
        const save = sinon.stub().resolves();
        const engine = debounce({ save }, 10);

        const call1 = engine.save({});
        const call2 = engine.save({});

        await call1.should.be.rejected;
        await call2.should.eventually.be.fulfilled;
    });

    it('should resolve with the response from engine.save', () => {
        const save = sinon.stub().resolves(42);
        const engine = debounce({ save }, 0);

        return engine.save({}).should.become(42);
    });

    it('should reject with the error from engine.save', () => {
        const save = sinon.stub().rejects(24);
        const engine = debounce({ save }, 0);

        return engine.save({}).should.be.rejectedWith(24);
    });
});

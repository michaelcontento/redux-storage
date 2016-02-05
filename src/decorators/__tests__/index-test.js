describe('decorators', () => {
    it('should export a object', () => {
        const decorators = require('../');
        decorators.should.be.a.object;
        decorators.should.not.be.empty;
    });

    it('should contain debounce', () => {
        const { debounce } = require('../');
        debounce.should.be.a.func;
    });

    it('should contain filter', () => {
        const { filter } = require('../');
        filter.should.be.a.func;
    });

    it('should contain immutablejs', () => {
        const { immutablejs } = require('../');
        immutablejs.should.be.a.func;
    });

    it('should contain migrate', () => {
        const { migrate } = require('../');
        migrate.should.be.a.func;
    });
});

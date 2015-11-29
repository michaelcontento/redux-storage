import defaultImport from '../';
import * as fullImport from '../';
import { LOAD, SAVE, createLoader, createMiddleware, decorators, reducer } from '../';

describe('index', () => {
    it('should export everything by default', () => {
        // NOTE: the new object is created to include the "default" key
        //       that exists in fullImport
        fullImport.should.be.deep.equal({ ...defaultImport, default: defaultImport });
    });

    it('should export LOAD', () => {
        LOAD.should.be.a.string;
    });

    it('should export SAVE', () => {
        SAVE.should.be.a.string;
    });

    it('should export createLoader', () => {
        createLoader.should.be.a.func;
    });

    it('should export createMiddleware', () => {
        createMiddleware.should.be.a.func;
    });

    it('should export decorators', () => {
        decorators.should.be.a.object;
        decorators.should.not.be.empty;
    });

    it('should export reducer', () => {
        reducer.should.be.a.func;
    });
});

require('babel-polyfill');

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiString from 'chai-string';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sinonAsPromised from 'sinon-as-promised';

chai.use(chaiAsPromised);
chai.use(chaiString);

chai.use(sinonChai);
sinonAsPromised(Promise);

global.should = chai.should();
global.sinon = sinon;

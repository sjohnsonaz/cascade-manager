import { expect } from 'chai';
import Cascade, { observable } from 'cascade';

import { Connection } from '../scripts/CascadeManager';

describe('Connection', () => {
    it('should Get from the server', () => {
        var connection = new Connection('');
        return expect(connection.call('https://jsonplaceholder.typicode.com/posts/1')).to.eventually.have.property('id');
    });
});
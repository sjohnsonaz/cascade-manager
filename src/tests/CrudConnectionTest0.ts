import { expect } from 'chai';
import Cascade, { observable } from 'cascade';

import { CrudConnection } from '../scripts/CascadeManager';

describe('CrudConnection', () => {
    it('should Get from the server', () => {
        var connection = new CrudConnection('https://jsonplaceholder.typicode.com/posts/');
        return expect(connection.get(1)).to.eventually.have.property('id');
    });
});
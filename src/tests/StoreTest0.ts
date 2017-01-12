import { expect } from 'chai';
import Cascade, { observable } from 'cascade';

import { CrudConnection, Store } from '../scripts/CascadeManager';

describe('Store', () => {
    it('should Get from the server', () => {
        var connection = new CrudConnection('https://jsonplaceholder.typicode.com/posts/');
        var store = new Store(connection);
        store.listToPage = (data) => {
            return {
                data: data,
                count: data.length
            };
        };
        return expect(store.list({ userId: 1 })).to.eventually.have.property('count');
    });
});
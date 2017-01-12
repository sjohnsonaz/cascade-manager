import { expect } from 'chai';
import Cascade, { observable } from 'cascade';

import { Manager, Store, CrudConnection } from '../scripts/CascadeManager';

describe('Manager', () => {
    it('should List from the server', (done) => {
        var connection = new CrudConnection('https://jsonplaceholder.typicode.com/posts/');
        var store = new Store(connection);
        store.listToPage = (data) => {
            return {
                data: data,
                count: data.length
            };
        };
        var manager = new Manager(store);
        manager.init().then((data) => {
            window.setTimeout(() => {
                expect(manager.dataSource.activeRows.length).to.be.greaterThan(0);
                done();
            }, 1);
        });
    });
});
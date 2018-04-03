import { expect } from 'chai';
import Cascade, { observable } from 'cascade';

import { Manager, Store, CrudConnection } from '../scripts/CascadeManager';

import { wait } from '../scripts/util/PromiseUtil';

describe('Manager', () => {
    it('should List from the server', async () => {
        var connection = new CrudConnection('https://jsonplaceholder.typicode.com/posts/');
        var store = new Store(connection);
        store.listToPage = (data) => {
            return {
                data: data,
                count: data.length
            };
        };
        var manager = new Manager(store);
        let data = await manager.init();
        await wait(1);
        expect(manager.dataSource.activeRows.length).to.be.greaterThan(0);
    });
});
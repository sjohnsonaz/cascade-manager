import { expect } from 'chai';
import Cascade, { observable } from 'cascade';

import { CrudConnection, Store, IStore, IModel, ICrudConnection } from '../scripts/CascadeManager';

describe('Store', () => {
    interface ISimpleData {
        Id: string;
        userId: number;
    }

    interface ISimpleDataConnection extends ICrudConnection<string, ISimpleData> {

    }

    interface ISimpleDataModel extends IModel<string, ISimpleData, ISimpleDataConnection> {
        Id: string;
        userId: number;
    }

    interface ISimpleDataStore extends IStore<ISimpleDataConnection, ISimpleDataModel> {

    }
    it('should Get from the server', async () => {
        var connection: ISimpleDataConnection = new CrudConnection('https://jsonplaceholder.typicode.com/posts/');
        var store: ISimpleDataStore = new Store(connection);
        store.listToPage = (data) => {
            return {
                data: data,
                count: data.length
            };
        };
        let result = await store.list({
            userId: 1
        });
        return expect(result).to.have.property('count');
    });
});
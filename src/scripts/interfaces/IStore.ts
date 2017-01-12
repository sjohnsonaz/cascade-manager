import { IPage } from 'cascade-datasource';

import { ICrudConnection } from './ICrudConnection';
import { IListQuery } from './IListQuery';
import { IModel } from './IModel';
import { IData } from './IData';

export interface IStore<T, U extends ICrudConnection<T, V, X>, V extends IData<T>, W extends IModel<T, any, U>, X extends IListQuery> {
    connection: U;
    modelConstructor: new (data?: V, connection?: U) => W;
    listLoading: boolean;
    listLoaded: boolean;
    getLoading: boolean;
    getLoaded: boolean;
    deleteLoading: boolean;
    deleteLoaded: boolean;

    list(query?: X): Promise<IPage<V>>;
    get(id: T): Promise<W>;
    create(data?: V): W
    createArray(data?: V[]): W[];
    delete(id: T): Promise<boolean>;
    listToPage(listData: any): IPage<V>;
}

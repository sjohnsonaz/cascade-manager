import { IPage } from 'cascade-datasource';

import { ICrudConnection } from './ICrudConnection';
import { IQuery } from './IListQuery';
import { IModel } from './IModel';
import { IData } from './IData';

export interface IStore<
    T extends ICrudConnection<U['$id'], W, V>,
    U extends IModel<any, W, T>,
    V extends IQuery<W> = IQuery<U['baseData']>,
    W extends IData<any> = IData<any>
    > {
    connection: T;
    modelConstructor: new (data?: W, connection?: T) => U;
    listLoading: boolean;
    listLoaded: boolean;
    getLoading: boolean;
    getLoaded: boolean;
    deleteLoading: boolean;
    deleteLoaded: boolean;

    list(query?: V): Promise<IPage<W>>;
    get(id: U['$id']): Promise<U>;
    create(data?: W): U
    createArray(data?: W[]): U[];
    delete(id: U['$id']): Promise<boolean>;
    listToPage(listData: any): IPage<W>;
}
import { IPage } from 'cascade-datasource';

import { ICrudConnection } from './ICrudConnection';
import { IQuery } from './IListQuery';
import { IModel } from './IModel';

export interface IStore<U extends ICrudConnection<W['$id'], any, X>, W extends IModel<any, any, U>, X extends IQuery<W['baseData']> = IQuery<W['baseData']>> {
    connection: U;
    modelConstructor: new (data?: W['baseData'], connection?: U) => W;
    listLoading: boolean;
    listLoaded: boolean;
    getLoading: boolean;
    getLoaded: boolean;
    deleteLoading: boolean;
    deleteLoaded: boolean;

    list(query?: X): Promise<IPage<W['baseData']>>;
    get(id: W['$id']): Promise<W>;
    create(data?: W['baseData']): W
    createArray(data?: W['baseData'][]): W[];
    delete(id: W['$id']): Promise<boolean>;
    listToPage(listData: any): IPage<W['baseData']>;
}
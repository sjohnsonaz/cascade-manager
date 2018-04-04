import { IData } from './IData';
import { IConnection } from './IConnection';
import { IQuery } from './IListQuery';
import { IListResult } from './IListResult';

export interface ICrudConnection<T, U extends IData<T>, V extends IQuery<U> = IQuery<U>> extends IConnection {
    list(query: V): Promise<IListResult<U>>;
    get(id: T): Promise<U>;
    post(data: U): Promise<T>;
    put(id: T, data: U): Promise<boolean>;
    delete(id: T): Promise<boolean>;
}

import { IData } from '../interfaces/IData';
import { IQuery } from '../interfaces/IListQuery';
import { IListResult } from '../interfaces/IListResult';
import { ICrudConnection } from '../interfaces/ICrudConnection';

import Connection from './Connection';

export default class CrudConnection<
    T,
    U extends IData<T>,
    V extends IQuery<U> = IQuery<U>
    > extends Connection implements ICrudConnection<T, U, V> {
    list(query: V): Promise<IListResult<U>> {
        return this.call<IListResult<U>>(this.base + Connection.objectToQueryString(query || {}), {});
    }

    get(id: T): Promise<U> {
        return this.call<U>(Connection.join(this.base, id), {});
    }

    post(data: U): Promise<T> {
        return this.call<T>(this.base, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    put(id: T, data: U): Promise<boolean> {
        return this.call<boolean>(Connection.join(this.base, id), {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    delete(id: T): Promise<boolean> {
        return this.call<boolean>(Connection.join(this.base, id), {
            method: 'DELETE'
        });
    }
}

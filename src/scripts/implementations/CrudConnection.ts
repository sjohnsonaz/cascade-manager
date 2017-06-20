import { IData } from '../interfaces/IData';
import { IListQuery } from '../interfaces/IListQuery';
import { IListResult } from '../interfaces/IListResult';
import { ICrudConnection } from '../interfaces/ICrudConnection';
import Connection from './Connection';

export default class CrudConnection<T, U extends IData<T>, V extends IListQuery> extends Connection implements ICrudConnection<T, U, V> {
    list(query?: V) {
        return this.call<IListResult<U>>(this.base + Connection.objectToQueryString(query || {}), {});
    }

    get(id: T) {
        return this.call<U>(Connection.join(this.base, id), {});
    }

    post(data: U) {
        return this.call<T>(this.base, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    put(data: U) {
        return this.call<boolean>(this.base, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    delete(id: T) {
        return this.call<boolean>(Connection.join(this.base, id), {
            method: 'DELETE'
        });
    }
}

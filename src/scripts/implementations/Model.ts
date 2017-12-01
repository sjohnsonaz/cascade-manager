import {observable} from 'cascade';

import {IData} from '../interfaces/IData';
import {ICrudConnection} from '../interfaces/ICrudConnection';
import {IModel, ModelNumberIndex, ModelStringIndex} from '../interfaces/IModel';
import QueryModel from './QueryModel';

export default class Model<T, U extends IData<T>, V extends ICrudConnection<T, U, any>> extends QueryModel<U> implements IModel<T, U, V> {
    primaryKey: string = 'id';
    connection: V;
    @observable saving: boolean;
    @observable deleting: boolean;
    @observable selected;
    @observable get $id(): T {
        return this[this.primaryKey];
    }
    set $id(value: T) {
        this[this.primaryKey] = value;
    }

    constructor(data?: U, connection?: V) {
        super(data);
        if (connection) {
            this.connection = connection;
        }
    }

    wrap(data: U) {
        super.wrap(data);
        Model.copyKeyValue(data, this, this.primaryKey);
    }

    unwrap(): U {
        var output = super.unwrap();
        Model.copyKeyValue(this, output, this.primaryKey);
        return output;
    }

    save(): Promise<T | boolean> {
        this.saving = true;
        if (this.$id) {
            return this.connection.put(this.unwrap()).then((data) => {
                this.saving = false;
                return Promise.resolve(data);
            }).catch((data) => {
                this.saving = false;
                return Promise.reject(data);
            });
        } else {
            return this.connection.post(this.unwrap()).then((data) => {
                this.$id = data;
                this.saving = false;
                return Promise.resolve(data);
            }).catch((data) => {
                this.saving = false;
                return Promise.reject(data);
            });
        }
    }

    delete(): Promise<boolean> {
        var id = this.$id;
        if (id) {
            this.deleting = true;
            return this.connection.delete(id).then((data) => {
                this.deleting = false;
                return Promise.resolve(data);
            }).catch((data) => {
                this.deleting = false;
                return Promise.reject(data);
            });
        } else {
            throw new Error('Model does not have an primary key.');
        }
    }

    buildChildren(...indexes: (ModelNumberIndex<any> | ModelStringIndex<any>)[]) {

    }

    static copyKeyValue(source: Object, destination: Object, key: string) {
        destination[key] = source[key];
    }

    static wrapArray<T extends number, U extends IData<T>, V extends IModel<T, U, any>>(values: U[], model: new (data: U) => V, indexObject?: ModelNumberIndex<U>): V[];
    static wrapArray<T extends string, U extends IData<T>, V extends IModel<T, U, any>>(values: U[], model: new (data: U) => V, indexObject?: ModelStringIndex<U>): V[];
    static wrapArray<T, U extends IData<T>, V extends IModel<T, U, any>>(values: U[], model: new (data: U) => V, indexObject?: Object): V[] {
        var output: V[] = [];
        if (values) {
            for (var index = 0, length = values.length; index < length; index++) {
                var wrappedValue = new model(values[index]);
                if (indexObject) {
                    indexObject[wrappedValue.$id as any] = wrappedValue;
                }
                output.push(wrappedValue);
            }
        }
        return output;
    }

    static unwrapArray<T, U extends IData<T>, V extends IModel<T, U, any>>(values: V[]) {
        return values.map((value: V, index: number, array: V[]) => {
            return value.unwrap();
        });
    }
}

export {ModelNumberIndex, ModelStringIndex}

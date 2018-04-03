import { observable } from 'cascade';
import { IPage } from 'cascade-datasource';

import { ICrudConnection } from '../interfaces/ICrudConnection';
import { IListQuery } from '../interfaces/IListQuery';
import { IModel } from '../interfaces/IModel';
import { IQueryModel } from '../interfaces/IQueryModel';
import { IData, IDataNumberDictionary, IDataStringDictionary } from '../interfaces/IData';
import { IStore } from '../interfaces/IStore';

export default class Store<T, U extends ICrudConnection<T, V, X>, V extends IData<T>, W extends IModel<T, any, U>, X extends IListQuery> implements IStore<T, U, V, W, X> {
    connection: U;
    modelConstructor: new (data?: V, connection?: U) => W;
    @observable listLoading: boolean = false;
    @observable listLoaded: boolean = false;
    @observable getLoading: boolean = false;
    @observable getLoaded: boolean = false;
    @observable deleteLoading: boolean = false;
    @observable deleteLoaded: boolean = false;

    constructor(connection: U, modelConstructor?: new (data?: V, connection?: U) => W) {
        this.connection = connection;
        this.modelConstructor = modelConstructor;
    }

    async list(query?: X) {
        this.listLoading = true;
        this.listLoaded = false;
        try {
            let data = await this.connection.list(query);
            this.listLoaded = true;
            return this.listToPage(data);
        }
        finally {
            this.listLoading = false;
        }
    }

    async get(id: T) {
        this.getLoading = true;
        this.getLoaded = false;
        try {
            let data = await this.connection.get(id);
            this.getLoaded = true;
            return Store.objectToModel(data, this.modelConstructor, this.connection);
        }
        finally {
            this.getLoading = false;
        }
    }

    create(data?: V) {
        return new this.modelConstructor(data, this.connection);
    }

    createArray(data?: V[]) {
        var output: W[] = [];
        for (var index = 0, length = data.length; index < length; index++) {
            output.push(this.create(data[index]));
        }
        return output;
    }

    // TODO: Add bulk delete
    async delete(id: T) {
        this.deleteLoading = true;
        this.deleteLoaded = false;
        try {
            let data = await this.connection.delete(id);
            this.deleteLoaded = true;
            return data;
        }
        finally {
            this.deleteLoading = false;
        }
    }

    listToPage(listData: any): IPage<V> {
        return listData;
    }

    static objectArrayToQueryModelArray<T, U extends IQueryModel<T>>(data: Array<T>, model: new (data?: T) => U): Array<U> {
        var results: Array<U> = [];
        if (data) {
            for (var index = 0, length = data.length; index < length; index++) {
                var item = data[index];
                results.push(new model(item));
            }
        }
        return results;
    }

    static objectArrayToModelArray<T extends IData<any>, U extends IModel<any, T, V>, V extends ICrudConnection<any, T, any>>(data: Array<T>, model: new (data?: T, connection?: V) => U, connection?: V): Array<U> {
        var results: Array<U> = [];
        if (data) {
            for (var index = 0, length = data.length; index < length; index++) {
                var item = data[index];
                results.push(new model(item, connection));
            }
        }
        return results;
    }

    static objectDictionaryToModelArray<T extends IData<number>, U extends IModel<number, T, V>, V extends ICrudConnection<number, T, any>>(data: IDataNumberDictionary<T>, model: new (data?: Object, connection?: U) => T, connection?: U): Array<T>;
    static objectDictionaryToModelArray<T extends IData<string>, U extends IModel<string, T, V>, V extends ICrudConnection<string, T, any>>(data: IDataStringDictionary<T>, model: new (data?: Object, connection?: U) => T, connection?: U): Array<T> {
        var results: Array<T> = [];
        if (data) {
            for (var index in data) {
                if (data.hasOwnProperty(index)) {
                    var item = data[index];
                    results.push(new model(item, connection));
                }
            }
        }
        return results;
    }

    static objectDictionaryToObjectArray<T extends IData<number>>(data: IDataNumberDictionary<T>): Array<T>;
    static objectDictionaryToObjectArray<T extends IData<string>>(data: IDataStringDictionary<T>): Array<T> {
        var results: Array<T> = [];
        if (data) {
            for (var index in data) {
                if (data.hasOwnProperty(index)) {
                    results.push(data[index]);
                }
            }
        }
        return results;
    }

    static objectToModel<T extends IData<any>, U extends IModel<any, T, V>, V extends ICrudConnection<any, T, any>>(data: T, model: new (data?: T, connection?: V) => U, connection?: V): U {
        if (data) {
            return new model(data, connection);
        } else {
            throw new Error('No data received.');
        }
    }
}

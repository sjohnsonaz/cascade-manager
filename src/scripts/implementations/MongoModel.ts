import { observable } from 'cascade';

import { ICrudConnection } from '../interfaces/ICrudConnection';
import { IMongoModel } from '../interfaces/IMongoModel';
import { IMongoData } from '../interfaces/IMongoData';

import Model from './Model';

export default class MongoModel<T extends IMongoData, U extends ICrudConnection<string, T, any>> extends Model<string, T, U> implements IMongoModel<T, U> {
    primaryKey = '_id';
    @observable _id: string;

    wrap(data: T) {
        super.wrap(data);
        this._id = data._id;
    }

    unwrap(): T {
        var output = super.unwrap();
        output._id = this._id;
        return output;
    }
}
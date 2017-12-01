import { IMongoData } from './IMongoData';
import { IModel } from './IModel';
import { ICrudConnection } from './ICrudConnection';

export interface IMongoModel<T extends IMongoData, U extends ICrudConnection<string, T, any>> extends IModel<string, T, U> {

}
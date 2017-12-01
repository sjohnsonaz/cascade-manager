import { IData } from './IData';

export interface IMongoData extends IData<string> {
    _id: string;
}
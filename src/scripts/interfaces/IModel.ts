import { IData } from './IData';
import { IQueryModel } from './IQueryModel';
import { ISelectable } from './ISelectable';
import { ICrudConnection } from './ICrudConnection';

export interface IModel<
    T,
    U extends IData<T>,
    V extends ICrudConnection<T, U, any>
    >
    extends IData<T>, IQueryModel<U>, ISelectable {
    primaryKey: string;
    $id: T;
    connection: V;
    saving: boolean;
    deleting: boolean;
    selected: boolean;

    save(): Promise<T | boolean>;
    delete(): Promise<boolean>;
}

export interface ModelNumberIndex<T extends IData<number>> {
    [index: number]: T;
}

export interface ModelStringIndex<T extends IData<string>> {
    [index: string]: T;
}

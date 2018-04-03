import { IDataSource, IPage } from 'cascade-datasource';

import { IState } from './IState';
import { IStore } from './IStore';
import { IData } from './IData';
import { IModel } from './IModel';
import { IQuery } from './IListQuery';

export enum Operation {
    Get = 0,
    Create,
    Edit,
    Delete
}

export interface IManager<T, U extends IData<T>, V extends IModel<T, U, any>, W extends IStore<T, any, U, V, X>, X extends IQuery<U> = IQuery<U>> extends IState {
    item: V;
    idToDelete: T;
    operation: Operation;
    store: W;
    dataSource: IDataSource<U>;
    defaultItem: X;
    loadCount: number;
    loadingId: T;

    // TODO: Fix this
    //selectedItems: U[];
    slideIndex: number;

    init(id?: T, query?: X, defaultItem?: X): Promise<IPage<U>>;
    refresh(): Promise<IPage<U>>;
    clear(): void;
    dispose(): void;
    // TODO: Fix this
    //clearSelection(): void;
    clearOperation(): void;
    create(data?: U): V;
    viewPreload(data?: U): V;
    view(id: T): Promise<V>;
    edit(id: T): Promise<V>;
    delete(id: T): void;
    cancel(): void;
    confirm(saveAndContinue?: boolean): Promise<T | boolean>;
}

import { IState } from './IState';
import { IStore } from './IStore';
import { IData } from './IData';
import { IModel } from './IModel';
import { IDataSource, IPage } from './IDataSource';
import { IListQuery } from './IListQuery';

export enum Operation {
    Get = 0,
    Create,
    Edit,
    Delete
}

export interface IManager<T, U extends IData<T>, V extends IModel<T, U, any>, W extends IStore<T, any, U, V, X>, X extends IListQuery> extends IState {
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
    initFromHistory(pageChange?: boolean, create?: boolean, id?: T, query?: X, defaultItem?: X): Promise<IPage<U>>;
    refresh(): Promise<IPage<U>>;
    clear(): any;
    dispose(): any;
    // TODO: Fix this
    //clearSelection(): any;
    clearOperation(): any;
    create(data?: U): V;
    viewPreload(data?: U): V;
    view(id: T): Promise<V>;
    edit(id: T): Promise<V>;
    delete(id: T): any;
    cancel(): any;
    confirm(saveAndContinue?: boolean): Promise<T | boolean>;
}

import { IDataSource, IPage } from 'cascade-datasource';

import { IState } from './IState';
import { IStore } from './IStore';
import { IQuery } from './IListQuery';

export enum Operation {
    List = 0,
    Get,
    Create,
    Edit,
    Delete
}

export type ModelFromStore<W extends IStore<any, any, any>> = InstanceType<W['modelConstructor']>;
export type IdFromStore<W extends IStore<any, any, any>> = ModelFromStore<W>['$id'];
export type BaseDataFromStore<W extends IStore<any, any, any>> = ModelFromStore<W>['baseData'];

export interface IManager<
    T extends IStore<any, any, U>,
    U extends IQuery<ModelFromStore<T>> = IQuery<ModelFromStore<T>>
    > extends IState {

    store: T;
    dataSource: IDataSource<BaseDataFromStore<T>>;

    item: ModelFromStore<T>;
    idToDelete: IdFromStore<T>;
    operation: Operation;
    defaultItem: BaseDataFromStore<T>;

    initialized: boolean;
    loadingId: IdFromStore<T>;

    // TODO: Fix this
    //selectedItems: U[];

    init(id?: IdFromStore<T> | BaseDataFromStore<T>, query?: U, defaultItem?: BaseDataFromStore<T>): Promise<IPage<BaseDataFromStore<T>>>;
    refresh(): Promise<IPage<BaseDataFromStore<T>>>;
    clear(): void;
    dispose(): void;
    // TODO: Fix this
    //clearSelection(): void;
    clearOperation(): void;
    create(data?: BaseDataFromStore<T>): ModelFromStore<T>;
    preload(data?: BaseDataFromStore<T>, operation?: Operation): ModelFromStore<T>;
    view(id: IdFromStore<T>): Promise<ModelFromStore<T>>;
    edit(id: IdFromStore<T>): Promise<ModelFromStore<T>>;
    delete(id: IdFromStore<T>): void;
    cancel(): void;
    confirm(saveAndContinue?: boolean): Promise<IdFromStore<T> | boolean>;
}

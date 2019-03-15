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
    item: ModelFromStore<T>;
    idToDelete: IdFromStore<T>;
    operation: Operation;
    store: T;
    dataSource: IDataSource<BaseDataFromStore<T>>;
    defaultItem: BaseDataFromStore<T>;
    loadCount: number;
    loadingId: IdFromStore<T>;

    // TODO: Fix this
    //selectedItems: U[];
    slideIndex: number;

    init(id?: IdFromStore<T>, query?: U, defaultItem?: BaseDataFromStore<T>): Promise<IPage<BaseDataFromStore<T>>>;
    refresh(): Promise<IPage<BaseDataFromStore<T>>>;
    clear(): void;
    dispose(): void;
    // TODO: Fix this
    //clearSelection(): void;
    clearOperation(): void;
    create(data?: BaseDataFromStore<T>): ModelFromStore<T>;
    viewPreload(data?: BaseDataFromStore<T>): ModelFromStore<T>;
    view(id: IdFromStore<T>): Promise<ModelFromStore<T>>;
    edit(id: IdFromStore<T>): Promise<ModelFromStore<T>>;
    delete(id: IdFromStore<T>): void;
    cancel(): void;
    confirm(saveAndContinue?: boolean): Promise<IdFromStore<T> | boolean>;
}

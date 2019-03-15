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
    W extends IStore<any, any, X>,
    X extends IQuery<ModelFromStore<W>> = IQuery<ModelFromStore<W>>
    > extends IState {
    item: ModelFromStore<W>;
    idToDelete: IdFromStore<W>;
    operation: Operation;
    store: W;
    dataSource: IDataSource<BaseDataFromStore<W>>;
    defaultItem: X;
    loadCount: number;
    loadingId: IdFromStore<W>;

    // TODO: Fix this
    //selectedItems: U[];
    slideIndex: number;

    init(id?: IdFromStore<W>, query?: X, defaultItem?: X): Promise<IPage<BaseDataFromStore<W>>>;
    refresh(): Promise<IPage<BaseDataFromStore<W>>>;
    clear(): void;
    dispose(): void;
    // TODO: Fix this
    //clearSelection(): void;
    clearOperation(): void;
    create(data?: BaseDataFromStore<W>): ModelFromStore<W>;
    viewPreload(data?: BaseDataFromStore<W>): ModelFromStore<W>;
    view(id: IdFromStore<W>): Promise<ModelFromStore<W>>;
    edit(id: IdFromStore<W>): Promise<ModelFromStore<W>>;
    delete(id: IdFromStore<W>): void;
    cancel(): void;
    confirm(saveAndContinue?: boolean): Promise<IdFromStore<W> | boolean>;
}

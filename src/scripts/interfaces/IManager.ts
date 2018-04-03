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

export interface IManager<W extends IStore<any, any, X>, X extends IQuery<InstanceType<W['modelConstructor']>> = IQuery<InstanceType<W['modelConstructor']>>> extends IState {
    item: InstanceType<W['modelConstructor']>;
    idToDelete: InstanceType<W['modelConstructor']>['$id'];
    operation: Operation;
    store: W;
    dataSource: IDataSource<InstanceType<W['modelConstructor']>['baseData']>;
    defaultItem: X;
    loadCount: number;
    loadingId: InstanceType<W['modelConstructor']>['$id'];

    // TODO: Fix this
    //selectedItems: U[];
    slideIndex: number;

    init(id?: InstanceType<W['modelConstructor']>['$id'], query?: X, defaultItem?: X): Promise<IPage<InstanceType<W['modelConstructor']>['baseData']>>;
    refresh(): Promise<IPage<InstanceType<W['modelConstructor']>['baseData']>>;
    clear(): void;
    dispose(): void;
    // TODO: Fix this
    //clearSelection(): void;
    clearOperation(): void;
    create(data?: InstanceType<W['modelConstructor']>['baseData']): InstanceType<W['modelConstructor']>;
    viewPreload(data?: InstanceType<W['modelConstructor']>['baseData']): InstanceType<W['modelConstructor']>;
    view(id: InstanceType<W['modelConstructor']>['$id']): Promise<InstanceType<W['modelConstructor']>>;
    edit(id: InstanceType<W['modelConstructor']>['$id']): Promise<InstanceType<W['modelConstructor']>>;
    delete(id: InstanceType<W['modelConstructor']>['$id']): void;
    cancel(): void;
    confirm(saveAndContinue?: boolean): Promise<InstanceType<W['modelConstructor']> | boolean>;
}

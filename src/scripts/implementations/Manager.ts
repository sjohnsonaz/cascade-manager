import { observable } from 'cascade';
import DataSource, { IDataSource, IPage } from 'cascade-datasource';

import { IStore } from '../interfaces/IStore';
import { IData } from '../interfaces/IData';
import { IModel } from '../interfaces/IModel';
import { IQuery } from '../interfaces/IListQuery';
import { IManager, Operation } from '../interfaces/IManager';

import { State } from './State';

export default class Manager<W extends IStore<any, any, X>, X extends IQuery<InstanceType<W['modelConstructor']>> = IQuery<InstanceType<W['modelConstructor']>>> extends State implements IManager<W, X> {
    store: W;
    @observable item: InstanceType<W['modelConstructor']>;
    @observable idToDelete: InstanceType<W['modelConstructor']>['$id'];
    @observable operation: Operation = Operation.Get;
    dataSource: IDataSource<InstanceType<W['modelConstructor']>['baseData']>;
    defaultItem: X;
    initialized: boolean = false;
    loadCount: number = 0;
    @observable loadingId: InstanceType<W['modelConstructor']>['$id'];

    // TODO: Fix this.
    /*
    @observable get selectedItems() {
        var activeRows = this.dataSource.activeRows;
        var selected: U[] = [];
        for (var index = 0, length = activeRows.length; index < length; index++) {
            var item = activeRows[index];
            if (item.selected) {
                selected.push(item);
            }
        }
        return selected;
    }
    */

    private _slideIndex: number = Operation.Get;
    @observable get slideIndex() {
        if (this.operation !== Operation.Delete) {
            this._slideIndex = this.operation;
        }
        return this._slideIndex;
    }

    constructor(store: W) {
        super();
        this.store = store;
        this.dataSource = new DataSource<InstanceType<W['modelConstructor']>['baseData']>(async (page: number, pageSize: number, sortedColumn: string, sortedDirection: boolean) => {
            let result = await this.store.list(Manager.buildQuery(page, pageSize));
            return {
                data: result.data,
                count: result.count
            };
        });
    }

    init(id?: InstanceType<W['modelConstructor']>['$id'], query?: X, defaultItem?: X): Promise<IPage<InstanceType<W['modelConstructor']>['baseData']>> {
        this.defaultItem = defaultItem;
        //this.active = false;
        var output = this.dataSource.init();
        if (id) {
            this.edit(id);
        } else {
            this.loadingId = undefined;
            this.clearOperation();
        }
        return output;
    }

    refresh(): Promise<IPage<InstanceType<W['modelConstructor']>['baseData']>> {
        return this.dataSource.run(false);
    }

    clear() {
        this.active = false;
        this.cancel();
        //this.dataSource.init(undefined, this.store, undefined);
        this.dataSource.clear();
        this.loadingId = undefined;
    }

    dispose() {
        this.loadCount++;
    }

    // TODO: Fix this
    /*
    clearSelection() {
        var selectedItems = this.selectedItems;
        for (var index = 0, length = selectedItems.length; index < length; index++) {
            var item = selectedItems[index];
            item.selected = false;
        }
    }
    */

    clearOperation() {
        if (this.operation !== Operation.Get || this.item) {
            this.cancel();
        }
    }

    create(data?: InstanceType<W['modelConstructor']>['baseData']) {
        this.clearOperation();
        this.loadCount++;
        this.loadingId = undefined;
        this.operation = Operation.Create;
        // TODO: Clean this any.
        let item = this.store.create(data || this.defaultItem as any);
        this.item = item;
        this.sendEvent('create', item);

        return this.item;
    }

    viewPreload(data?: InstanceType<W['modelConstructor']>['baseData']) {
        this.clearOperation();
        this.loadCount++;
        this.loadingId = undefined;
        // TODO: Clean this any.
        let item = this.store.create(data || this.defaultItem as any);
        this.item = item;
        this.sendEvent('viewPreload', this.item);
        return this.item;
    }

    async view(id: InstanceType<W['modelConstructor']>['$id']): Promise<InstanceType<W['modelConstructor']>> {
        this.clearOperation();
        this.loadCount++;
        var loadCount = this.loadCount;
        this.loadingId = id;
        try {
            let item = await this.store.get(id);
            if (loadCount === this.loadCount) {
                this.loadingId = undefined;
                this.item = item;
                // TODO: should this be set?
                // this.operation = Operation.Edit;
            }
            this.sendEvent('view', item);
            return item;
        } catch (error) {
            if (loadCount === this.loadCount) {
                this.loadingId = undefined;
            }
            throw error;
        }
    }

    async edit(id: InstanceType<W['modelConstructor']>['$id']): Promise<InstanceType<W['modelConstructor']>> {
        this.clearOperation();
        this.loadCount++;
        var loadCount = this.loadCount;
        this.loadingId = id;
        try {
            let item = await this.store.get(id);
            if (loadCount === this.loadCount) {
                this.loadingId = undefined;
                this.item = item;
                this.operation = Operation.Edit;
                this.sendEvent('edit', item);
            }
            return item;
        } catch (error) {
            if (loadCount === this.loadCount) {
                this.loadingId = undefined;
            }
            throw error;
        }
    }

    delete(id: InstanceType<W['modelConstructor']>['$id']) {
        // We can delete from Get or Edit, so we do not clear operation here.
        this.operation = Operation.Delete;
        this.idToDelete = id;
    }

    cancel() {
        this.loadCount++;
        switch (this.operation) {
            case Operation.Create:
                // TODO: Remove revert?
                //this.item.revert();
                this.operation = Operation.Get;
                this.item = undefined;
                break;
            case Operation.Edit:
                // TODO: Remove revert?
                //this.item.revert();
                this.operation = Operation.Get;
                this.item = undefined;
                break;
            case Operation.Delete:
                if (this.slideIndex === 0) {
                    this.idToDelete = undefined;
                }
                this.operation = this.slideIndex;
                break;
            default:
                break;
        }
        this.sendEvent('cancel');
    }

    async confirm(saveAndContinue: boolean = false): Promise<InstanceType<W['modelConstructor']>['$id'] | boolean> {
        switch (this.operation) {
            case Operation.Create:
                let createData = await this.item.save();
                this.sendEvent('created', this.item);
                if (!saveAndContinue) {
                    this.operation = Operation.Get;
                    this.item = undefined;
                }
                this.dataSource.run();
                return createData;
            case Operation.Edit:
                let editData = await this.item.save();
                this.sendEvent(typeof editData === 'boolean' ? 'updated' : 'created', this.item);
                if (!saveAndContinue) {
                    this.operation = Operation.Get;
                    this.item = undefined;
                }
                this.dataSource.run();
                return editData;
            case Operation.Delete:
                let deleteData = await this.store.delete(this.idToDelete);
                this.sendEvent('deleted', this.idToDelete);
                this.operation = Operation.Get;
                this.item = undefined;
                this.idToDelete = undefined;
                this.dataSource.run();
                return deleteData;
            default:
                return undefined;
        }
    }

    static buildQuery<T>(page: number, pageSize: number) {
        return Object.assign({
            offset: Math.abs(page * pageSize),
            limit: pageSize >= 1 ? pageSize : undefined
        });
    }
}

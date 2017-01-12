import { observable } from 'cascade';
import DataSource, { IDataSource, IPage } from 'cascade-datasource';

import { IStore } from '../interfaces/IStore';
import { IData } from '../interfaces/IData';
import { IModel } from '../interfaces/IModel';
import { IListQuery } from '../interfaces/IListQuery';
import { IManager, Operation } from '../interfaces/IManager';

import { State } from './State';

export default class Manager<T, U extends IData<T>, V extends IModel<T, U, any>, W extends IStore<T, any, U, V, X>, X extends IListQuery> extends State implements IManager<T, U, V, W, X> {
    //U extends IStore<any, any, any, V, W>, V extends IModel<any, any, any>, W extends IListQuery> extends State implements IManager<U, V, W> {
    store: W;
    @observable item: V;
    @observable idToDelete: T;
    @observable operation: Operation = Operation.Get;
    dataSource: IDataSource<U>;
    defaultItem: X;
    initialized: boolean = false;
    loadCount: number = 0;
    @observable loadingId: T;

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
        this.dataSource = new DataSource<U>((page: number, pageSize: number, sortedColumn: string, sortedDirection: boolean) => {
            return this.store.list(Manager.buildQuery(page, pageSize)).then((result) => {
                return Promise.resolve({
                    data: result.data,
                    count: result.count
                });
            });
        });
    }

    init(id?: T, query?: X, defaultItem?: X) {
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

    initFromHistory(pageChange?: boolean, create: boolean = false, id?: T, query?: X, defaultItem?: X): Promise<IPage<U>> {
        if (pageChange) {
            var output = this.init(id, query, defaultItem);
            if (!id && create) {
                this.create();
            }
        } else {
            if (id) {
                this.edit(id);
            } else if (create) {
                this.create();
            } else {
                this.cancel();
            }
        }
        return output;
    }

    refresh() {
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

    create(data?: U) {
        this.clearOperation();
        this.loadCount++;
        this.loadingId = undefined;
        this.operation = Operation.Create;
        // TODO: Clean this any.
        this.item = this.store.create(data || this.defaultItem as any);
        return this.item;
    }

    viewPreload(data?: U) {
        this.clearOperation();
        this.loadCount++;
        this.loadingId = undefined;
        // TODO: Clean this any.
        this.item = this.store.create(data || this.defaultItem as any);
        return this.item;
    }

    view(id: T) {
        this.clearOperation();
        this.loadCount++;
        var loadCount = this.loadCount;
        this.loadingId = id;
        return this.store.get(id).then((item) => {
            if (loadCount === this.loadCount) {
                this.loadingId = undefined;
                this.item = item;
                // TODO: should this be set?
                // this.operation = Operation.Edit;
            }
            return Promise.resolve(item);
        }).catch((data) => {
            if (loadCount === this.loadCount) {
                this.loadingId = undefined;
            }
            return Promise.reject(data);
        });
    }

    edit(id: T) {
        this.clearOperation();
        this.loadCount++;
        var loadCount = this.loadCount;
        this.loadingId = id;
        return this.store.get(id).then((item) => {
            if (loadCount === this.loadCount) {
                this.loadingId = undefined;
                this.item = item;
                this.operation = Operation.Edit;
            }
            return Promise.resolve(item);
        }).catch((data) => {
            if (loadCount === this.loadCount) {
                this.loadingId = undefined;
            }
            return Promise.reject(data);
        });
    }

    delete(id: T) {
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
    }

    confirm(saveAndContinue: boolean = false) {
        return (() => {
            switch (this.operation) {
                case Operation.Create:
                    return this.item.save().then((data) => {
                        if (!saveAndContinue) {
                            this.operation = Operation.Get;
                            this.item = undefined;
                        }
                        this.dataSource.run();
                        return Promise.resolve(data);
                    });
                case Operation.Edit:
                    return this.item.save().then((data) => {
                        if (!saveAndContinue) {
                            this.operation = Operation.Get;
                            this.item = undefined;
                        }
                        this.dataSource.run();
                        return Promise.resolve(data);
                    });
                case Operation.Delete:
                    return this.store.delete(this.idToDelete).then((data) => {
                        this.operation = Operation.Get;
                        this.item = undefined;
                        this.idToDelete = undefined;
                        this.dataSource.run();
                        return Promise.resolve(data);
                    });
            }
        })();
    }

    static buildQuery<T>(page: number, pageSize: number) {
        return Object.assign({
            offset: Math.abs(page * pageSize),
            limit: pageSize >= 1 ? pageSize : undefined
        });
    }
}

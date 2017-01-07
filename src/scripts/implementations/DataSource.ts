import { observable } from 'cascade';

import { IDataSource, IDataSourceParams, IPage, RefreshCallback } from '../interfaces/IDataSource';

export default class DataSource<T> implements IDataSource<T> {
    @observable pageSize: number;
    @observable page: number;
    @observable pagerSize: number;
    @observable sortedColumn: string;
    @observable sortedDirection: boolean;
    @observable activeRows: T[]
    @observable rowCount: number;
    @observable error: boolean;

    source: RefreshCallback<T>;
    lockRefresh: any
    private runCount: number;

    @observable get dataComputed(): Promise<IPage<T>> {
        var pageSize = this.pageSize;
        var page = this.page;
        var sortedColumn = this.sortedColumn;
        var sortedDirection = this.sortedDirection;
        if (!this.lockRefresh) {
            return this.run(true);
        } else {
            return (Promise.reject('DataSource is locked') as any);
        }
    }

    constructor(source?: RefreshCallback<T>, params?: IDataSourceParams<T>) {
        params = params || {};
        var self = this;
        this.pageSize = params.pageSize || 20;
        this.page = params.page || 0;
        this.pagerSize = params.pagerSize || 10;
        this.sortedColumn = params.sortedColumn;
        this.sortedDirection = params.sortedDirection;
        this.activeRows = params.activeRows;
        this.rowCount = params.rowCount || 0;
        this.error = params.error || false;

        this.source = source;
        this.lockRefresh = true;
        this.runCount = 0;
    }

    init(): Promise<IPage<T>> {
        this.lockRefresh = false;
        return this.dataComputed;
    }

    run(preservePage?: boolean): Promise<IPage<T>> {
        this.runCount++;
        var runID = this.runCount;
        this.lockRefresh = false;
        var pageSize = this.pageSize;
        var page = this.page;
        var sortedColumn = this.sortedColumn;
        var sortedDirection = this.sortedDirection;
        var promise = this.source(page, pageSize, sortedColumn, sortedDirection);
        return promise.then((results) => {
            if (runID == this.runCount) {
                this.activeRows = results.data;
                this.rowCount = results.count;
                if (!preservePage) {
                    this.page = 0;
                }
                this.error = false;
            }
            return results;
        }).catch(() => {
            if (runID == this.runCount) {
                this.error = true;
            }
        });
    }

    clear() {
        var lockRefresh = this.lockRefresh;
        this.page = 0;
        this.rowCount = 0;
        this.activeRows = [];
        this.lockRefresh = lockRefresh;
    }

    static createPage<T>(data: T[], count: number): IPage<T> {
        return ({
            data: data,
            count: count
        });
    }

    static pageArray<T>(results: T[], page: number, pageSize: number, sortedColumn: string, sortedDirection: boolean): Promise<IPage<T>> {
        if (results && sortedColumn) {
            results.sort(function (a: T, b: T) {
                var aValue: string = (a[sortedColumn] || '').toString();
                var bValue: string = (b[sortedColumn] || '').toString();

                var ax = [], bx = [];

                aValue.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
                    ax.push([$1 || Infinity, $2 || ""]);
                    return '';
                });
                bValue.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
                    bx.push([$1 || Infinity, $2 || ""]);
                    return '';
                });

                while (ax.length && bx.length) {
                    var an = ax.shift();
                    var bn = bx.shift();
                    var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                    if (nn) return nn;
                }

                return ax.length - bx.length;
            });

            if (sortedDirection === undefined) {
                sortedDirection = true;
            } else {
                sortedDirection = !!sortedDirection;
            }

            if (!sortedDirection) {
                results.reverse();
            }
        }

        return Promise.resolve(
            results ?
                DataSource.createPage(results.slice(page * pageSize, (page + 1) * pageSize), results.length) :
                DataSource.createPage([] as T[], 0)
        );
    }
}

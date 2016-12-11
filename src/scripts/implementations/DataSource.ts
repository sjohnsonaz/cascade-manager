import Cascade, {observable, Observable, Computed, ObservableArray} from 'cascade';

export interface RefreshCallback {
    (page: number, pageSize: number, sortedColumn: string, sortedDirection: boolean, success: (data) => any, error: () => any): any;
}

export default class DataSource<T> {
    @observable pageSize: number;
    @observable page: number;
    @observable pagerSize: number;
    @observable sortedColumn: string;
    @observable sortedDirection: boolean;
    @observable activeRows: T[]
    @observable rowCount: number;
    @observable error: boolean;

    refreshData: RefreshCallback;
    lockRefresh: any
    private runCount: number;

    @observable get dataComputed(): boolean {
        var pageSize = this.pageSize;
        var page = this.page;
        var sortedColumn = this.sortedColumn;
        var sortedDirection = this.sortedDirection;
        if (!this.lockRefresh) {
            this.run(true);
        }
        return true;
    }

    constructor(service: RefreshCallback, params) {
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

        this.refreshData = service;
        this.lockRefresh = true;
        this.runCount = 0;
    }

    run(preservePage) {
        this.runCount++;
        var runID = this.runCount;
        this.lockRefresh = false;
        var pageSize = this.pageSize;
        var page = this.page;
        var sortedColumn = this.sortedColumn;
        var sortedDirection = this.sortedDirection;
        (() => {
            this.refreshData(page, pageSize, sortedColumn, sortedDirection, (data) => {
                if (runID == this.runCount) {
                    this.activeRows = data.Results;
                    this.rowCount = data.ResultCount;
                    if (!preservePage) {
                        this.page = 0;
                    }
                    this.error = false;
                }
            }, () => {
                if (runID == this.runCount) {
                    this.error = true;
                }
            });
        })();
    }

    clear() {
        var lockRefresh = this.lockRefresh;
        this.page = 0;
        this.rowCount = 0;
        this.activeRows = [];
        this.lockRefresh = lockRefresh;
    }

    static pageArray<T>(results: T[], page: number, pageSize: number, sortedColumn: string, sortedDirection: boolean) {
        if (results && sortedColumn) {
            results.sort(function(a: T, b: T) {
                var aValue: string = (a[sortedColumn] || '').toString();
                var bValue: string = (b[sortedColumn] || '').toString();

                var ax = [], bx = [];

                aValue.replace(/(\d+)|(\D+)/g, function(_, $1, $2) {
                    ax.push([$1 || Infinity, $2 || ""]);
                    return '';
                });
                bValue.replace(/(\d+)|(\D+)/g, function(_, $1, $2) {
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

        return results ?
            {
                Results: results.slice(page * pageSize, (page + 1) * pageSize),
                ResultCount: results.length
            } : {
                Results: [],
                ResultCount: 0
            };
    }

    static enableSelectAll(dataSource: DataSource<any>, selectionProperty: string, selectAllProperty: string, arrayProperty: string) {
        selectionProperty = selectionProperty || 'selected';
        selectAllProperty = selectAllProperty || 'selectAll';
        arrayProperty = arrayProperty || 'activeRows';
        Cascade.createComputed(dataSource, selectAllProperty, function() {
            if (dataSource[arrayProperty]().length) {
                var item = ko.utils.arrayFirst(dataSource[arrayProperty](), function(item) {
                    return !item[selectionProperty]();
                });
                return item == null;
            } else {
                return false;
            }
        }, false, function(value: boolean) {
            ko.utils.arrayForEach(dataSource[arrayProperty](), function(item) {
                item[selectionProperty](value);
            });
        });
    }
    static enableArraySelection(dataSource, selectionProperty, dataArray, selectionStorageProperty) {
        selectionStorageProperty = selectionStorageProperty || 'selected'
        dataSource[selectionStorageProperty] = new Computed(function() {
            var data = ko.unwrap(dataArray);
            var selected = [];
            if (data) {
                for (var index = 0, length = data.length; index < length; index++) {
                    var item = data[index];
                    if (item[selectionProperty]()) {
                        selected.push(item);
                    }
                }
            }
            return selected;
        });

        function clearSelection() {
            var selected = dataSource[selectionStorageProperty]();
            for (var index = 0, length = selected.length; index < length; index++) {
                selected[index][selectionProperty](false);
            }
        };
        if (dataSource.clearSelection) {
            var oldFunction = dataSource.clearSelection;
            dataSource.clearSelection = function() {
                oldFunction();
                clearSelection();
            }
        } else {
            dataSource.clearSelection = clearSelection;
        }
    }
    static enablePagedSelection(dataSource, selectionProperty, uniqueProperty, selectionStorageProperty) {
        selectionStorageProperty = selectionStorageProperty || 'selected'
        var allselected = {};
        var lockSelection = false;
        dataSource.activeRows.subscribe(function(value) {
            lockSelection = true;
            var base = uniqueProperty ? 0 : (dataSource.page.peek() * dataSource.pageSize.peek());
            ko.utils.arrayForEach(value, function(item, index) {
                var id = uniqueProperty ? ko.unwrap(item[uniqueProperty]) : base + index;
                if (allselected[id]) {
                    // Store new item
                    allselected[id] = item;
                    item[selectionProperty](true);
                }
            });
            lockSelection = false;
        });
        var forceSelectionChange = new Observable<boolean>(false);
        dataSource[selectionStorageProperty] = new Computed(function(value) {
            lockSelection = true;
            allselected = {};
            ko.utils.arrayForEach(value, function(item, index) {
                var id = ko.unwrap(item[uniqueProperty]);
                // Ensure the item is selected
                item[selectionProperty](true);
                allselected[id] = item;
            });
            lockSelection = false;
            forceSelectionChange.setValue(true);
        }, false, undefined, function() {
            var ignorePage = forceSelectionChange.getValue();
            forceSelectionChange.setValue(false);
            // Loop through current page
            var activeRows = dataSource.activeRows();
            if (activeRows.length) {
                if (!lockSelection) {
                    var base = uniqueProperty ? 0 : (dataSource.page.peek() * dataSource.pageSize.peek());
                    ko.utils.arrayForEach(activeRows, function(item, index) {
                        var id = uniqueProperty ? ko.unwrap(item[uniqueProperty]) : base + index;
                        if (!ignorePage) {
                            if (item[selectionProperty]()) {
                                allselected[id] = item;
                            } else {
                                delete allselected[id];
                            }
                        } else {
                            if (allselected[id]) {
                                item[selectionProperty](true);
                            } else {
                                item[selectionProperty](false);
                            }
                            // subscribe
                            item[selectionProperty]();
                        }
                    });
                }
            }

            // Build selected array, remove any deselected.
            var selected = [];
            for (var x in allselected) {
                if (allselected.hasOwnProperty(x)) {
                    var item = allselected[x];
                    if (item[selectionProperty]()) {
                        selected.push(item);
                    } else {
                        delete allselected[x];
                    }
                }
            }
            return selected;
        });
        function clearSelection() {
            var selected = dataSource.selected();
            for (var index = 0, length = selected.length; index < length; index++) {
                selected[index][selectionProperty](false);
            }
            allselected = {};
            dataSource.activeRows.valueHasMutated();
        };
        if (dataSource.clearSelection) {
            var oldFunction = dataSource.clearSelection;
            dataSource.clearSelection = function() {
                oldFunction();
                clearSelection();
            }
        } else {
            dataSource.clearSelection = clearSelection;
        }
    };

    static createColumnCss(dataSource, newProperty, columnProperty, cssClass) {
        dataSource[newProperty] = new Computed(function() {
            var output = '';
            var values = dataSource[columnProperty];
            if (values instanceof Array && values.length) {
                output = cssClass + values.join(' ' + cssClass);
            }
            return output
        });
    }
}

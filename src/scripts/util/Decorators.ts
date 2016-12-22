import Cascade, { observable, Observable, Computed, ObservableArray } from 'cascade';
import DataSource from '../implementations/DataSource';
/*
function enableSelectAll<T>(dataSource: DataSource<T>, selectionProperty: string = 'selected', selectAllProperty: string = 'selectAll', arrayProperty: string = 'activeRows') {
    Cascade.createComputed(dataSource, selectAllProperty, function () {
        var array: T[] = dataSource[arrayProperty];
        if (array && array.length) {
            var item = array.find(function (item) {
                return !item[selectionProperty];
            });
            return !item;
        } else {
            return false;
        }
    }, false, function (value: boolean) {
        var array: T[] = dataSource[arrayProperty];
        if (array) {
            array.forEach(function (item) {
                item[selectionProperty] = value;
            });
        }
    });
}

function enableArraySelection<T>(dataSource: DataSource<T>, selectionProperty: string, dataArray: T[], selectionStorageProperty = 'selected') {
    Cascade.createComputed(dataSource, selectionStorageProperty, function () {
        var selected = [];
        if (dataArray) {
            for (var index = 0, length = dataArray.length; index < length; index++) {
                var item = dataArray[index];
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
    }
    if (dataSource.clearSelection) {
        var oldFunction = dataSource.clearSelection;
        dataSource.clearSelection = function () {
            oldFunction();
            clearSelection();
        }
    } else {
        dataSource.clearSelection = clearSelection;
    }
}

function enablePagedSelection<T>(dataSource: DataSource<T>, selectionProperty: string, uniqueProperty: string, selectionStorageProperty: string = 'selected') {
    var allselected = {};
    var lockSelection = false;
    Cascade.subscribe(dataSource, 'activeRows', function (value: T[]) {
        lockSelection = true;
        var base = uniqueProperty ? 0 : (Cascade.peek(dataSource, 'page') * Cascade.peek(dataSource, 'pageSize'));
        if (value) {
            value.forEach(function (item, index) {
                var id = uniqueProperty ? item[uniqueProperty] : base + index;
                if (allselected[id]) {
                    // Store new item
                    allselected[id] = item;
                    item[selectionProperty](true);
                }
            });
        }
        lockSelection = false;
    });
    var forceSelectionChange = new Observable<boolean>(false);
    dataSource[selectionStorageProperty] = new Computed<T[]>(function (n: T[]) {
        var ignorePage = forceSelectionChange.getValue();
        forceSelectionChange.setValue(false);
        // Loop through current page
        var activeRows = dataSource.activeRows;
        if (activeRows.length) {
            if (!lockSelection) {
                var base = uniqueProperty ? 0 : (Cascade.peek(dataSource, 'page') * Cascade.peek(dataSource, 'pageSize'));
                activeRows.forEach(function (item, index) {
                    var id = uniqueProperty ? item[uniqueProperty] : base + index;
                    if (!ignorePage) {
                        if (item[selectionProperty]) {
                            allselected[id] = item;
                        } else {
                            delete allselected[id];
                        }
                    } else {
                        if (allselected[id]) {
                            item[selectionProperty] = true;
                        } else {
                            item[selectionProperty] = false;
                        }
                        // subscribe
                        item[selectionProperty];
                    }
                });
            }
        }

        // Build selected array, remove any deselected.
        var selected: T[] = [];
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
    }, false, undefined, function (value) {
        lockSelection = true;
        allselected = {};
        if (value) {
            value.forEach(function (item, index) {
                var id = item[uniqueProperty];
                // Ensure the item is selected
                item[selectionProperty](true);
                allselected[id] = item;
            });
        }
        lockSelection = false;
        forceSelectionChange.setValue(true);
    });
    function clearSelection() {
        var selected = dataSource.selected;
        for (var index = 0, length = selected.length; index < length; index++) {
            selected[index][selectionProperty](false);
        }
        allselected = {};
        dataSource.activeRows.valueHasMutated();
    };
    if (dataSource.clearSelection) {
        var oldFunction = dataSource.clearSelection;
        dataSource.clearSelection = function () {
            oldFunction();
            clearSelection();
        }
    } else {
        dataSource.clearSelection = clearSelection;
    }
}

function createColumnCss(dataSource, newProperty, columnProperty, cssClass) {
    dataSource[newProperty] = new Computed(function () {
        var output = '';
        var values = dataSource[columnProperty];
        if (values instanceof Array && values.length) {
            output = cssClass + values.join(' ' + cssClass);
        }
        return output
    });
}
*/
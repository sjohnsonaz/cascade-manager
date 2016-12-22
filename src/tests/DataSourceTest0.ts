import { expect } from 'chai';
import Cascade, { observable } from 'cascade';

import { DataSource } from '../scripts/CascadeManager';

describe('DataSource', () => {
    let dataArray = [];
    for (let index = 0; index < 100; index++) {
        dataArray.push(index);
    }
    it('Shows a page of data', () => {
        var callCount = 0;
        var dataSource = new DataSource<number>((page, pageSize, sortedColumn, sortedDirection) => {
            callCount++;
            return DataSource.pageArray(dataArray, page, pageSize, sortedColumn, sortedDirection);
        }, {
                pageSize: 20
            });
        dataSource.init();
        Cascade.subscribe(dataSource, 'activeRows', (activeRows: number[]) => {
            if (callCount === 2) {
                expect(activeRows.length).to.equal(20);
            }
        });
    });
});
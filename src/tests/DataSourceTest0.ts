import { expect } from 'chai';
import Cascade, { observable } from 'cascade';

import { DataSource } from '../scripts/CascadeManager';

describe('DataSource', () => {
    let dataArray = [];
    for (let index = 0; index < 100; index++) {
        dataArray.push(index);
    }
    it('should parse an array into a page of data', () => {
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

    it('should parse an array into a second page of data', () => {
        var callCount = 0;
        var dataSource = new DataSource<number>((page, pageSize, sortedColumn, sortedDirection) => {
            callCount++;
            return DataSource.pageArray(dataArray, page, pageSize, sortedColumn, sortedDirection);
        }, {
                pageSize: 20
            });
        dataSource.init();
        dataSource.page = 1;
        Cascade.subscribe(dataSource, 'activeRows', (activeRows: number[]) => {
            if (callCount === 2) {
                expect(activeRows[0]).to.equal(10);
            }
        });
    });

    it('should return an empty array if the page is empty', () => {
        var callCount = 0;
        var dataSource = new DataSource<number>((page, pageSize, sortedColumn, sortedDirection) => {
            callCount++;
            return DataSource.pageArray(dataArray, page, pageSize, sortedColumn, sortedDirection);
        }, {
                pageSize: 20
            });
        dataSource.init();
        dataSource.page = 5;
        Cascade.subscribe(dataSource, 'activeRows', (activeRows: number[]) => {
            if (callCount === 2) {
                expect(activeRows.length).to.equal(0);
            }
        });
    });

    it('should parse an array into different size pages', () => {
        var callCount = 0;
        var dataSource = new DataSource<number>((page, pageSize, sortedColumn, sortedDirection) => {
            callCount++;
            return DataSource.pageArray(dataArray, page, pageSize, sortedColumn, sortedDirection);
        }, {
                pageSize: 20
            });
        dataSource.init();
        dataSource.pageSize = 30;
        Cascade.subscribe(dataSource, 'activeRows', (activeRows: number[]) => {
            if (callCount === 2) {
                expect(activeRows.length).to.equal(30);
            }
        });
    })
});
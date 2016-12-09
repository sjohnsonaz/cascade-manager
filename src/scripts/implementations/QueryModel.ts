import {IQueryModel} from '../interfaces/IQueryModel';

export default class QueryModel<T> implements IQueryModel<T> {
    baseData: T;

    constructor(data?: T) {
        this.wrap(data || ({} as T));
    }

    wrap(data: T) {
        this.baseData = data;
    }

    unwrap(): T {
        return {
        } as T;
    }

    revert() {
        this.wrap(this.baseData);
    }

    update() {
        this.baseData = this.unwrap();
    }
}

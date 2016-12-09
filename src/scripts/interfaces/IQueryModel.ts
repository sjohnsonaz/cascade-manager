export interface IQueryModel<T> {
    baseData: T;
    wrap(data: T): any;
    unwrap(): T;
    revert(): any;
    update(): any;
}

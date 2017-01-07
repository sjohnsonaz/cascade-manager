export type RefreshCallback<T> = (page: number, pageSize: number, sortedColumn: string, sortedDirection: boolean) => Promise<IPage<T>>;

export interface IPage<T> {
    data: T[];
    count: number;
}

export interface IDataSourceParams<T> {
    pageSize?: number;
    page?: number;
    pagerSize?: number;
    sortedColumn?: string;
    sortedDirection?: boolean;
    activeRows?: T[];
    rowCount?: number;
    error?: boolean;
}

export interface IDataSource<T> {
    pageSize: number;
    page: number;
    pagerSize: number;
    sortedColumn: string;
    sortedDirection: boolean;
    activeRows: T[]
    rowCount: number;
    error: boolean;
    source: RefreshCallback<T>;
    lockRefresh: any
    dataComputed: Promise<IPage<T>>;

    init(): Promise<IPage<T>>;
    run(preservePage?: boolean): Promise<IPage<T>>;
    clear(): void;
}

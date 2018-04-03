export interface IListQuery {
    offset?: number;
    limit?: number;
    sort?: string;
    sort_desc?: string;
}

export type IQueryPartial<T> = {
    [P in keyof T]?: T[P] | T[P][];
}

export type IQuery<T> = IQueryPartial<T> & IListQuery;
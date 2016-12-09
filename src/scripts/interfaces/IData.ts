export interface IData<T> {

}

export interface IDataNumberDictionary<T extends IData<number>> {
    [index: number]: T;
}

export interface IDataStringDictionary<T extends IData<string>> {
    [index: string]: T;
}

export interface IConnection {
    base: string;
    init: RequestInit;
    call<T>(url: string | Request, init: RequestInit): Promise<T>;
    callText(url: string | Request, init?: RequestInit): Promise<string>;
    beforeCall(url: string | Request, init: RequestInit, noParse: boolean): RequestInit;
}

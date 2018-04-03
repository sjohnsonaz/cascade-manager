export interface IConnection {
    base: string;
    call<T>(url: string | Request, init?: RequestInit, parse?: boolean): Promise<T>;
    beforeCall(url: string | Request, init: RequestInit, noParse: boolean): RequestInit;
}

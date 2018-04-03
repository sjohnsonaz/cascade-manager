export interface IConnection {
    base: string;
    status(response: Response): Promise<Response | void>;
    json<V>(response: Response): Promise<V>;
    call<T>(url: string | Request, init?: RequestInit, parse?: boolean): Promise<T>;
    beforeCall(url: string | Request, init: RequestInit, noParse: boolean): RequestInit;
}

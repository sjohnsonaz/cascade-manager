export interface IConnection {
    base: string;
    init: RequestInit;
    status(response: Response): Promise<Response | void>;
    json<V>(response: Response): Promise<V>;
    jsonError(response: Response): Promise<any>;
    noParse(response: Response): Promise<string>;
    noParseError(response: Response): Promise<string>;
    call<T>(url: string | Request, init: RequestInit): Promise<T>;
    callText(url: string | Request, init?: RequestInit): Promise<string>;
    beforeCall(url: string | Request, init: RequestInit, noParse: boolean): RequestInit;
}

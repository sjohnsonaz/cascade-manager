export interface IConnection {
    base: string;
    init: RequestInit;
    status(response: Response): Promise<Response | void>;
    json<V>(response: Response): Promise<V>;
    call<T>(url: string | Request, init: RequestInit): Promise<T>;
}

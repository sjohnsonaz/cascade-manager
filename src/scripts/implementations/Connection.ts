import {IConnection} from '../interfaces/IConnection';

export default class Connection implements IConnection {
    base: string;
    init: RequestInit;

    constructor(base: string, route?: string, init?: RequestInit) {
        this.base = base;
        this.init = init;
        if (route) {
            this.base += route;
        }
    }

    status(response: Response): Promise<Response | void> {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }

    json<T>(response: Response): Promise<T> {
        return response.json();
    }

    call<T>(url: string | Request, init?: RequestInit) {
        init = Object.assign({}, init || {}, this.init);
        // Change credentials default to 'include'.
        // init.credentials = init.credentials || 'include';
        return fetch(url, init)
            .then(this.status)
            .then<T>(this.json);
    }

    static objectToQueryString(obj: Object) {
        var output;
        var values = [];
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                var value = obj[name];
                if (value instanceof Array) {
                    for (var index = 0, length = value.length; index < length; index++) {
                        values.push(name + '[]=' + encodeURIComponent(value[index]));
                    }
                } else if (value !== undefined) {
                    values.push(name + '=' + encodeURIComponent(value));
                }
            }
        }
        return '?' + values.join('&');
    }
}

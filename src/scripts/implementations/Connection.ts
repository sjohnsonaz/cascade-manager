import { IConnection } from '../interfaces/IConnection';
import urlJoin from '../util/UrlJoin';

export default class Connection implements IConnection {
    base: string;

    constructor(base: string, route?: string) {
        this.base = base;
        if (route) {
            this.base += route;
        }
    }

    status(response: Response): Promise<Response> {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
        } else {
            return Promise.reject<Response>(response);
        }
    }

    json<V>(response: Response): Promise<V> {
        return response.json();
    }

    jsonError(response: Response): Promise<any> {
        return response.json().then((data: any) => {
            return Promise.reject(data);
        });
    }

    noParse(response: Response): Promise<any> {
        return response.text().then((data: string) => {
            return Promise.resolve(data);
        });
    }

    noParseError(response: Response): Promise<any> {
        return response.text().then((data: string) => {
            return Promise.reject(data);
        });
    }

    call<T>(url: string | Request, init?: RequestInit, noParse: boolean = false): Promise<T> {
        init = this.beforeCall(url, init, noParse);
        if (noParse) {
            return fetch(url, init)
                .then(this.status)
                .then<any>(this.noParse)
                .catch(this.noParseError);
        } else {
            return fetch(url, init)
                .then(this.status)
                .then<T>(this.json)
                .catch(this.jsonError);
        }
    }

    beforeCall(url: string | Request, init: RequestInit, noParse: boolean): RequestInit {
        // TODO: Suppressing warning
        url;
        noParse;
        return init || {};
    }

    static join = urlJoin;

    static objectToQueryString(obj: Object) {
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

    static objectToUrlString(obj: Object) {
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
        return values.join('&');
    }
}

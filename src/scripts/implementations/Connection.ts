import { IConnection } from '../interfaces/IConnection';

import urlJoin from '../util/UrlJoin';

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

    async call<T>(url: string | Request, init?: RequestInit): Promise<T> {
        init = this.beforeCall(url, init, false);
        let response = await fetch(url, init);
        let data = await response.json();
        if (response.status < 200 || response.status >= 300) {
            throw data;
        }
        return data;
    }

    async callText(url: string | Request, init?: RequestInit): Promise<string> {
        init = this.beforeCall(url, init, true);
        let response = await fetch(url, init);
        let data = await response.text();
        if (response.status < 200 || response.status >= 300) {
            throw data;
        }
        return data;
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

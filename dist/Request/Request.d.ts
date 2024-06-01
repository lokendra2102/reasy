import { TypedJSONObject } from '../Defaults/defaults';
export declare class requestHandler {
    _URL: string | URL;
    _headers: TypedJSONObject;
    constructor(URL?: string | URL, headers?: TypedJSONObject);
    getURL(): string | URL;
    getHeaders(): TypedJSONObject;
    setURL(URL: string | URL): void;
    setHeaders(headers: TypedJSONObject): void;
    instance(URL: string | URL, headers: TypedJSONObject): requestHandler;
    get(url?: string | URL, headers?: TypedJSONObject, isConcurrent?: boolean): Promise<unknown>;
    post(url?: string | URL, body?: TypedJSONObject, headers?: TypedJSONObject, isConcurrent?: boolean): Promise<unknown>;
    put(url?: string | URL, body?: TypedJSONObject, headers?: TypedJSONObject, isConcurrent?: boolean): Promise<unknown>;
    patch(url?: string | URL, body?: TypedJSONObject, headers?: TypedJSONObject, isConcurrent?: boolean): Promise<unknown>;
    delete(url?: string | URL, headers?: TypedJSONObject, isConcurrent?: boolean): Promise<unknown>;
    all(requestList: any, cancelActiveOnError?: boolean): Promise<unknown>;
    file(url: string | URL | undefined, body: TypedJSONObject | FormData, headers?: TypedJSONObject, isConcurrent?: boolean): {
        upload: () => Promise<unknown>;
        update: () => Promise<unknown>;
        download: () => Promise<unknown>;
    };
    getInstance(): this;
}
export declare const reasy: requestHandler;

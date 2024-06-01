import { TypedJSONObject } from "../Defaults/defaults";
import { requestHandler } from "./Request";
type requestType = requestHandler;
export declare function responseBodyHandler(data: Response, responseObj: TypedJSONObject, contentType: string, resolve: any, reject: any): void;
export declare function responseInterceptor(start: number, end: number, data: Response, headers: TypedJSONObject, resolve: any, reject: any): void;
export declare function errorInterceptor(err: Error, url: string | URL, reject: any): void;
export declare function validateURL(url: string | URL, reasyInstace: requestType): string | URL;
export declare function sendRequest(url?: string | URL, headers?: TypedJSONObject, isConcurrent?: boolean, isFile?: boolean): Promise<unknown>;
export declare function createRequest(url: string | URL, headers: TypedJSONObject): Request;
export declare function constructHeaders(method: string, headers: TypedJSONObject | FormData, body: TypedJSONObject, reasyInstace: requestType): TypedJSONObject;
export declare function convertHeaders(headers: any, url?: URL | string): HeadersInit;
export declare function parseHeaders(headersStr: string, url: string | URL): HeadersInit;
export declare function fileupload(url: string | URL | undefined, body: TypedJSONObject | FormData, headers: TypedJSONObject | undefined, isConcurrent: boolean, instance: requestType): Promise<unknown>;
export declare function fileupdate(url: string | URL | undefined, body: TypedJSONObject, headers: TypedJSONObject | undefined, isConcurrent: boolean, instance: requestType): Promise<unknown>;
export declare function downloadFile(url: string | URL | undefined, headers: TypedJSONObject | undefined, isConcurrent: boolean, instance: requestType): Promise<unknown>;
export {};

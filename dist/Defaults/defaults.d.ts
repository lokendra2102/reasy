interface defaultInterface {
    headers: TypedJSONObject;
    domain: string | URL;
    controller: any;
    abortTime: number | boolean;
    preRequestHook: null | Function;
    postRequestHook: null | Function;
    abortControllers: Map<number, any>;
    allAbortControllers: Map<number, any>;
}
export interface TypedJSONObject {
    [key: string]: any;
}
export declare const defaults: defaultInterface;
export {};

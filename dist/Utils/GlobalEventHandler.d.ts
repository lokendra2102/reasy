declare class registerGlobal {
    headers: (data: Array<any> | object) => Promise<unknown>;
    domain: (data: string | null | URL) => Promise<unknown>;
    abortController: (abortTime?: number) => Promise<unknown>;
}
export declare const register: registerGlobal;
declare class interceptorGlobal {
    postRequest: (data: any) => Promise<unknown>;
    preRequest: (data: any) => Promise<unknown>;
}
export declare const interceptor: interceptorGlobal;
declare class eraseRegitser {
    domain: () => Promise<unknown>;
    headers: () => Promise<unknown>;
    abortController: () => Promise<unknown>;
    postRequest: () => Promise<unknown>;
    preRequest: () => Promise<unknown>;
    abortMap: () => Promise<unknown>;
}
export declare const erase: eraseRegitser;
export {};

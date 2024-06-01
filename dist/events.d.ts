export declare const reasy: {
    request: import("./Request/Request").requestHandler;
    erase: {
        domain: () => Promise<unknown>;
        headers: () => Promise<unknown>;
        abortController: () => Promise<unknown>;
        postRequest: () => Promise<unknown>;
        preRequest: () => Promise<unknown>;
        abortMap: () => Promise<unknown>;
    };
    interceptor: {
        postRequest: (data: any) => Promise<unknown>;
        preRequest: (data: any) => Promise<unknown>;
    };
    register: {
        headers: (data: object | any[]) => Promise<unknown>;
        domain: (data: string | URL | null) => Promise<unknown>;
        abortController: (abortTime?: number) => Promise<unknown>;
    };
};

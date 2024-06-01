interface defaultInterface {
    headers: TypedJSONObject,
    domain: string | URL,
    controller: any,
    abortTime: number | boolean,
    preRequestHook: null | Function,
    postRequestHook: null | Function,
    abortControllers: Map<number, any>;
    allAbortControllers: Map<number, any>
}

export interface TypedJSONObject {
    [key: string]: any; // Allows all
}

export const defaults: defaultInterface = {
    headers: {},
    domain: "",
    controller: false,
    abortTime: false,
    preRequestHook: null,
    postRequestHook: null,
    abortControllers: new Map<number, any>(),
    allAbortControllers: new Map<number, any>()
}
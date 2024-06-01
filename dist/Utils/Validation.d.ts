export declare const errorMessage: (data: string, isTimeout?: boolean) => string;
export declare const abortControllerNotRegisteredError: (data: string) => string;
export declare const isValidUrl: (urlString: string | URL) => string | null;
export declare const encodeQP: (urlString: string) => string;
export declare const isValidHeaders: (headers: string | Array<string> | object) => boolean;
export declare const checkIfValidParams: (url: string | URL, headers: string | Array<string> | object) => "" | "URL and Headers" | "URL" | "headers";
export declare const checkIfValidJson: (data: string) => any;
export declare const validateContentType: (contentType: string | null) => "" | "text" | "json";

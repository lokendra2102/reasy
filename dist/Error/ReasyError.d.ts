export declare class ReasyError extends Error {
    readonly code: string | number;
    constructor(message: string, code: string | number);
}

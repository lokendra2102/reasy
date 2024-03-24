export class ReasyError extends Error {
    readonly code: string | number;
    constructor(message: string, code: string | number) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        Object.setPrototypeOf(this, ReasyError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

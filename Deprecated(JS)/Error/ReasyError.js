class ReasyError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ReasyError';
        this.code = code
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ReasyError
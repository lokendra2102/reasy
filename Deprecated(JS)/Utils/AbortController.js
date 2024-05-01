// Create Abort Controller
const defaults = require("../Defaults/defaults")

const abortSignal = (isAbortController = true, timeout = -1) => {
    const abort = new AbortController();
    defaults.headers = {
        ...defaults.headers,
        abort: abort
    }
    if (defaults.abortTime || timeout >= 0) {
        setTimeout(() => {
            abort.abort()
            delete defaults.headers["abort"]
        }, timeout);
    }

    return abort;
}

const registerAbortController = (abortTime  = 0) => {
    defaults.controller = true;
    defaults.abortTime = typeof abortTime === "number" && abortTime > 0 ? abortTime : false;
}

module.exports = {
    abortSignal, 
    registerAbortController
}
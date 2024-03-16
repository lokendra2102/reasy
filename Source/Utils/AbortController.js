// Create Abort Controller
const defaults = require("../Defaults/defaults")

const abortSignal = (isAbortController = true, timeout = -1) => {
    defaults.currentAbort = new AbortController();
    defaults.headers = {
        ...defaults.headers,
        abort: defaults.currentAbort
    }
    if (defaults.abortTime || timeout >= 0) {
        setTimeout(() => {
            defaults.currentAbort.abort()
            delete defaults.headers["abort"]
        }, timeout);
    }

    return defaults.currentAbort;
}

const registerAbortController = (abortTime  = 0) => {
    defaults.controller = true;
    defaults.abortTime = typeof abortTime === "number" && abortTime > 0 ? abortTime : false;
}

module.exports = {
    abortSignal, 
    registerAbortController
}
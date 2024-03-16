const defaults = require("../Defaults/defaults");
const ReasyError = require("../Error/ReasyError");
const { isValidUrl, errorMessage } = require("./Validation");

// Register Of Global Properties
const registerGlobalHeaders = (data) => {
    if (!data || Array.isArray(data)) {
        (errorMessage("Headers"));
    } else {
        defaults.headers = { ...defaults.headers, ...data }
        return;
    }
}

const registerDefaultDomain = (data) => {
    if (!isValidUrl(data)) {
        throw new ReasyError(errorMessage("Domain"));
    } else {
        defaults.domain = data;
        return;
    }
}

const registerPostRequestHook = (data) => {
    defaults.postRequestHook = data
}

const registerPreRequestHook = (data) => {
    defaults.preRequestHook = data
}

// Removal Of Global Properties
const removeAbortController = () => {
    if (!defaults.controller) {
        throw new ReasyError(abortControllerNotRegisteredError("Abort Controller"));
    }
    defaults.controller = false
    defaults.abortTime = false
}

const removeDefaultDomain = () => {
    if (!defaults.domain) {
        throw new ReasyError(abortControllerNotRegisteredError("Default Domain"));
    }
    defaults.domain = ""
}

const removeGlobalHeaders = () => {
    if (!defaults.headers) {
        throw new ReasyError(abortControllerNotRegisteredError("Default Headers"));
    }
    defaults.headers = {}
}

const removePostRequestHook = (data) => {
    defaults.postRequestHook = null
}

const removePreRequestHook = (data) => {
    defaults.preRequestHook = null
}

module.exports = {
    registerGlobalHeaders, registerDefaultDomain,
    removeAbortController, removeDefaultDomain, removeGlobalHeaders,
    registerPostRequestHook, registerPreRequestHook, removePostRequestHook,
    removePreRequestHook
}
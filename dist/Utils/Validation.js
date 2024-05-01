"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateContentType = exports.checkIfValidJson = exports.checkIfValidParams = exports.isValidHeaders = exports.isValidUrl = exports.abortControllerNotRegisteredError = exports.errorMessage = void 0;
var errorMessage = function (data, isTimeout) {
    if (isTimeout === void 0) { isTimeout = false; }
    var err = "Invalid value for the argument ".concat(data, ".");
    if (isTimeout) {
        err += " TimeOut should be greater than 0.";
    }
    return err;
};
exports.errorMessage = errorMessage;
var abortControllerNotRegisteredError = function (data) { return "".concat(data, " is not registered. Register it to use this function"); };
exports.abortControllerNotRegisteredError = abortControllerNotRegisteredError;
var isValidUrl = function (urlString) {
    if (!urlString) {
        return null;
    }
    try {
        urlString = new URL(urlString);
        return urlString.protocol === "http:" || urlString.protocol === "https:" ? urlString : null;
    }
    catch (error) {
        return null;
    }
};
exports.isValidUrl = isValidUrl;
var isValidHeaders = function (headers) {
    if (typeof headers === "string" || Array.isArray(headers)) {
        return false;
    }
    return true;
};
exports.isValidHeaders = isValidHeaders;
var checkIfValidParams = function (url, headers) {
    var validURL = (0, exports.isValidUrl)(url);
    var validHeaders = (0, exports.isValidHeaders)(headers);
    if (!validURL && !validHeaders) {
        return "URL and Headers";
    }
    else if (!validURL) {
        return "URL";
    }
    else if (!validHeaders) {
        return "headers";
    }
    else {
        return "";
    }
};
exports.checkIfValidParams = checkIfValidParams;
var checkIfValidJson = function (data) {
    try {
        return JSON.parse(data);
    }
    catch (e) {
        return false;
    }
};
exports.checkIfValidJson = checkIfValidJson;
var validateContentType = function (contentType) {
    return contentType == null ? "" : contentType.includes("text") ? "text" : contentType.includes("json") ? "json" : "";
};
exports.validateContentType = validateContentType;

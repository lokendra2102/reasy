"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = exports.fileupdate = exports.fileupload = exports.parseHeaders = exports.convertHeaders = exports.constructHeaders = exports.createRequest = exports.sendRequest = exports.validateURL = exports.errorInterceptor = exports.responseInterceptor = exports.responseBodyHandler = void 0;
var defaults_1 = require("../Defaults/defaults");
var ReasyError_1 = require("../Error/ReasyError");
var AbortController_1 = require("../Utils/AbortController");
var Validation_1 = require("../Utils/Validation");
function responseBodyHandler(data, responseObj, contentType, resolve, reject) {
    try {
        switch (contentType) {
            case "json":
                data.json().then(function (json) {
                    responseObj.response.data = json;
                    resolve(responseObj.response);
                });
                break;
            case "text":
                data.text().then(function (text) {
                    responseObj.response.data = text;
                    resolve(responseObj);
                });
                break;
            case "blob":
                data.blob().then(function (blob) {
                    blob.arrayBuffer().then(function (ss) {
                        responseObj.response.data = Buffer.from(ss);
                        resolve(responseObj);
                    });
                });
                break;
            case "arraybuffer":
                data.arrayBuffer().then(function (buff) {
                    responseObj.response.data = Buffer.from(buff);
                    resolve(responseObj);
                });
                break;
            default:
                responseObj.response.data = data;
                resolve(responseObj);
        }
    }
    catch (error) {
        reject(responseObj);
    }
}
exports.responseBodyHandler = responseBodyHandler;
function responseInterceptor(start, end, data, headers, resolve, reject) {
    var headersJson = {
        "duration": ((end - start) / 1000).toFixed(3)
    };
    data.headers.forEach(function (value, key) {
        headersJson[key] = value;
    });
    var responseObj = {
        "response": {
            "status": data.status,
            "statusText": data.statusText,
            "url": data.url ? data.url : headersJson["url"],
            "headers": headersJson
        }
    };
    if (data.status === 404) {
        responseObj.response.method = headers.method;
        reject(responseObj);
    }
    var contentType = headers.responseType ? headers.responseType : (0, Validation_1.validateContentType)(data.headers.get("content-type"));
    if (contentType) {
        responseBodyHandler(data, responseObj, contentType, resolve, reject);
    }
    else {
        responseObj.response.data = data.body;
        resolve(responseObj);
    }
}
exports.responseInterceptor = responseInterceptor;
function errorInterceptor(err, url, reject) {
    var errorJson = (0, Validation_1.checkIfValidJson)(JSON.stringify(err));
    var urls = navigator && navigator.product === "ReactNative" ? url : new URL(url).origin + new URL(url).pathname;
    if (JSON.stringify(errorJson) !== "{}") {
        if (errorJson["cause"]) {
            errorJson = errorJson["cause"];
        }
        errorJson = __assign(__assign({}, errorJson), { message: err.message, url: urls });
        reject(errorJson);
    }
    else {
        var errorObj = {
            "stackTrace": err.message,
            url: urls
        };
        reject(errorObj);
    }
}
exports.errorInterceptor = errorInterceptor;
function validateURL(url, reasyInstace) {
    if (!url && !reasyInstace.getURL()) {
        throw new ReasyError_1.ReasyError("Do register a reazi instance or provide a URL in method scope", 401);
    }
    if (!url) {
        return reasyInstace.getURL();
    }
    return reasyInstace.getURL() ? (0, Validation_1.encodeQP)(reasyInstace.getURL().toString() + url.toString()) : (0, Validation_1.encodeQP)(url.toString());
}
exports.validateURL = validateURL;
function sendRequest() {
    return __awaiter(this, arguments, void 0, function (url, headers, isConcurrent, isFile) {
        var http, start, isValidParams, key_1, controller, req_1;
        var _this = this;
        if (url === void 0) { url = ""; }
        if (headers === void 0) { headers = {}; }
        if (isConcurrent === void 0) { isConcurrent = false; }
        if (isFile === void 0) { isFile = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, import("../Utils/http_s.js")];
                case 1:
                    http = (_a.sent()).default;
                    start = performance.now();
                    headers = __assign(__assign({}, defaults_1.defaults.headers), headers);
                    if (defaults_1.defaults.domain.toString().trim() !== "") {
                        url = defaults_1.defaults.domain.toString().slice(-1) !== "/" ? defaults_1.defaults.domain.toString() + "/" + url : defaults_1.defaults.domain.toString() + url;
                    }
                    if (headers.timeout != null && headers.timeout <= 0) {
                        throw new ReasyError_1.ReasyError((0, Validation_1.errorMessage)("TimeOut", true), 422);
                    }
                    isValidParams = (0, Validation_1.checkIfValidParams)(url, headers);
                    if (!isValidParams) {
                        if (isConcurrent) {
                            defaults_1.defaults.allAbortControllers.clear();
                        }
                        key_1 = Math.floor(Math.random() * 99999);
                        if (defaults_1.defaults.controller || headers.timeout > 0) {
                            controller = (0, AbortController_1.abortSignal)(headers.timeout > 0 ? headers.timeout : defaults_1.defaults.abortTime ? defaults_1.defaults.abortTime : -1, key_1, isConcurrent);
                            headers = __assign(__assign(__assign({}, headers), defaults_1.defaults.headers), { signal: controller.signal });
                        }
                        req_1 = createRequest(url.toString(), headers);
                        if (defaults_1.defaults.preRequestHook !== null) {
                            req_1 = defaults_1.defaults.preRequestHook(req_1);
                        }
                        return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var body, method, options, httpProtocol, req_2, xhr_1, body, method, _i, _a, _b, header, value;
                                return __generator(this, function (_c) {
                                    if (isFile) {
                                        if (typeof window === "undefined" && http.default.http && http.default.https) {
                                            url = new URL(url);
                                            body = headers.body;
                                            method = headers.method;
                                            delete headers.body;
                                            delete headers.method;
                                            options = {
                                                hostname: url.hostname,
                                                port: url.port,
                                                path: url.pathname,
                                                method: method,
                                                headers: __assign({ 'Content-Type': (method === "POST" || method === "PUT") ? "application/json" : "text/plain" }, headers)
                                            };
                                            httpProtocol = url.protocol.startsWith("https") ? http.default.https : http.default.http;
                                            req_2 = httpProtocol.request(options, function (res) {
                                                res.setEncoding('utf8');
                                                var data;
                                                res.on('data', function (chunk) {
                                                    data = chunk;
                                                });
                                                res.on('end', function () {
                                                    var body = data;
                                                    var response = new Response(body, {
                                                        status: res.statusCode,
                                                        statusText: res.statusMessage,
                                                        headers: convertHeaders(res.headers, url),
                                                    });
                                                    try {
                                                        if (res.statusCode) {
                                                            var end = performance.now();
                                                            if (defaults_1.defaults.controller || headers.timeout > 0) {
                                                                defaults_1.defaults.abortControllers.delete(key_1);
                                                            }
                                                            if (defaults_1.defaults.postRequestHook !== null) {
                                                                defaults_1.defaults.postRequestHook(response, resolve, reject);
                                                            }
                                                            else {
                                                                responseInterceptor(start, end, response, headers, resolve, reject);
                                                            }
                                                        }
                                                    }
                                                    catch (error) {
                                                        errorInterceptor(error, url, reject);
                                                    }
                                                });
                                            });
                                            req_2.on('error', function (e) {
                                                errorInterceptor(e, url, reject);
                                            });
                                            if (method === "POST" || method === "PUT") {
                                                req_2.write(body);
                                                req_2.end();
                                            }
                                            else {
                                                req_2.end();
                                            }
                                        }
                                        else {
                                            xhr_1 = new XMLHttpRequest();
                                            body = headers.body;
                                            method = headers.method;
                                            delete headers.body;
                                            delete headers.method;
                                            xhr_1.open(method, url.toString(), true);
                                            for (_i = 0, _a = Object.entries(headers); _i < _a.length; _i++) {
                                                _b = _a[_i], header = _b[0], value = _b[1];
                                                xhr_1.setRequestHeader(header, value);
                                            }
                                            xhr_1.onload = function () {
                                                var body = xhr_1.response;
                                                var response = new Response(body, {
                                                    status: xhr_1.status,
                                                    statusText: xhr_1.statusText,
                                                    headers: parseHeaders(xhr_1.getAllResponseHeaders(), url),
                                                });
                                                var end = performance.now();
                                                if (defaults_1.defaults.controller || headers.timeout > 0) {
                                                    if (isConcurrent) {
                                                        defaults_1.defaults.allAbortControllers.delete(key_1);
                                                    }
                                                    else {
                                                        defaults_1.defaults.abortControllers.delete(key_1);
                                                    }
                                                }
                                                if (defaults_1.defaults.postRequestHook !== null) {
                                                    defaults_1.defaults.postRequestHook(response, resolve, reject);
                                                }
                                                else {
                                                    responseInterceptor(start, end, response, headers, resolve, reject);
                                                }
                                            };
                                            xhr_1.onerror = function (e) {
                                                errorInterceptor(e, url, reject);
                                            };
                                            xhr_1.send(body);
                                        }
                                    }
                                    else {
                                        fetch(req_1)
                                            .then(function (data) {
                                            var end = performance.now();
                                            if (defaults_1.defaults.controller || headers.timeout > 0) {
                                                if (isConcurrent) {
                                                    defaults_1.defaults.allAbortControllers.delete(key_1);
                                                }
                                                else {
                                                    defaults_1.defaults.abortControllers.delete(key_1);
                                                }
                                            }
                                            if (defaults_1.defaults.postRequestHook !== null) {
                                                defaults_1.defaults.postRequestHook(data, resolve, reject);
                                            }
                                            else {
                                                responseInterceptor(start, end, data, headers, resolve, reject);
                                            }
                                        }).catch(function (err) {
                                            errorInterceptor(err, url, reject);
                                        })
                                            .catch(function (err) {
                                            var errorObj = {
                                                "message": err.message
                                            };
                                            reject(errorObj);
                                        });
                                    }
                                    return [2];
                                });
                            }); })];
                    }
                    else {
                        return [2, new Promise(function (resolve, reject) {
                                reject({
                                    "status": "failure",
                                    "message": (0, Validation_1.errorMessage)(isValidParams)
                                });
                            })];
                    }
                    return [2];
            }
        });
    });
}
exports.sendRequest = sendRequest;
function createRequest(url, headers) {
    return new Request(url, headers);
}
exports.createRequest = createRequest;
function constructHeaders(method, headers, body, reasyInstace) {
    var res = __assign(__assign(__assign({}, headers), reasyInstace.getHeaders()), { "method": method });
    if (body instanceof FormData) {
        res.body = body;
    }
    else {
        if (JSON.stringify(body) !== "{}") {
            res.body = JSON.stringify(body);
            res.headers = __assign(__assign({}, res.headers), { "content-type": "application/json" });
        }
    }
    return res;
}
exports.constructHeaders = constructHeaders;
function convertHeaders(headers, url) {
    var convertedHeaders = {};
    Object.entries(headers).forEach(function (_a) {
        var name = _a[0], value = _a[1];
        if (typeof value === 'string') {
            convertedHeaders[name] = value;
        }
        else if (Array.isArray(value)) {
            convertedHeaders[name] = value.join(', ');
        }
    });
    if (url) {
        if (typeof url === "string") {
            convertedHeaders.url = url;
        }
        else {
            convertedHeaders.url = url.href;
        }
    }
    return convertedHeaders;
}
exports.convertHeaders = convertHeaders;
function parseHeaders(headersStr, url) {
    var headers = {};
    var headerLines = headersStr.trim().split('\n');
    headerLines.forEach(function (line) {
        var parts = line.split(':');
        var key = parts.shift().trim();
        var value = parts.join(':').trim();
        headers[key] = value;
    });
    return convertHeaders(headers, url);
}
exports.parseHeaders = parseHeaders;
function fileupload(url, body, headers, isConcurrent, instance) {
    if (url === void 0) { url = ""; }
    if (headers === void 0) { headers = {}; }
    url = validateURL(url, instance);
    headers = constructHeaders("POST", headers, body, instance);
    return sendRequest(url, headers, isConcurrent, true);
}
exports.fileupload = fileupload;
function fileupdate(url, body, headers, isConcurrent, instance) {
    if (url === void 0) { url = ""; }
    if (headers === void 0) { headers = {}; }
    url = validateURL(url, instance);
    headers = constructHeaders("PUT", headers, body, instance);
    return sendRequest(url, headers, isConcurrent, true);
}
exports.fileupdate = fileupdate;
function downloadFile(url, headers, isConcurrent, instance) {
    if (url === void 0) { url = ""; }
    if (headers === void 0) { headers = {}; }
    url = validateURL(url, instance);
    headers = constructHeaders("GET", headers, {}, instance);
    return sendRequest(url, headers, isConcurrent, true);
}
exports.downloadFile = downloadFile;

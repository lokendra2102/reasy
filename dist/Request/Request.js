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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reasy = void 0;
var AbortController_1 = require("../Utils/AbortController");
var defaults_1 = require("../Defaults/defaults");
var Validation_1 = require("../Utils/Validation");
var ReasyError_1 = require("../Error/ReasyError");
var http_1 = __importDefault(require("http"));
var requestHandler = /** @class */ (function () {
    function requestHandler(URL, headers) {
        var validURL = URL ? (0, Validation_1.isValidUrl)(URL) : "";
        this._URL = validURL ? (typeof validURL !== "string" ? validURL.href : validURL) : "";
        this._headers = !headers ? {} : headers;
    }
    requestHandler.prototype.getURL = function () {
        return this._URL;
    };
    requestHandler.prototype.getHeaders = function () {
        return this._headers;
    };
    requestHandler.prototype.setURL = function (URL) {
        var validURL = URL ? (0, Validation_1.isValidUrl)(URL) : "";
        this._URL = validURL ? (typeof validURL !== "string" ? validURL.href : validURL) : "";
    };
    requestHandler.prototype.setHeaders = function (headers) {
        this._headers = !headers ? {} : headers;
    };
    requestHandler.prototype.responseBodyHandler = function (data, responseObj, contentType, resolve, reject) {
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
    };
    requestHandler.prototype.responseInterceptor = function (start, end, data, headers, resolve, reject) {
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
                "url": data.url,
                "headers": headersJson
            }
        };
        if (data.status === 404) {
            responseObj.response.method = headers.method;
            reject(responseObj);
        }
        var contentType = headers.responseType ? headers.responseType : (0, Validation_1.validateContentType)(data.headers.get("content-type"));
        if (contentType) {
            this.responseBodyHandler(data, responseObj, contentType, resolve, reject);
        }
        else {
            responseObj.response.data = data.body;
            resolve(responseObj);
        }
    };
    requestHandler.prototype.errorInterceptor = function (err, url, reject) {
        var errorJson = (0, Validation_1.checkIfValidJson)(JSON.stringify(err));
        var urls = new URL(url);
        if (JSON.stringify(errorJson) !== "{}") {
            if (errorJson["cause"]) {
                errorJson = errorJson["cause"];
            }
            errorJson = __assign(__assign({}, errorJson), { message: err.message, url: urls.origin + urls.pathname });
            reject(errorJson);
        }
        else {
            var errorObj = {
                "stackTrace": err.message,
                url: urls.origin + urls.pathname
            };
            reject(errorObj);
        }
    };
    requestHandler.prototype.validateURL = function (url) {
        if (!url && !this.getURL()) {
            throw new ReasyError_1.ReasyError("Do register a reasy instance or provide a URL in method scope", 401);
        }
        if (!url) {
            return this.getURL();
        }
        return this.getURL() ? this.getURL().toString() + url.toString() : url;
    };
    // Fires single HTTP/HTTPS requests
    requestHandler.prototype.sendRequest = function (url, headers, isFile) {
        var _this = this;
        if (url === void 0) { url = ""; }
        if (headers === void 0) { headers = {}; }
        if (isFile === void 0) { isFile = false; }
        var start = performance.now();
        headers = __assign(__assign({}, defaults_1.defaults.headers), headers);
        if (defaults_1.defaults.domain) {
            url = typeof url === "string" && url[0] !== "/" ? "/" + url : url;
            url = defaults_1.defaults.domain.toString() + url;
        }
        if (headers.timeout != null && headers.timeout <= 0) {
            throw new ReasyError_1.ReasyError((0, Validation_1.errorMessage)("TimeOut", true), 422);
        }
        var isValidParams = (0, Validation_1.checkIfValidParams)(url, headers);
        if (!isValidParams) {
            var key_1 = Math.floor(Math.random() * 99999);
            if (defaults_1.defaults.controller || headers.timeout > 0) {
                var controller = (0, AbortController_1.abortSignal)(headers.timeout > 0 ? headers.timeout : defaults_1.defaults.abortTime ? defaults_1.defaults.abortTime : -1, key_1);
                headers = __assign(__assign(__assign({}, headers), defaults_1.defaults.headers), { signal: controller.signal });
            }
            var req_1 = this.createRequest(url, headers);
            if (defaults_1.defaults.preRequestHook !== null) {
                req_1 = defaults_1.defaults.preRequestHook(req_1);
            }
            return new Promise(function (resolve, reject) {
                if (isFile) {
                    if (typeof window === "undefined") {
                        url = new URL(url);
                        var body = headers.body;
                        var method = headers.method;
                        delete headers.body;
                        delete headers.method;
                        var options = {
                            hostname: url.hostname,
                            port: url.port,
                            path: url.pathname,
                            method: method,
                            headers: __assign({ 'Content-Type': (method === "POST" || method === "PUT") ? "application/json" : "text/plain" }, headers)
                        };
                        var req_2 = http_1.default.request(options, function (res) {
                            res.setEncoding('utf8');
                            var data;
                            ;
                            res.on('data', function (chunk) {
                                var _a;
                                if ((_a = res.statusCode) === null || _a === void 0 ? void 0 : _a.toString().startsWith("20")) {
                                    data = chunk;
                                }
                            });
                            res.on('end', function () {
                                var body = JSON.stringify(data);
                                var response = new Response(body, {
                                    status: res.statusCode,
                                    statusText: res.statusMessage,
                                    headers: _this.convertHeaders(res.headers),
                                });
                                try {
                                    if (res.statusCode) {
                                        if (res.statusCode > 400) {
                                            throw new ReasyError_1.ReasyError(res.statusMessage ? res.statusMessage : "Error while uploading file.", 500);
                                        }
                                        else {
                                            var end = performance.now();
                                            if (defaults_1.defaults.controller || headers.timeout > 0) {
                                                defaults_1.defaults.abortControllers.delete(key_1);
                                            }
                                            if (defaults_1.defaults.postRequestHook !== null) {
                                                defaults_1.defaults.postRequestHook(response, resolve, reject);
                                            }
                                            else {
                                                _this.responseInterceptor(start, end, response, headers, resolve, reject);
                                            }
                                        }
                                    }
                                }
                                catch (error) {
                                    _this.errorInterceptor(error, url, reject);
                                }
                            });
                        });
                        req_2.on('error', function (e) {
                            _this.errorInterceptor(e, url, reject);
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
                        var instance_1 = _this;
                        var xhr_1 = new XMLHttpRequest();
                        var body = headers.body;
                        var method = headers.method;
                        delete headers.body;
                        delete headers.method;
                        xhr_1.open(method, url, true);
                        for (var _i = 0, _a = Object.entries(headers); _i < _a.length; _i++) {
                            var _b = _a[_i], header = _b[0], value = _b[1];
                            xhr_1.setRequestHeader(header, value);
                        }
                        xhr_1.onload = function () {
                            var body = JSON.stringify(xhr_1.response);
                            var response = new Response(body, {
                                status: xhr_1.status,
                                statusText: xhr_1.statusText,
                                headers: instance_1.parseHeaders(xhr_1.getAllResponseHeaders()),
                            });
                            if (xhr_1.status <= 200) {
                                var end = performance.now();
                                if (defaults_1.defaults.controller || headers.timeout > 0) {
                                    defaults_1.defaults.abortControllers.delete(key_1);
                                }
                                if (defaults_1.defaults.postRequestHook !== null) {
                                    defaults_1.defaults.postRequestHook(response, resolve, reject);
                                }
                                else {
                                    instance_1.responseInterceptor(start, end, response, headers, resolve, reject);
                                }
                            }
                            else {
                                console.error('Failed to upload file');
                            }
                        };
                        xhr_1.onerror = function (e) {
                            instance_1.errorInterceptor(e, url, reject);
                        };
                        xhr_1.send(body);
                    }
                }
                else {
                    fetch(req_1)
                        .then(function (data) {
                        var end = performance.now();
                        if (defaults_1.defaults.controller || headers.timeout > 0) {
                            defaults_1.defaults.abortControllers.delete(key_1);
                        }
                        if (defaults_1.defaults.postRequestHook !== null) {
                            defaults_1.defaults.postRequestHook(data, resolve, reject);
                        }
                        else {
                            _this.responseInterceptor(start, end, data, headers, resolve, reject);
                        }
                    }).catch(function (err) {
                        _this.errorInterceptor(err, url, reject);
                    })
                        .catch(function (err) {
                        var errorObj = {
                            "message": err.message
                        };
                        reject(errorObj);
                    });
                }
            });
        }
        else {
            throw new ReasyError_1.ReasyError((0, Validation_1.errorMessage)(isValidParams), 422);
        }
    };
    requestHandler.prototype.createRequest = function (url, headers) {
        return new Request(url, headers);
    };
    requestHandler.prototype.instance = function (URL, headers) {
        return new requestHandler(URL, headers);
    };
    requestHandler.prototype.get = function (url, headers) {
        if (url === void 0) { url = ""; }
        if (headers === void 0) { headers = {}; }
        url = this.validateURL(url);
        headers = this.constructHeaders("GET", headers, {});
        return this.sendRequest(url, headers);
    };
    requestHandler.prototype.post = function (url, body, headers) {
        if (url === void 0) { url = ""; }
        if (body === void 0) { body = {}; }
        if (headers === void 0) { headers = {}; }
        url = this.validateURL(url);
        headers = this.constructHeaders("POST", headers, body);
        return this.sendRequest(url, headers);
    };
    requestHandler.prototype.put = function (url, body, headers) {
        if (url === void 0) { url = ""; }
        if (body === void 0) { body = {}; }
        if (headers === void 0) { headers = {}; }
        url = this.validateURL(url);
        headers = this.constructHeaders("PUT", headers, body);
        return this.sendRequest(url, headers);
    };
    requestHandler.prototype.patch = function (url, body, headers) {
        if (url === void 0) { url = ""; }
        if (body === void 0) { body = {}; }
        if (headers === void 0) { headers = {}; }
        url = this.validateURL(url);
        headers = this.constructHeaders("PATCH", headers, body);
        return this.sendRequest(url, headers);
    };
    requestHandler.prototype.delete = function (url, headers) {
        if (url === void 0) { url = ""; }
        if (headers === void 0) { headers = {}; }
        url = this.validateURL(url);
        headers = this.constructHeaders("DELETE", headers, {});
        return this.sendRequest(url, headers);
    };
    requestHandler.prototype.constructHeaders = function (method, headers, body, isFile) {
        if (isFile === void 0) { isFile = false; }
        var res = __assign(__assign(__assign({}, headers), this.getHeaders()), { "method": method });
        if (!isFile) {
        }
        if (JSON.stringify(body) !== "{}") {
            res.body = JSON.stringify(body);
        }
        return res;
    };
    requestHandler.prototype.convertHeaders = function (headers) {
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
        return convertedHeaders;
    };
    requestHandler.prototype.parseHeaders = function (headersStr) {
        var headers = {};
        var headerLines = headersStr.trim().split('\n');
        headerLines.forEach(function (line) {
            var parts = line.split(':');
            var key = parts.shift().trim();
            var value = parts.join(':').trim();
            headers[key] = value;
        });
        return this.convertHeaders(headers);
    };
    // Fires multiple HTTP/HTTPS requests
    requestHandler.prototype.all = function (requestList) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!Array.isArray(requestList)) {
                    throw new ReasyError_1.ReasyError((0, Validation_1.errorMessage)("Request List"), 422);
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var responseData = [];
                        Promise.all(requestList.map(function (ele, index) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, ele.then(function (data) {
                                            responseData.push(data);
                                        })
                                            .catch(function (data) {
                                            responseData.push(data);
                                            defaults_1.defaults.abortControllers.forEach(function (ele) {
                                                ele.abort();
                                            });
                                            defaults_1.defaults.abortControllers.clear();
                                            reject(responseData);
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }))
                            .then(function (data) {
                            resolve(responseData);
                        }).catch(function (err) {
                            reject(responseData);
                        });
                    }).then(function (data) {
                        return data;
                    }).catch(function (err) {
                        return err;
                    })];
            });
        });
    };
    requestHandler.prototype.file = function (url, body, headers) {
        var _this = this;
        if (url === void 0) { url = ""; }
        if (headers === void 0) { headers = {}; }
        return {
            upload: function () { return _this.fileupload(url, body, headers); },
            update: function () { return _this.fileupdate(url, body, headers); },
            download: function () { return _this.downloadFile(url, headers); }
        };
    };
    // File Upload APIs
    requestHandler.prototype.fileupload = function (url, body, headers) {
        if (url === void 0) { url = ""; }
        if (headers === void 0) { headers = {}; }
        url = this.validateURL(url);
        headers = this.constructHeaders("POST", headers, body, true);
        return this.sendRequest(url, headers, true);
    };
    requestHandler.prototype.fileupdate = function (url, body, headers) {
        if (url === void 0) { url = ""; }
        if (headers === void 0) { headers = {}; }
        url = this.validateURL(url);
        headers = this.constructHeaders("PUT", headers, body, true);
        return this.sendRequest(url, headers, true);
    };
    requestHandler.prototype.downloadFile = function (url, headers) {
        if (url === void 0) { url = ""; }
        if (headers === void 0) { headers = {}; }
        url = this.validateURL(url);
        headers = this.constructHeaders("GET", headers, {}, true);
        return this.sendRequest(url, headers, true);
    };
    return requestHandler;
}());
exports.reasy = new requestHandler();

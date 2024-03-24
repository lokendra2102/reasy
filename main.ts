/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 602:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaults = void 0;
exports.defaults = {
    headers: {},
    domain: "",
    controller: false,
    abortTime: false,
    preRequestHook: null,
    postRequestHook: null,
    abortControllers: new Map()
};


/***/ }),

/***/ 118:
/***/ (function(__unused_webpack_module, exports) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReasyError = void 0;
var ReasyError = /** @class */ (function (_super) {
    __extends(ReasyError, _super);
    function ReasyError(message, code) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.code = code;
        Object.setPrototypeOf(_this, ReasyError.prototype);
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return ReasyError;
}(Error));
exports.ReasyError = ReasyError;


/***/ }),

/***/ 344:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.reasy = void 0;
var AbortController_1 = __webpack_require__(291);
var defaults_1 = __webpack_require__(602);
var Validation_1 = __webpack_require__(594);
var ReasyError_1 = __webpack_require__(118);
var requestHandler = /** @class */ (function () {
    function requestHandler(URL, headers) {
        this.URL = !URL ? "" : URL;
        this.headers = !headers ? {} : headers;
    }
    requestHandler.prototype.responseBodyHandler = function (data, responseObj, contentType, resolve, reject) {
        try {
            switch (contentType) {
                case "json":
                    data.json().then(function (json) {
                        responseObj.response.data = json;
                        resolve(responseObj);
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
        var contentType = headers.responseType ? headers.responseType : "json";
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
        if (errorJson) {
            if (errorJson["cause"]) {
                errorJson = errorJson["cause"];
            }
            errorJson = {
                request: __assign(__assign({}, errorJson), { message: err.message, url: urls.origin, path: urls.pathname })
            };
            reject(errorJson);
        }
        else {
            var errorObj = {
                request: {
                    "stackTrace": JSON.stringify(err),
                    url: urls.origin,
                    path: urls.pathname
                }
            };
            reject(errorObj);
        }
    };
    requestHandler.prototype.validateURL = function (url) {
        if (!url && !this.URL) {
            throw new ReasyError_1.ReasyError("Do register a reasy instance or provide a URL in method scope", 401);
        }
        if (!url) {
            return url = this.URL;
        }
        return url;
    };
    // Fires single HTTP/HTTPS requests
    requestHandler.prototype.sendRequest = function (url, headers) {
        var _this = this;
        if (url === void 0) { url = ""; }
        if (headers === void 0) { headers = {}; }
        var start = performance.now();
        headers = __assign(__assign({}, defaults_1.defaults.headers), headers);
        if (defaults_1.defaults.domain) {
            url = defaults_1.defaults.domain.toString() + url;
        }
        if (headers.timeout != null && headers.timeout <= 0) {
            throw new ReasyError_1.ReasyError((0, Validation_1.errorMessage)("TimeOut", true), 422);
        }
        console.log(url);
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
        headers = __assign(__assign(__assign({}, headers), this.headers), { "method": "GET" });
        return this.sendRequest(url, headers);
    };
    requestHandler.prototype.post = function (url, body, headers) {
        if (url === void 0) { url = ""; }
        if (body === void 0) { body = {}; }
        if (headers === void 0) { headers = {}; }
        url = this.validateURL(url);
        headers = __assign(__assign(__assign({}, headers), this.headers), { "method": "POST", "body": JSON.stringify(body) });
        return this.sendRequest(url, headers);
    };
    requestHandler.prototype.put = function (url, body, headers) {
        if (url === void 0) { url = ""; }
        if (body === void 0) { body = {}; }
        if (headers === void 0) { headers = {}; }
        url = this.validateURL(url);
        headers = __assign(__assign(__assign({}, headers), this.headers), { "method": "PUT", "body": JSON.stringify(body) });
        return this.sendRequest(url, headers);
    };
    requestHandler.prototype.patch = function (url, body, headers) {
        if (url === void 0) { url = ""; }
        if (body === void 0) { body = {}; }
        if (headers === void 0) { headers = {}; }
        url = this.validateURL(url);
        headers = __assign(__assign(__assign({}, headers), this.headers), { "method": "PATCH", "body": JSON.stringify(body) });
        return this.sendRequest(url, headers);
    };
    requestHandler.prototype.delete = function (url, headers) {
        if (url === void 0) { url = ""; }
        if (headers === void 0) { headers = {}; }
        url = this.validateURL(url);
        headers = __assign(__assign(__assign({}, headers), this.headers), { "method": "DELETE" });
        return this.sendRequest(url, headers);
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
    return requestHandler;
}());
exports.reasy = new requestHandler();


/***/ }),

/***/ 291:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.registerAbortController = exports.abortSignal = void 0;
// Create Abort Controller
var defaults_1 = __webpack_require__(602);
var abortSignal = function (timeout, num) {
    if (timeout === void 0) { timeout = -1; }
    var abort = new AbortController();
    defaults_1.defaults.headers = __assign(__assign({}, defaults_1.defaults.headers), { abort: abort });
    if (defaults_1.defaults.abortTime || timeout >= 0) {
        setTimeout(function () {
            abort.abort();
            defaults_1.defaults.abortControllers.delete(num);
            delete defaults_1.defaults.headers["abort"];
        }, timeout);
    }
    defaults_1.defaults.abortControllers.set(num, abort);
    return abort;
};
exports.abortSignal = abortSignal;
var registerAbortController = function (abortTime) {
    if (abortTime === void 0) { abortTime = 0; }
    defaults_1.defaults.controller = true;
    defaults_1.defaults.abortTime = typeof abortTime === "number" && abortTime > 0 ? abortTime : false;
};
exports.registerAbortController = registerAbortController;


/***/ }),

/***/ 962:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.erase = exports.interceptor = exports.register = void 0;
var Validation_1 = __webpack_require__(594);
var defaults_1 = __webpack_require__(602);
var ReasyError_1 = __webpack_require__(118);
var registerGlobal = /** @class */ (function () {
    function registerGlobal() {
        // Register Of Global Properties
        this.headers = function (data) {
            if (!data || Array.isArray(data)) {
                throw new ReasyError_1.ReasyError((0, Validation_1.errorMessage)("Headers"), 422);
            }
            else {
                defaults_1.defaults.headers = __assign(__assign({}, defaults_1.defaults.headers), data);
            }
        };
        this.domain = function (data) {
            if (!(0, Validation_1.isValidUrl)(data)) {
                throw new ReasyError_1.ReasyError((0, Validation_1.errorMessage)("Domain"), 422);
            }
            else {
                defaults_1.defaults.domain = data;
            }
        };
    }
    return registerGlobal;
}());
exports.register = new registerGlobal();
var interceptorGlobal = /** @class */ (function () {
    function interceptorGlobal() {
        this.postRequest = function (data) {
            defaults_1.defaults.postRequestHook = data;
        };
        this.preRequest = function (data) {
            defaults_1.defaults.preRequestHook = data;
        };
    }
    return interceptorGlobal;
}());
exports.interceptor = new interceptorGlobal();
var eraseRegitser = /** @class */ (function () {
    function eraseRegitser() {
        this.domain = function () {
            if (!defaults_1.defaults.domain) {
                throw new ReasyError_1.ReasyError((0, Validation_1.abortControllerNotRegisteredError)("Default Domain"), 404);
            }
            defaults_1.defaults.domain = "";
        };
        this.headers = function () {
            if (!defaults_1.defaults.headers) {
                throw new ReasyError_1.ReasyError((0, Validation_1.abortControllerNotRegisteredError)("Default Headers"), 404);
            }
            defaults_1.defaults.headers = {};
        };
        this.removeAbortController = function () {
            if (!defaults_1.defaults.controller) {
                throw new ReasyError_1.ReasyError((0, Validation_1.abortControllerNotRegisteredError)("Abort Controller"), 404);
            }
            defaults_1.defaults.controller = false;
            defaults_1.defaults.abortTime = false;
        };
        this.postRequest = function () {
            defaults_1.defaults.postRequestHook = null;
        };
        this.preRequest = function () {
            defaults_1.defaults.preRequestHook = null;
        };
    }
    return eraseRegitser;
}());
exports.erase = new eraseRegitser();


/***/ }),

/***/ 594:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkIfValidJson = exports.checkIfValidParams = exports.isValidHeaders = exports.isValidUrl = exports.abortControllerNotRegisteredError = exports.errorMessage = void 0;
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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
__webpack_unused_export__ = void 0;
var Request_1 = __webpack_require__(344);
var GlobalEventHandler_1 = __webpack_require__(962);
var ReasyError_1 = __webpack_require__(118);
var defaults_1 = __webpack_require__(602);
var Validation_1 = __webpack_require__(594);
var AbortController_1 = __webpack_require__(291);
__webpack_unused_export__ = {
    request: Request_1.reasy,
    erase: GlobalEventHandler_1.erase,
    interceptor: GlobalEventHandler_1.interceptor,
    register: GlobalEventHandler_1.register,
    ReasyError: ReasyError_1.ReasyError,
    defaults: defaults_1.defaults,
    errorMessage: Validation_1.errorMessage,
    abortControllerNotRegisteredError: Validation_1.abortControllerNotRegisteredError,
    isValidHeaders: Validation_1.isValidHeaders,
    checkIfValidJson: Validation_1.checkIfValidJson,
    isValidUrl: Validation_1.isValidUrl,
    checkIfValidParams: Validation_1.checkIfValidParams,
    abortSignal: AbortController_1.abortSignal,
    registerAbortController: AbortController_1.registerAbortController
};

})();

/******/ })()
;
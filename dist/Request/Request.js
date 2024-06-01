"use strict";
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
exports.reasy = exports.requestHandler = void 0;
var defaults_1 = require("../Defaults/defaults");
var Validation_1 = require("../Utils/Validation");
var Request_util_1 = require("./Request-util");
var requestHandler = (function () {
    function requestHandler(URL, headers) {
        var validURL = URL ? (0, Validation_1.isValidUrl)(URL) : "";
        this._URL = validURL ? validURL : "";
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
        this._URL = validURL ? validURL : "";
    };
    requestHandler.prototype.setHeaders = function (headers) {
        this._headers = !headers ? {} : headers;
    };
    requestHandler.prototype.instance = function (URL, headers) {
        return new requestHandler(URL, headers);
    };
    requestHandler.prototype.get = function (url, headers, isConcurrent) {
        if (url === void 0) { url = ""; }
        if (headers === void 0) { headers = {}; }
        if (isConcurrent === void 0) { isConcurrent = false; }
        try {
            url = (0, Request_util_1.validateURL)(url, this);
            headers = (0, Request_util_1.constructHeaders)("GET", headers, {}, this);
            return (0, Request_util_1.sendRequest)(url, headers, isConcurrent);
        }
        catch (error) {
            return new Promise(function (resolve, reject) {
                reject({
                    "status": "failure",
                    "message": error.message
                });
            });
        }
    };
    requestHandler.prototype.post = function (url, body, headers, isConcurrent) {
        if (url === void 0) { url = ""; }
        if (body === void 0) { body = {}; }
        if (headers === void 0) { headers = {}; }
        if (isConcurrent === void 0) { isConcurrent = false; }
        url = (0, Request_util_1.validateURL)(url, this);
        headers = (0, Request_util_1.constructHeaders)("POST", headers, body, this);
        return (0, Request_util_1.sendRequest)(url, headers, isConcurrent);
    };
    requestHandler.prototype.put = function (url, body, headers, isConcurrent) {
        if (url === void 0) { url = ""; }
        if (body === void 0) { body = {}; }
        if (headers === void 0) { headers = {}; }
        if (isConcurrent === void 0) { isConcurrent = false; }
        url = (0, Request_util_1.validateURL)(url, this);
        headers = (0, Request_util_1.constructHeaders)("PUT", headers, body, this);
        return (0, Request_util_1.sendRequest)(url, headers, isConcurrent);
    };
    requestHandler.prototype.patch = function (url, body, headers, isConcurrent) {
        if (url === void 0) { url = ""; }
        if (body === void 0) { body = {}; }
        if (headers === void 0) { headers = {}; }
        if (isConcurrent === void 0) { isConcurrent = false; }
        url = (0, Request_util_1.validateURL)(url, this);
        headers = (0, Request_util_1.constructHeaders)("PATCH", headers, body, this);
        return (0, Request_util_1.sendRequest)(url, headers, isConcurrent);
    };
    requestHandler.prototype.delete = function (url, headers, isConcurrent) {
        if (url === void 0) { url = ""; }
        if (headers === void 0) { headers = {}; }
        if (isConcurrent === void 0) { isConcurrent = false; }
        url = (0, Request_util_1.validateURL)(url, this);
        headers = (0, Request_util_1.constructHeaders)("DELETE", headers, {}, this);
        return (0, Request_util_1.sendRequest)(url, headers, isConcurrent);
    };
    requestHandler.prototype.all = function (requestList_1) {
        return __awaiter(this, arguments, void 0, function (requestList, cancelActiveOnError) {
            var _this = this;
            if (cancelActiveOnError === void 0) { cancelActiveOnError = true; }
            return __generator(this, function (_a) {
                if (!Array.isArray(requestList)) {
                    return [2, new Promise(function (resolve, reject) {
                            reject({
                                "status": "failure",
                                "message": (0, Validation_1.errorMessage)("Request List")
                            });
                        })];
                }
                return [2, new Promise(function (resolve, reject) {
                        var responseData = [];
                        Promise.all(requestList.map(function (ele, index) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, ele.then(function (data) {
                                            responseData.push(data);
                                        })
                                            .catch(function (data) {
                                            responseData.push(data);
                                            if (cancelActiveOnError) {
                                                defaults_1.defaults.allAbortControllers.forEach(function (ele) {
                                                    ele.abort();
                                                });
                                                defaults_1.defaults.allAbortControllers.clear();
                                            }
                                            reject(responseData);
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2];
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
    requestHandler.prototype.file = function (url, body, headers, isConcurrent) {
        var _this = this;
        if (url === void 0) { url = ""; }
        if (headers === void 0) { headers = {}; }
        if (isConcurrent === void 0) { isConcurrent = false; }
        return {
            upload: function () { return (0, Request_util_1.fileupload)(url, body, headers, isConcurrent, _this); },
            update: function () { return (0, Request_util_1.fileupdate)(url, body, headers, isConcurrent, _this); },
            download: function () { return (0, Request_util_1.downloadFile)(url, headers, isConcurrent, _this); }
        };
    };
    requestHandler.prototype.getInstance = function () {
        return this;
    };
    return requestHandler;
}());
exports.requestHandler = requestHandler;
exports.reasy = new requestHandler();

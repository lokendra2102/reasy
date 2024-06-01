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
Object.defineProperty(exports, "__esModule", { value: true });
exports.erase = exports.interceptor = exports.register = void 0;
var Validation_1 = require("./Validation");
var defaults_1 = require("../Defaults/defaults");
var registerGlobal = (function () {
    function registerGlobal() {
        this.headers = function (data) {
            return new Promise(function (resolve, reject) {
                if (!data || Array.isArray(data)) {
                    reject({
                        "status": "failure",
                        "message": (0, Validation_1.errorMessage)("Headers")
                    });
                }
                else {
                    defaults_1.defaults.headers = __assign(__assign({}, defaults_1.defaults.headers), data);
                    resolve({
                        "status": "success"
                    });
                }
            });
        };
        this.domain = function (data) {
            return new Promise(function (resolve, reject) {
                data = data ? (0, Validation_1.isValidUrl)(data) : null;
                if (!data) {
                    reject({
                        "status": "failure",
                        "message": (0, Validation_1.errorMessage)("Domain")
                    });
                }
                else {
                    defaults_1.defaults.domain = data;
                    resolve({
                        "status": "success"
                    });
                }
            });
        };
        this.abortController = function (abortTime) {
            if (abortTime === void 0) { abortTime = 0; }
            return new Promise(function (resolve, reject) {
                defaults_1.defaults.controller = true;
                defaults_1.defaults.abortTime = abortTime > 0 ? abortTime : false;
                resolve({
                    "status": "success"
                });
            });
        };
    }
    return registerGlobal;
}());
exports.register = new registerGlobal();
var interceptorGlobal = (function () {
    function interceptorGlobal() {
        this.postRequest = function (data) {
            return new Promise(function (resolve, reject) {
                defaults_1.defaults.postRequestHook = data;
                resolve({
                    "status": "success"
                });
            });
        };
        this.preRequest = function (data) {
            return new Promise(function (resolve, reject) {
                defaults_1.defaults.preRequestHook = data;
                resolve({
                    "status": "success"
                });
            });
        };
    }
    return interceptorGlobal;
}());
exports.interceptor = new interceptorGlobal();
var eraseRegitser = (function () {
    function eraseRegitser() {
        this.domain = function () {
            return new Promise(function (resolve, reject) {
                if (!defaults_1.defaults.domain) {
                    reject({
                        "status": "failure",
                        "message": (0, Validation_1.errorMessage)("Default Domain")
                    });
                }
                else {
                    defaults_1.defaults.domain = "";
                    resolve({
                        "status": "success"
                    });
                }
            });
        };
        this.headers = function () {
            return new Promise(function (resolve, reject) {
                if (!defaults_1.defaults.headers) {
                    reject({
                        "status": "failure",
                        "message": (0, Validation_1.errorMessage)("Default Headers")
                    });
                }
                else {
                    defaults_1.defaults.headers = {};
                    resolve({
                        "status": "success"
                    });
                }
            });
        };
        this.abortController = function () {
            return new Promise(function (resolve, reject) {
                if (!defaults_1.defaults.controller) {
                    reject({
                        "status": "failure",
                        "message": (0, Validation_1.errorMessage)("Abort Controller")
                    });
                }
                else {
                    defaults_1.defaults.controller = false;
                    defaults_1.defaults.abortTime = false;
                    resolve({
                        "status": "success"
                    });
                }
            });
        };
        this.postRequest = function () {
            return new Promise(function (resolve, reject) {
                defaults_1.defaults.postRequestHook = null;
                resolve({
                    "status": "success"
                });
            });
        };
        this.preRequest = function () {
            return new Promise(function (resolve, reject) {
                defaults_1.defaults.preRequestHook = null;
                resolve({
                    "status": "success"
                });
            });
        };
        this.abortMap = function () {
            return new Promise(function (resolve, reject) {
                defaults_1.defaults.abortControllers.clear();
                defaults_1.defaults.allAbortControllers.clear();
                resolve({
                    "status": "success"
                });
            });
        };
    }
    return eraseRegitser;
}());
exports.erase = new eraseRegitser();

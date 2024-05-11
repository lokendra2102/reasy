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
var ReasyError_1 = require("../Error/ReasyError");
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
            data = data ? (0, Validation_1.isValidUrl)(data) : null;
            if (!data) {
                throw new ReasyError_1.ReasyError((0, Validation_1.errorMessage)("Domain"), 422);
            }
            else {
                defaults_1.defaults.domain = data.origin;
            }
        };
        this.abortController = function (abortTime) {
            if (abortTime === void 0) { abortTime = 0; }
            defaults_1.defaults.controller = true;
            defaults_1.defaults.abortTime = abortTime > 0 ? abortTime : false;
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
        this.abortController = function () {
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

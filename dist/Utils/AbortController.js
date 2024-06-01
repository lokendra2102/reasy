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
exports.abortSignal = void 0;
var defaults_1 = require("../Defaults/defaults");
var abortSignal = function (timeout, num, isConcurrent) {
    if (timeout === void 0) { timeout = -1; }
    if (isConcurrent === void 0) { isConcurrent = false; }
    var abort = new AbortController();
    defaults_1.defaults.headers = __assign(__assign({}, defaults_1.defaults.headers), { abort: abort });
    if (defaults_1.defaults.abortTime || timeout >= 0) {
        setTimeout(function () {
            abort.abort();
            if (isConcurrent) {
                defaults_1.defaults.allAbortControllers.delete(num);
            }
            else {
                defaults_1.defaults.abortControllers.delete(num);
            }
            delete defaults_1.defaults.headers["abort"];
        }, timeout);
    }
    if (isConcurrent) {
        defaults_1.defaults.allAbortControllers.set(num, abort);
    }
    else {
        defaults_1.defaults.abortControllers.set(num, abort);
    }
    return abort;
};
exports.abortSignal = abortSignal;

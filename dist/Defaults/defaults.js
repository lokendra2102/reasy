"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaults = void 0;
exports.defaults = {
    headers: {},
    domain: "",
    controller: false,
    abortTime: false,
    preRequestHook: null,
    postRequestHook: null,
    abortControllers: new Map(),
    allAbortControllers: new Map()
};

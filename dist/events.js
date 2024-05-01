"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reasy = void 0;
var Request_1 = require("./Request/Request");
var GlobalEventHandler_1 = require("./Utils/GlobalEventHandler");
exports.reasy = {
    request: Request_1.reasy,
    erase: GlobalEventHandler_1.erase,
    interceptor: GlobalEventHandler_1.interceptor,
    register: GlobalEventHandler_1.register
};

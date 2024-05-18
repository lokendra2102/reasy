"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http, https;
try {
    http = require('http');
    https = require('https');
}
catch (error) {
    http = false;
    https = false;
}
exports.default = {
    http: http,
    https: https
};

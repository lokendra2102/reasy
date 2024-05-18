let http, https;

try {
    http = require('http')
    https = require('https')
} catch (error) {
    http = false
    https = false
}
export default {
    http: http,
    https: https
}
const ReasyError = require("../Error/ReasyError");
const { errorMessage, checkIfValidParams, checkIfValidJson } = require("../Utils/Validation");
const defaults = require("../Defaults/defaults");
const { abortSignal } = require("../Utils/AbortController");

const createRequest = (url, headers) => {
    return new Request(url, headers);
}

// Fires single HTTP/HTTPS requests
const sendRequest = (url, headers) => {
    console.log(url);
    headers = { ...defaults.headers, ...headers }
    if (!defaults.domain) {
        url = defaults.domain + url;
    }
    if (headers.timeout != null && headers.timeout <= 0) {
        throw new ReasyError(errorMessage("TimeOut", true));
    }
    let isValidParams = checkIfValidParams(url, headers)
    if (typeof isValidParams === "boolean") {
        if (defaults.controller || headers.timeout > 0) {
            defaults.abortControllers = []
            let controller = abortSignal(true, headers.timeout > 0 ? headers.timeout : defaults.abortTime ? defaults.abortTime : -1)
            headers = {
                ...headers,
                ...defaults.headers,
                signal: controller.signal
            }

            defaults.abortControllers.push({
                "abort": controller,
                "endpoint": url
            })
        }

        let req = createRequest(url, headers);

        if (defaults.preRequestHook !== null) {
            req = defaults.preRequestHook(req)
        }

        return new Promise((resolve, reject) => {
            fetch(req)
                .then(data => {
                    if (defaults.postRequestHook !== null) {
                        defaults.postRequestHook(data, resolve, reject)
                    } else {
                        defaults.abortControllers[data.url] = null;
                        if (!data.ok) {
                            const headersJson = {};
                            for (const [name, value] of data.headers.entries()) {
                                headersJson[name] = value;
                            }
                            let errorObj = {
                                "response": {
                                    "status": data.status,
                                    "statusText": data.statusText,
                                    "url": data.url,
                                    "headers": headersJson
                                }
                            }
                            const contentType = data.headers.get('Content-Type');
                            if (contentType && contentType.includes('application/json')) {
                                data.json().then(json => {
                                    errorObj.response.data = JSON.stringify(json);
                                    reject(errorObj)
                                }).catch((err) => {
                                    reject(errorObj)
                                })
                            } else {
                                data.text().then(json => {
                                    errorObj.response.data = json;
                                    reject(errorObj)
                                }).catch(err => {
                                    reject(errorObj)
                                })
                            }
                        } else {
                            resolve(data)
                        }
                    }
                }).catch(err => {
                    let errorJson = checkIfValidJson(JSON.stringify(err))
                    let urls = new URL(url)
                    if (errorJson) {
                        if (errorJson["cause"]) {
                            errorJson = errorJson["cause"]
                        }
                        errorJson = {
                            request: {
                                ...errorJson,
                                message: err.message,
                                url: urls.origin,
                                path: urls.pathname
                            }
                        }
                        reject(errorJson)
                    } else {
                        let errorObj = {
                            request: {
                                "stackTrace": JSON.stringify(err),
                                url: urls.origin,
                                path: urls.pathname
                            }
                        }
                        reject(errorObj)
                    }
                })
                .catch((err) => {
                    let errorObj = {
                        "message": err.message
                    }
                    reject(errorObj)
                })
        })
    } else {
        throw new ReasyError(errorMessage(isValidParams));
    }
}

// Fires multiple HTTP/HTTPS requests
const all = (requestList) => {
    if (!Array.isArray(requestList)) {
        throw new ReasyError(errorMessage("Request List"));
    }
    return new Promise((resolve, reject) => {
        let responseData = [];
        Promise.all(requestList.map(async(ele, index) => {
            await ele.then(data => {
                responseData.push(data)
            }).catch(data => {
                responseData.push(data)
                if (defaults.abortControllers) {
                    for (let i = 0; i < defaults.abortControllers.length; i++) {
                        if (data.request && defaults.abortControllers[i].abort !== null &&
                            defaults.abortControllers[i].endpoint !== data.request.url) {
                            defaults.abortControllers[i].abort.abort()
                        }
                    }
                    defaults.abortControllers = []
                    reject(responseData)
                } else {
                    reject(responseData)
                }
            })

        }))
            .then(data => {
                resolve(responseData)
            }).catch((err) => {
                reject(responseData)
            })
    }).then((data) => {
        return data
    }).catch(err => {
        return err
    })
}

module.exports = {
    sendRequest,
    all
}
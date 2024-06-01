import { TypedJSONObject, defaults } from "../Defaults/defaults";
import { ReasyError } from "../Error/ReasyError";
import { abortSignal } from "../Utils/AbortController";
import { checkIfValidJson, checkIfValidParams, encodeQP, errorMessage, validateContentType } from "../Utils/Validation";
import { requestHandler } from "./Request";

type requestType = requestHandler;

export function responseBodyHandler(data: Response, responseObj: TypedJSONObject, contentType: string, resolve: any, reject: any) {
    try {
        switch (contentType) {
            case "json":
                data.json().then(json => {
                    responseObj.response.data = json;
                    resolve(responseObj.response);
                });
                break;
            case "text":
                data.text().then(text => {
                    responseObj.response.data = text;
                    resolve(responseObj);
                });
                break;
            case "blob":
                data.blob().then(blob => {
                    blob.arrayBuffer().then(ss => {
                        responseObj.response.data = Buffer.from(ss)
                        resolve(responseObj);
                    });
                })
                break;
            case "arraybuffer":
                data.arrayBuffer().then(buff => {
                    responseObj.response.data = Buffer.from(buff)
                    resolve(responseObj);
                })
                break;
            default:
                responseObj.response.data = data
                resolve(responseObj)
        }
    } catch (error) {
        reject(responseObj)
    }
}

export function responseInterceptor(start: number, end: number, data: Response, headers: TypedJSONObject, resolve: any, reject: any) {
    const headersJson: TypedJSONObject = {
        "duration": ((end - start) / 1000).toFixed(3)
    };
    data.headers.forEach((value, key) => {
        headersJson[key] = value
    })
    let responseObj: TypedJSONObject = {
        "response": {
            "status": data.status,
            "statusText": data.statusText,
            "url": data.url ? data.url : headersJson["url"],
            "headers": headersJson
        }
    }
    if (data.status === 404) {
        responseObj.response.method = headers.method;
        reject(responseObj)
    }
    const contentType = headers.responseType ? headers.responseType : validateContentType(data.headers.get("content-type"));
    if (contentType) {
        responseBodyHandler(data, responseObj, contentType, resolve, reject);
    } else {
        responseObj.response.data = data.body
        resolve(responseObj)
    }
}

export function errorInterceptor(err: Error, url: string | URL, reject: any) {
    let errorJson: TypedJSONObject = checkIfValidJson(JSON.stringify(err))
    let urls = navigator && navigator.product === "ReactNative" ? url : new URL(url).origin + new URL(url).pathname
    if (JSON.stringify(errorJson) !== "{}") {
        if (errorJson["cause"]) {
            errorJson = errorJson["cause"]
        }
        errorJson = {
            ...errorJson,
            message: err.message,
            url: urls
        }
        reject(errorJson)
    } else {
        let errorObj = {
            "stackTrace": err.message,
            url: urls
        }
        reject(errorObj)
    }
}

export function validateURL(url: string | URL, reasyInstace: requestType) {
    if (!url && !reasyInstace.getURL()) {
        throw new ReasyError("Do register a reazi instance or provide a URL in method scope", 401);
    }
    if (!url) {
        return reasyInstace.getURL();
    }
    return reasyInstace.getURL() ? encodeQP(reasyInstace.getURL().toString() + url.toString()) : encodeQP(url.toString());
}

// Fires single HTTP/HTTPS requests
export async function sendRequest(url: string | URL = "", headers: TypedJSONObject = {}, isConcurrent = false, isFile = false) {
    const http = (await import("../Utils/http_s.js")).default
    const start = performance.now();
    headers = { ...defaults.headers, ...headers }
    if (defaults.domain.toString().trim() !== "") {
        url = defaults.domain.toString().slice(-1) !== "/" ? defaults.domain.toString() + "/" + url : defaults.domain.toString() + url;
    }
    if (headers.timeout != null && headers.timeout <= 0) {
        throw new ReasyError(errorMessage("TimeOut", true), 422);
    }
    let isValidParams: string = checkIfValidParams(url, headers)
    if (!isValidParams) {
        if(isConcurrent){
            defaults.allAbortControllers.clear();   
        }
        let key = Math.floor(Math.random() * 99999)
        if (defaults.controller || headers.timeout > 0) {
            let controller = abortSignal(headers.timeout > 0 ? headers.timeout : defaults.abortTime ? defaults.abortTime : -1, key, isConcurrent)
            headers = {
                ...headers,
                ...defaults.headers,
                signal: controller.signal
            }
        }

        let req = createRequest(url.toString(), headers);

        if (defaults.preRequestHook !== null) {
            req = defaults.preRequestHook(req)
        }

        return new Promise(async(resolve, reject) => {
            if (isFile) {
                if (typeof window === "undefined" && http.default.http && http.default.https) {
                    url = new URL(url);
                    let body = headers.body;
                    let method = headers.method;
                    delete headers.body;
                    delete headers.method;
                    const options = {
                        hostname: url.hostname,
                        port: url.port,
                        path: url.pathname,
                        method: method,
                        headers: {
                            'Content-Type': (method === "POST" || method === "PUT") ? `application/json` : "text/plain",
                            ...headers,
                        }
                    };
                    let httpProtocol = url.protocol.startsWith("https") ? http.default.https : http.default.http;
                    const req = httpProtocol.request(options, (res: any) => {
                        res.setEncoding('utf8');
                        let data: string;
                        res.on('data', (chunk: string) => {
                            data = chunk;
                        });
                        res.on('end', () => {
                            let body: BodyInit = data;
                            let response = new Response(body, {
                                status: res.statusCode,
                                statusText: res.statusMessage,
                                headers: convertHeaders(res.headers, url),
                            });
                            try {
                                if (res.statusCode) {
                                    const end = performance.now();
                                    if (defaults.controller || headers.timeout > 0) {
                                        defaults.abortControllers.delete(key);
                                    }
                                    if (defaults.postRequestHook !== null) {
                                        defaults.postRequestHook(response, resolve, reject)
                                    } else {
                                        responseInterceptor(start, end, response, headers, resolve, reject);
                                    }
                                }
                            } catch (error: any) {
                                errorInterceptor(error, url, reject);
                            }
                        });
                    });

                    req.on('error', (e: Error) => {
                        errorInterceptor(e, url, reject);
                    });
                    if (method === "POST" || method === "PUT") {
                        req.write(body);
                        req.end();
                    } else {
                        req.end()
                    }
                } else {
                    const xhr = new XMLHttpRequest();
                    let body = headers.body;
                    let method = headers.method;
                    delete headers.body;
                    delete headers.method;
                    xhr.open(method, url.toString(), true);
                    for (const [header, value] of Object.entries(headers)) {
                        xhr.setRequestHeader(header, value);
                    }

                    xhr.onload = function () {
                        let body: BodyInit = xhr.response;
                        let response = new Response(body, {
                            status: xhr.status,
                            statusText: xhr.statusText,
                            headers: parseHeaders(xhr.getAllResponseHeaders(), url),
                        });
                        const end = performance.now();
                        if (defaults.controller || headers.timeout > 0) {
                            if(isConcurrent){
                                defaults.allAbortControllers.delete(key);
                            }else{
                                defaults.abortControllers.delete(key);
                            }
                        }
                        if (defaults.postRequestHook !== null) {
                            defaults.postRequestHook(response, resolve, reject)
                        } else {
                            responseInterceptor(start, end, response, headers, resolve, reject);
                        }
                    };

                    xhr.onerror = function (e: any) {
                        errorInterceptor(e, url, reject);
                    };

                    xhr.send(body);
                }
            } else {
                fetch(req)
                    .then((data: Response) => {
                        const end = performance.now();
                        if (defaults.controller || headers.timeout > 0) {
                            if(isConcurrent){
                                defaults.allAbortControllers.delete(key);
                            }else{
                                defaults.abortControllers.delete(key);
                            }
                        }
                        if (defaults.postRequestHook !== null) {
                            defaults.postRequestHook(data, resolve, reject)
                        } else {
                            responseInterceptor(start, end, data, headers, resolve, reject);
                        }
                    }).catch((err: Error) => {
                        errorInterceptor(err, url, reject);
                    })
                    .catch((err: Error) => {
                        let errorObj: TypedJSONObject = {
                            "message": err.message
                        }
                        reject(errorObj)
                    })
            }
        })
    } else {
        return new Promise((resolve, reject) => {
            reject({
                "status": "failure",
                "message": errorMessage(isValidParams)
            })
        })
        // throw new ReasyError(errorMessage(isValidParams), 422);
    }
}

export function createRequest(url: string | URL, headers: TypedJSONObject) {
    return new Request(url, headers);
}

export function constructHeaders(method: string, headers: TypedJSONObject | FormData, body: TypedJSONObject, reasyInstace: requestType): TypedJSONObject {
    let res: TypedJSONObject = {
        ...headers,
        ...reasyInstace.getHeaders(),
        "method": method
    }
    if(body instanceof FormData){
        res.body = body
    }else{
        if (JSON.stringify(body) !== "{}") {
            res.body = JSON.stringify(body)
            res.headers = {...res.headers, "content-type" : "application/json"}
        }
    }
    return res;
}

export function convertHeaders(headers: any, url?: URL | string): HeadersInit {
    const convertedHeaders: HeadersInit = {};
    Object.entries(headers).forEach(([name, value]) => {
        if (typeof value === 'string') {
            convertedHeaders[name] = value;
        } else if (Array.isArray(value)) {
            convertedHeaders[name] = value.join(', ');
        }
    });
    if (url) {
        if (typeof url === "string") {
            convertedHeaders.url = url
        } else {
            convertedHeaders.url = url.href
        }
    }
    return convertedHeaders;
}

export function parseHeaders(headersStr: string, url: string | URL) {
    const headers: TypedJSONObject = {};
    const headerLines = headersStr.trim().split('\n');
    headerLines.forEach((line: any) => {
        const parts = line.split(':');
        const key = parts.shift().trim();
        const value = parts.join(':').trim();
        headers[key] = value;
    });
    return convertHeaders(headers, url);
}

// File Upload APIs
export function fileupload(url: string | URL = "", body: TypedJSONObject | FormData, headers: TypedJSONObject = {}, isConcurrent:boolean, instance: requestType) {
    url = validateURL(url, instance);
    headers = constructHeaders("POST", headers, body, instance);
    return sendRequest(url, headers, isConcurrent, true)
}

export function fileupdate(url: string | URL = "", body: TypedJSONObject, headers: TypedJSONObject = {}, isConcurrent:boolean, instance: requestType) {
    url = validateURL(url, instance);
    headers = constructHeaders("PUT", headers, body, instance);
    return sendRequest(url, headers, isConcurrent, true)
}

export function downloadFile(url: string | URL = "", headers: TypedJSONObject = {}, isConcurrent:boolean, instance: requestType) {
    url = validateURL(url, instance);
    headers = constructHeaders("GET", headers, {}, instance);
    return sendRequest(url, headers, isConcurrent, true)
}
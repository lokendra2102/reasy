import { abortSignal } from "../Utils/AbortController";
import { TypedJSONObject, defaults } from '../Defaults/defaults';
import { errorMessage, checkIfValidParams, checkIfValidJson, validateContentType, isValidUrl } from "../Utils/Validation";
import { ReasyError } from "../Error/ReasyError";
import http from 'http';

class requestHandler {

    private _URL: string | URL;
    private _headers: TypedJSONObject;

    constructor(URL?: string | URL, headers?: TypedJSONObject) {
        let validURL: URL | string | null = URL ? isValidUrl(URL) : "";
        this._URL = validURL ? (typeof validURL !== "string" ? validURL.href : validURL) : "";
        this._headers = !headers ? {} : headers;
    }

    getURL() {
        return this._URL;
    }

    getHeaders() {
        return this._headers;
    }

    setURL(URL: string | URL) {
        let validURL: URL | string | null = URL ? isValidUrl(URL) : "";
        this._URL = validURL ? (typeof validURL !== "string" ? validURL.href : validURL) : "";
    }

    setHeaders(headers: TypedJSONObject) {
        this._headers = !headers ? {} : headers;
    }

    private responseBodyHandler(data: Response, responseObj: TypedJSONObject, contentType: string, resolve: any, reject: any) {
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

    private responseInterceptor(start: number, end: number, data: Response, headers: TypedJSONObject, resolve: any, reject: any) {
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
                "url": data.url,
                "headers": headersJson
            }
        }
        if (data.status === 404) {
            responseObj.response.method = headers.method;
            reject(responseObj)
        }
        const contentType = headers.responseType ? headers.responseType : validateContentType(data.headers.get("content-type"));
        if (contentType) {
            this.responseBodyHandler(data, responseObj, contentType, resolve, reject);
        } else {
            responseObj.response.data = data.body
            resolve(responseObj)
        }
    }

    private errorInterceptor(err: Error, url: string | URL, reject: any) {
        let errorJson: TypedJSONObject = checkIfValidJson(JSON.stringify(err))
        let urls = new URL(url)
        if (JSON.stringify(errorJson) !== "{}") {
            if (errorJson["cause"]) {
                errorJson = errorJson["cause"]
            }
            errorJson = {
                ...errorJson,
                message: err.message,
                url: urls.origin + urls.pathname
            }
            reject(errorJson)
        } else {
            let errorObj = {
                "stackTrace": err.message,
                url: urls.origin + urls.pathname
            }
            reject(errorObj)
        }
    }

    private validateURL(url: string | URL) {
        if (!url && !this.getURL()) {
            throw new ReasyError("Do register a reasy instance or provide a URL in method scope", 401);
        }
        if (!url) {
            return this.getURL();
        }
        return this.getURL() ? this.getURL().toString() + url.toString() : url;
    }

    // Fires single HTTP/HTTPS requests
    private sendRequest(url: string | URL = "", headers: TypedJSONObject = {}, isFile = false) {
        const start = performance.now();
        headers = { ...defaults.headers, ...headers }
        if (defaults.domain) {
            url = typeof url === "string" && url[0] !== "/" ? "/" + url : url;
            url = defaults.domain.toString() + url;
        }
        if (headers.timeout != null && headers.timeout <= 0) {
            throw new ReasyError(errorMessage("TimeOut", true), 422);
        }
        let isValidParams: string = checkIfValidParams(url, headers)
        if (!isValidParams) {
            let key = Math.floor(Math.random() * 99999)
            if (defaults.controller || headers.timeout > 0) {
                let controller = abortSignal(headers.timeout > 0 ? headers.timeout : defaults.abortTime ? defaults.abortTime : -1, key)
                headers = {
                    ...headers,
                    ...defaults.headers,
                    signal: controller.signal
                }
            }

            let req = this.createRequest(url, headers);

            if (defaults.preRequestHook !== null) {
                req = defaults.preRequestHook(req)
            }

            return new Promise((resolve, reject) => {
                if (isFile) {
                    if (typeof window === "undefined") {
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
                        const req = http.request(options, (res) => {
                            res.setEncoding('utf8');
                            let data: string;;
                            res.on('data', (chunk) => {
                                if (res.statusCode?.toString().startsWith("20")) {
                                    data = chunk;
                                }
                            });
                            res.on('end', () => {
                                let body: BodyInit = JSON.stringify(data);
                                let response = new Response(body, {
                                    status: res.statusCode,
                                    statusText: res.statusMessage,
                                    headers: this.convertHeaders(res.headers),
                                });
                                try {
                                    if (res.statusCode) {
                                        if (res.statusCode > 400) {
                                            throw new ReasyError(res.statusMessage ? res.statusMessage : "Error while uploading file.", 500)
                                        } else {
                                            const end = performance.now();
                                            if (defaults.controller || headers.timeout > 0) {
                                                defaults.abortControllers.delete(key);
                                            }
                                            if (defaults.postRequestHook !== null) {
                                                defaults.postRequestHook(response, resolve, reject)
                                            } else {
                                                this.responseInterceptor(start, end, response, headers, resolve, reject);
                                            }
                                        }
                                    }
                                } catch (error: any) {
                                    this.errorInterceptor(error, url, reject);
                                }
                            });
                        });

                        req.on('error', (e: Error) => {
                            this.errorInterceptor(e, url, reject);
                        });
                        if(method === "POST" || method === "PUT"){
                            req.write(body);
                            req.end();
                        }else{
                            req.end()
                        }
                    } else {
                        let instance = this;
                        const xhr = new XMLHttpRequest();
                        let body = headers.body;
                        let method = headers.method;
                        delete headers.body;
                        delete headers.method;
                        xhr.open(method, url, true);
                        for (const [header, value] of Object.entries(headers)) {
                            xhr.setRequestHeader(header, value);
                        }

                        xhr.onload = function () {
                            let body: BodyInit = JSON.stringify(xhr.response);
                            let response = new Response(body, {
                                status: xhr.status,
                                statusText: xhr.statusText,
                                headers: instance.parseHeaders(xhr.getAllResponseHeaders()),
                            });
                            if (xhr.status <= 200) {
                                const end = performance.now();
                                if (defaults.controller || headers.timeout > 0) {
                                    defaults.abortControllers.delete(key);
                                }
                                if (defaults.postRequestHook !== null) {
                                    defaults.postRequestHook(response, resolve, reject)
                                } else {
                                    instance.responseInterceptor(start, end, response, headers, resolve, reject);
                                }
                            } else {
                                console.error('Failed to upload file');
                            }
                        };

                        xhr.onerror = function (e: any) {
                            instance.errorInterceptor(e, url, reject);
                        };

                        xhr.send(body);
                    }
                } else {
                    fetch(req)
                        .then((data: Response) => {
                            const end = performance.now();
                            if (defaults.controller || headers.timeout > 0) {
                                defaults.abortControllers.delete(key);
                            }
                            if (defaults.postRequestHook !== null) {
                                defaults.postRequestHook(data, resolve, reject)
                            } else {
                                this.responseInterceptor(start, end, data, headers, resolve, reject);
                            }
                        }).catch((err: Error) => {
                            this.errorInterceptor(err, url, reject);
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
            throw new ReasyError(errorMessage(isValidParams), 422);
        }
    }

    private createRequest(url: string | URL, headers: TypedJSONObject) {
        return new Request(url, headers);
    }

    instance(URL: string | URL, headers: TypedJSONObject) {
        return new requestHandler(URL, headers)
    }


    get(url: string | URL = "", headers: TypedJSONObject = {}) {
        url = this.validateURL(url);
        headers = this.constructHeaders("GET", headers, {});
        return this.sendRequest(url, headers)
    }

    post(url: string | URL = "", body: TypedJSONObject = {}, headers: TypedJSONObject = {}) {
        url = this.validateURL(url);
        headers = this.constructHeaders("POST", headers, body);
        return this.sendRequest(url, headers)
    }

    put(url: string | URL = "", body: TypedJSONObject = {}, headers: TypedJSONObject = {}) {
        url = this.validateURL(url);
        headers = this.constructHeaders("PUT", headers, body);
        return this.sendRequest(url, headers)
    }

    patch(url: string | URL = "", body: TypedJSONObject = {}, headers: TypedJSONObject = {}) {
        url = this.validateURL(url);
        headers = this.constructHeaders("PATCH", headers, body);
        return this.sendRequest(url, headers)
    }

    delete(url: string | URL = "", headers: TypedJSONObject = {}) {
        url = this.validateURL(url);
        headers = this.constructHeaders("DELETE", headers, {});
        return this.sendRequest(url, headers)
    }

    private constructHeaders(method: string, headers: TypedJSONObject, body: TypedJSONObject, isFile: boolean = false): TypedJSONObject {
        let res: TypedJSONObject = {
            ...headers,
            ...this.getHeaders(),
            "method": method
        }
        if (!isFile) {
        }
        if (JSON.stringify(body) !== "{}") {
            res.body = JSON.stringify(body)
        }
        return res;
    }

    private convertHeaders(headers: http.IncomingHttpHeaders): HeadersInit {
        const convertedHeaders: HeadersInit = {};
        Object.entries(headers).forEach(([name, value]) => {
            if (typeof value === 'string') {
                convertedHeaders[name] = value;
            } else if (Array.isArray(value)) {
                convertedHeaders[name] = value.join(', ');
            }
        });
        return convertedHeaders;
    }

    private parseHeaders(headersStr: string) {
        const headers: TypedJSONObject = {};
        const headerLines = headersStr.trim().split('\n');
        headerLines.forEach((line: any) => {
          const parts = line.split(':');
          const key = parts.shift().trim();
          const value = parts.join(':').trim();
          headers[key] = value;
        });
        return this.convertHeaders(headers);
    }

    // Fires multiple HTTP/HTTPS requests
    async all(requestList: any) {
        if (!Array.isArray(requestList)) {
            throw new ReasyError(errorMessage("Request List"), 422);
        }
        return new Promise((resolve, reject) => {
            let responseData: Array<Response | TypedJSONObject> = [];
            Promise.all(requestList.map(async (ele, index) => {
                await ele.then((data: Response) => {
                    responseData.push(data)
                })
                    .catch((data: TypedJSONObject) => {
                        responseData.push(data);
                        defaults.abortControllers.forEach((ele) => {
                            ele.abort();
                        })
                        defaults.abortControllers.clear();
                        reject(responseData)
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

    file(url: string | URL = "", body: TypedJSONObject, headers: TypedJSONObject = {}){
        return {
            upload: () => this.fileupload(url, body, headers),
            update: () => this.fileupdate(url, body, headers),
            download: () => this.downloadFile(url, headers)
        }
    }
    // File Upload APIs
    private fileupload(url: string | URL = "", body: TypedJSONObject, headers: TypedJSONObject = {}) {
        url = this.validateURL(url);
        headers = this.constructHeaders("POST", headers, body, true);
        return this.sendRequest(url, headers, true)
    }

    private fileupdate(url: string | URL = "", body: TypedJSONObject, headers: TypedJSONObject = {}) {
        url = this.validateURL(url);
        headers = this.constructHeaders("PUT", headers, body, true);
        return this.sendRequest(url, headers, true)
    }

    private downloadFile(url: string | URL = "", headers: TypedJSONObject = {}){
        url = this.validateURL(url);
        headers = this.constructHeaders("GET", headers, {}, true);
        return this.sendRequest(url, headers, true)
    }
}

export const reasy: requestHandler = new requestHandler();
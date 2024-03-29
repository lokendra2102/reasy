import { abortSignal } from "../Utils/AbortController";
import { TypedJSONObject, defaults } from '../Defaults/defaults';
import { errorMessage, checkIfValidParams, checkIfValidJson } from "../Utils/Validation";
import { ReasyError } from "../Error/ReasyError";

class requestHandler {

    private URL: string | URL;
    private headers: TypedJSONObject;

    constructor(URL?: string | URL, headers?: TypedJSONObject) {
        this.URL = !URL ? "" : URL;
        this.headers = !headers ? {} : headers;
    }

    private responseBodyHandler(data: Response, responseObj: TypedJSONObject, contentType: string, resolve: any, reject: any) {
        try {
            switch (contentType) {
                case "json":
                    data.json().then(json => {
                        responseObj.response.data = json;
                        resolve(responseObj);
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
        if(data.status === 404){
            responseObj.response.method = headers.method;
            reject(responseObj)
        }
        const contentType = headers.responseType ? headers.responseType : "json";
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
    }

    private validateURL(url: string | URL) {
        if (!url && !this.URL) {
            throw new ReasyError("Do register a reasy instance or provide a URL in method scope", 401);
        }
        if (!url) {
            return url = this.URL;
        }
        return url;
    }

    // Fires single HTTP/HTTPS requests
    private sendRequest(url: string | URL = "", headers: TypedJSONObject = {}) {
        const start = performance.now();
        headers = { ...defaults.headers, ...headers }
        if (defaults.domain) {
            url = defaults.domain.toString() + url;
        }
        if (headers.timeout != null && headers.timeout <= 0) {
            throw new ReasyError(errorMessage("TimeOut", true), 422);
        }
        console.log(url);
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
        headers = {
            ...headers,
            ...this.headers,
            "method": "GET"
        }
        return this.sendRequest(url, headers)
    }

    post(url: string | URL = "", body: TypedJSONObject = {}, headers: TypedJSONObject = {}) {
        url = this.validateURL(url);
        headers = {
            ...headers,
            ...this.headers,
            "method": "POST",
            "body" : JSON.stringify(body)
        }
        return this.sendRequest(url, headers)
    }

    put(url: string | URL = "", body: TypedJSONObject = {}, headers: TypedJSONObject = {}) {
        url = this.validateURL(url);
        headers = {
            ...headers,
            ...this.headers,
            "method": "PUT",
            "body" : JSON.stringify(body)
        }
        return this.sendRequest(url, headers)
    }

    patch(url: string | URL = "", body: TypedJSONObject = {}, headers: TypedJSONObject = {}) {
        url = this.validateURL(url);
        headers = {
            ...headers,
            ...this.headers,
            "method": "PATCH",
            "body" : JSON.stringify(body)
        }
        return this.sendRequest(url, headers)
    }

    delete(url: string | URL = "", headers: TypedJSONObject = {}) {
        url = this.validateURL(url);
        headers = {
            ...headers,
            ...this.headers,
            "method": "DELETE"
        }
        return this.sendRequest(url, headers)
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
}

export const reasy: requestHandler = new requestHandler();


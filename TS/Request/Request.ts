import { TypedJSONObject, defaults } from '../Defaults/defaults';
import { errorMessage, isValidUrl } from "../Utils/Validation";
import { constructHeaders, downloadFile, fileupdate, fileupload, sendRequest, validateURL } from "./Request-util";

export class requestHandler {

    _URL: string | URL;
    _headers: TypedJSONObject;

    constructor(URL?: string | URL, headers?: TypedJSONObject) {
        let validURL: URL | string | null = URL ? isValidUrl(URL) : "";
        this._URL = validURL ? validURL : "";
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
        this._URL = validURL ? validURL : "";
    }

    setHeaders(headers: TypedJSONObject) {
        this._headers = !headers ? {} : headers;
    }

    instance(URL: string | URL, headers: TypedJSONObject) {
        return new requestHandler(URL, headers)
    }


    get(url: string | URL = "", headers: TypedJSONObject = {}, isConcurrent: boolean = false) {
        try {
            url = validateURL(url, this);
            headers = constructHeaders("GET", headers, {}, this);
            return sendRequest(url, headers, isConcurrent)
        } catch (error: any) {
            return new Promise((resolve, reject) => {
                reject({
                    "status": "failure",
                    "message": error.message
                })
            })
        }
    }

    post(url: string | URL = "", body: TypedJSONObject = {}, headers: TypedJSONObject = {}, isConcurrent: boolean = false) {
        url = validateURL(url, this);
        headers = constructHeaders("POST", headers, body, this);
        return sendRequest(url, headers, isConcurrent)
    }

    put(url: string | URL = "", body: TypedJSONObject = {}, headers: TypedJSONObject = {}, isConcurrent: boolean = false) {
        url = validateURL(url,this);
        headers = constructHeaders("PUT", headers, body, this);
        return sendRequest(url, headers, isConcurrent)
    }

    patch(url: string | URL = "", body: TypedJSONObject = {}, headers: TypedJSONObject = {}, isConcurrent: boolean = false) {
        url = validateURL(url, this);
        headers = constructHeaders("PATCH", headers, body, this);
        return sendRequest(url, headers, isConcurrent)
    }

    delete(url: string | URL = "", headers: TypedJSONObject = {}, isConcurrent: boolean = false) {
        url = validateURL(url, this);
        headers = constructHeaders("DELETE", headers, {}, this);
        return sendRequest(url, headers, isConcurrent)
    }

    // Fires multiple HTTP/HTTPS requests
    async all(requestList: any, cancelActiveOnError: boolean = true) {
        if (!Array.isArray(requestList)) {
            return new Promise((resolve, reject) => {
                reject({
                    "status": "failure",
                    "message": errorMessage("Request List")
                })
            })
            // throw new ReasyError(errorMessage("Request List"), 422);
        }
        return new Promise((resolve, reject) => {
            let responseData: Array<Response | TypedJSONObject> = [];
            Promise.all(requestList.map(async (ele, index) => {
                await ele.then((data: Response) => {
                    responseData.push(data)
                })
                    .catch((data: TypedJSONObject) => {
                        responseData.push(data);
                        if(cancelActiveOnError){
                            defaults.allAbortControllers.forEach((ele) => {
                                ele.abort();
                            })
                            defaults.allAbortControllers.clear()
                        }
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

    file(url: string | URL = "", body: TypedJSONObject | FormData, headers: TypedJSONObject = {}, isConcurrent: boolean = false) {
        return {
            upload: () => fileupload(url, body, headers, isConcurrent, this),
            update: () => fileupdate(url, body, headers, isConcurrent, this),
            download: () => downloadFile(url, headers, isConcurrent, this)
        }
    }

    getInstance(){
        return this;
    }
}

export const reasy: requestHandler = new requestHandler();
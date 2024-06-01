import { isValidUrl, errorMessage, abortControllerNotRegisteredError } from "./Validation";
import { defaults } from '../Defaults/defaults';
import { ReasyError } from '../Error/ReasyError';

class registerGlobal {
    // Register Of Global Properties
    headers = (data: Array<any> | object) => {
        return new Promise((resolve, reject) => {
            if (!data || Array.isArray(data)) {
                reject({
                    "status" : "failure",
                    "message" : errorMessage("Headers")
                });
            } else {
                defaults.headers = { ...defaults.headers, ...data }
                resolve({
                    "status" : "success"
                });
            }
        })

    }

    domain = (data: string | null | URL) => {
        return new Promise((resolve, reject) => {
            data = data ? isValidUrl(data) : null;
            if (!data) {
                reject({
                    "status" : "failure",
                    "message" : errorMessage("Domain")
                })
            } else {
                defaults.domain = data;
                resolve({
                    "status" : "success"
                })
            }
        })

    }

    abortController = (abortTime: number = 0) => {
        return new Promise((resolve, reject) => {
            defaults.controller = true;
            defaults.abortTime = abortTime > 0 ? abortTime : false;
            resolve({
                "status" : "success"
            })
        })
    }
}

export const register = new registerGlobal();

class interceptorGlobal {
    postRequest = (data: any) => {
        return new Promise((resolve, reject) => {
            defaults.postRequestHook = data
            resolve({
                "status" : "success"
            })
        })
    }
    
    preRequest = (data: any) => {
        return new Promise((resolve, reject) => {
            defaults.preRequestHook = data
            resolve({
                "status" : "success"
            })
        })
    }
}

export const interceptor = new interceptorGlobal();

class eraseRegitser {
    domain = () => {
        return new Promise((resolve, reject) => {
            if (!defaults.domain) {
                reject({
                    "status" : "failure",
                    "message" : errorMessage("Default Domain")
                })
            }else{
                defaults.domain = ""
                resolve({
                    "status" : "success"
                })
            }
        })
    }
    
    headers = () => {
        return new Promise((resolve, reject) => {
            if (!defaults.headers) {
                reject({
                    "status" : "failure",
                    "message" : errorMessage("Default Headers")
                })
            }else{
                defaults.headers = {}
                resolve({
                    "status" : "success"
                })
            }
        })

    }

    abortController = () => {
        return new Promise((resolve, reject) => {
            if (!defaults.controller) {
                reject({
                    "status" : "failure",
                    "message" : errorMessage("Abort Controller")
                })
            }else{
                defaults.controller = false
                defaults.abortTime = false
                resolve({
                    "status" : "success"
                })
            }
        })

    }
    
    postRequest = () => {
        return new Promise((resolve, reject) => {
            defaults.postRequestHook = null
            resolve({
                "status" : "success"
            })
        })
    }
    
    preRequest = () => {
        return new Promise((resolve, reject) => {
            defaults.preRequestHook = null
            resolve({
                "status" : "success"
            })
        })
    }

    abortMap = () => {
        return new Promise((resolve, reject) => {
            defaults.abortControllers.clear();
            defaults.allAbortControllers.clear();
            resolve({
                "status" : "success"
            })
        })
    }
}

export const erase = new eraseRegitser();

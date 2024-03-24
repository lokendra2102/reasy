import { isValidUrl, errorMessage, abortControllerNotRegisteredError } from "./Validation";
import { defaults } from '../Defaults/defaults';
import { ReasyError } from '../Error/ReasyError';

class registerGlobal {
    // Register Of Global Properties
    headers = (data: Array<any> | object) => {
        if (!data || Array.isArray(data)) {
            throw new ReasyError(errorMessage("Headers"), 422);
        } else {
            defaults.headers = { ...defaults.headers, ...data }
        }
    }

    domain = (data: string | URL) => {
        if (!isValidUrl(data)) {
            throw new ReasyError(errorMessage("Domain"), 422);
        } else {
            defaults.domain = data;
        }
    }
}

export const register = new registerGlobal();

class interceptorGlobal {
    postRequest = (data: any) => {
        defaults.postRequestHook = data
    }
    
    preRequest = (data: any) => {
        defaults.preRequestHook = data
    }
}

export const interceptor = new interceptorGlobal();

class eraseRegitser {
    domain = () => {
        if (!defaults.domain) {
            throw new ReasyError(abortControllerNotRegisteredError("Default Domain"), 404);
        }
        defaults.domain = ""
    }
    
    headers = () => {
        if (!defaults.headers) {
            throw new ReasyError(abortControllerNotRegisteredError("Default Headers"), 404);
        }
        defaults.headers = {}
    }

    removeAbortController = () => {
        if (!defaults.controller) {
            throw new ReasyError(abortControllerNotRegisteredError("Abort Controller"), 404);
        }
        defaults.controller = false
        defaults.abortTime = false
    }
    
    removePostRequestHook = () => {
        defaults.postRequestHook = null
    }
    
    removePreRequestHook = () => {
        defaults.preRequestHook = null
    }
}

export const erase = new eraseRegitser();

import { TypedJSONObject } from "../Defaults/defaults";

export const errorMessage = (data: string, isTimeout: boolean = false) => {
    let err = `Invalid value for the argument ${data}.`
    if (isTimeout) {
        err += " TimeOut should be greater than 0."
    }
    return err
};

export const abortControllerNotRegisteredError = (data: string) => `${data} is not registered. Register it to use this function`;

export const isValidUrl = (urlString: string | URL) => {
    if (!urlString) {
        return null;
    }
    try {
        const regex = /^(https?|ftp|file):\/\/[^\s/$.?#].[^\s]*$/i;
        urlString = urlString.toString()
        if (regex.test(urlString)) {
            return urlString.slice(-1) === "/" ? urlString.slice(0,-1) : urlString;
        } else {
            return null;
        }
    } catch (error) {
        return null
    }
}

export const encodeQP = (urlString: string) => {
    const queryString = urlString.split('?')[1];
    if (queryString) {
        const pairs = queryString.split('&');
        let qps: string = "";
        if(pairs){
            pairs.forEach((pair: string) => {
                const [key, value] = pair.split('=');
                qps += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
            });
            pairs[1] = qps;
        }
        return pairs.join("?");
    }
    return urlString;
}

export const isValidHeaders = (headers: string | Array<string> | object) => {
    if (typeof headers === "string" || Array.isArray(headers)) {
        return false;
    }
    return true
}

export const checkIfValidParams = (url: string | URL, headers: string | Array<string> | object) => {
    let validURL: URL | null | string = isValidUrl(url);
    
    let validHeaders = isValidHeaders(headers);
    if (!validURL && !validHeaders) {
        return "URL and Headers";
    } else if (!validURL) {
        return "URL";
    } else if (!validHeaders) {
        return "headers";
    } else {
        return "";
    }
}

export const checkIfValidJson = (data: string) => {
    try {
        return JSON.parse(data);
    } catch (e) {
        return false;
    }
}

export const validateContentType = (contentType: string | null) => {
    return contentType == null ? "" : contentType.includes("text") ? "text" : contentType.includes("json") ? "json" : "";
}
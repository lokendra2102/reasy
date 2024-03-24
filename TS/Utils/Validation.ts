export const errorMessage = (data : string, isTimeout : boolean = false) => {
    let err = `Invalid value for the argument ${data}.`
    if(isTimeout){
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
        urlString = new URL(urlString);
        return urlString.protocol === "http:" || urlString.protocol === "https:" ? urlString : null;
    } catch (error) {
        return null
    }
}

export const isValidHeaders = (headers: string | Array<string> | object) => {
    if (typeof headers === "string" || Array.isArray(headers)) {
        return false;
    }
    return true
}

export const checkIfValidParams = (url: string | URL, headers: string | Array<string> | object) => {
    let validURL : URL | null = isValidUrl(url);
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
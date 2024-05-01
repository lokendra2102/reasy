const errorMessage = (data, isTimeout = false) => {
    let err = `Invalid value for the argument ${data}.`
    if(isTimeout){
        err += " TimeOut should be greater than 0."
    }
    return err
};
const abortControllerNotRegisteredError = (data) => `${data} is not registered. Register it to use this function`;

const isValidUrl = (urlString) => {
    if (!urlString) {
        return false;
    }
    try {
        urlString = new URL(urlString);
        return urlString.protocol === "http:" || urlString.protocol === "https:" ? urlString : false;
    } catch (error) {
        return false
    }
}

const isValidHeaders = (headers) => {
    if (typeof headers === "string" || Array.isArray(headers)) {
        return false;
    }
    return true
}

const checkIfValidParams = (url, headers) => {
    url = isValidUrl(url);
    headers = isValidHeaders(headers);
    if (!url && !headers) {
        return "URL and Headers";
    } else if (!url) {
        return "URL";
    } else if (!headers) {
        return "headers";
    } else {
        return true;
    }
}

const checkIfValidJson = (data) => {
    try {
        return JSON.parse(data);
    } catch (e) {
        return false;
    }
}

module.exports = {
    isValidUrl, isValidHeaders, errorMessage,
    checkIfValidParams, abortControllerNotRegisteredError,
    checkIfValidJson
}
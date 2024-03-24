// Create Abort Controller
import { defaults } from '../Defaults/defaults';

export const abortSignal = (timeout = -1, num : number) => {
    const abort = new AbortController();
    defaults.headers = {
        ...defaults.headers,
        abort: abort
    }
    if (defaults.abortTime || timeout >= 0) {
        setTimeout(() => {
            abort.abort()
            defaults.abortControllers.delete(num);
            delete defaults.headers["abort"]
        }, timeout);
    }
    defaults.abortControllers.set(num, abort);

    return abort;
}

export const registerAbortController = (abortTime = 0) => {
    defaults.controller = true;
    defaults.abortTime = typeof abortTime === "number" && abortTime > 0 ? abortTime : false;
}
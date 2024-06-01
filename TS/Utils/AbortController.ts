// Create Abort Controller
import { defaults } from '../Defaults/defaults';

export const abortSignal = (timeout = -1, num : number, isConcurrent = false) => {
    const abort = new AbortController();
    defaults.headers = {
        ...defaults.headers,
        abort: abort
    }
    if (defaults.abortTime || timeout >= 0) {
        setTimeout(() => {
            abort.abort()
            if(isConcurrent){
                defaults.allAbortControllers.delete(num);
            }else{
                defaults.abortControllers.delete(num);
            }
            delete defaults.headers["abort"]
        }, timeout);
    }
    if(isConcurrent){
        defaults.allAbortControllers.set(num, abort);
    }else{
        defaults.abortControllers.set(num, abort);
    }

    return abort;
}
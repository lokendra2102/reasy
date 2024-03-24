import { reasy as request } from "./Request/Request";
import { erase, interceptor, register } from "./Utils/GlobalEventHandler";
import { ReasyError } from "./Error/ReasyError";
import { defaults } from "./Defaults/defaults";
import { 
    errorMessage, abortControllerNotRegisteredError, isValidHeaders, 
    checkIfValidJson, isValidUrl, checkIfValidParams
} from './Utils/Validation'
import { abortSignal, registerAbortController } from "./Utils/AbortController";

export const reasy = {
    request, erase, interceptor, register,
    ReasyError, defaults, errorMessage, abortControllerNotRegisteredError,
    isValidHeaders, checkIfValidJson, isValidUrl, checkIfValidParams,
    abortSignal, registerAbortController
}
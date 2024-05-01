import { reasy as request } from "./Request/Request";
import { erase, interceptor, register } from "./Utils/GlobalEventHandler";

export const reasy = {
    request, erase, interceptor, register
}
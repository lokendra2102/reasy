(()=>{var e={269:e=>{e.exports={headers:{},domain:"",controller:!1,abortTime:!1,currentAbort:null,preRequestHook:null,postRequestHook:null,abortControllers:[]}},151:e=>{class t extends Error{constructor(e){super(e),this.name="ReasyError",this.code=code,Error.captureStackTrace(this,this.constructor)}}e.exports=t},879:(e,t,r)=>{const o=r(151),{errorMessage:s,checkIfValidParams:a,checkIfValidJson:n}=r(395),l=r(269),{abortSignal:i}=r(248);e.exports={sendRequest:(e,t)=>{if(console.log(e),t={...l.headers,...t},l.domain||(e=l.domain+e),null!=t.timeout&&t.timeout<=0)throw new o(s("TimeOut",!0));let r=a(e,t);if("boolean"==typeof r){if(l.controller||t.timeout>0){l.abortControllers=[];let r=i(!0,t.timeout>0?t.timeout:l.abortTime?l.abortTime:-1);t={...t,...l.headers,signal:r.signal},l.abortControllers.push({abort:r,endpoint:e})}let r=((e,t)=>new Request(e,t))(e,t);return null!==l.preRequestHook&&(r=l.preRequestHook(r)),new Promise(((t,o)=>{fetch(r).then((e=>{if(null!==l.postRequestHook)l.postRequestHook(e,t,o);else if(l.abortControllers[e.url]=null,e.ok)t(e);else{const t={};for(const[r,o]of e.headers.entries())t[r]=o;let r={response:{status:e.status,statusText:e.statusText,url:e.url,headers:t}};const s=e.headers.get("Content-Type");s&&s.includes("application/json")?e.json().then((e=>{r.response.data=JSON.stringify(e),o(r)})).catch((e=>{o(r)})):e.text().then((e=>{r.response.data=e,o(r)})).catch((e=>{o(r)}))}})).catch((t=>{let r=n(JSON.stringify(t)),s=new URL(e);if(r)r.cause&&(r=r.cause),r={request:{...r,message:t.message,url:s.origin,path:s.pathname}},o(r);else{let e={request:{stackTrace:JSON.stringify(t),url:s.origin,path:s.pathname}};o(e)}})).catch((e=>{let t={message:e.message};o(t)}))}))}throw new o(s(r))},all:e=>{if(!Array.isArray(e))throw new o(s("Request List"));return new Promise(((t,r)=>{let o=[];Promise.all(e.map((async(e,t)=>{await e.then((e=>{o.push(e)})).catch((e=>{if(o.push(e),l.abortControllers){for(let t=0;t<l.abortControllers.length;t++)e.request&&null!==l.abortControllers[t].abort&&l.abortControllers[t].endpoint!==e.request.url&&l.abortControllers[t].abort.abort();l.abortControllers=[],r(o)}else r(o)}))}))).then((e=>{t(o)})).catch((e=>{r(o)}))})).then((e=>e)).catch((e=>e))}}},248:(e,t,r)=>{const o=r(269);e.exports={abortSignal:(e=!0,t=-1)=>(o.currentAbort=new AbortController,o.headers={...o.headers,abort:o.currentAbort},(o.abortTime||t>=0)&&setTimeout((()=>{o.currentAbort.abort(),delete o.headers.abort}),t),o.currentAbort),registerAbortController:(e=0)=>{o.controller=!0,o.abortTime="number"==typeof e&&e>0&&e}}},395:e=>{const t=e=>{if(!e)return!1;try{return("http:"===(e=new URL(e)).protocol||"https:"===e.protocol)&&e}catch(e){return!1}},r=e=>"string"!=typeof e&&!Array.isArray(e);e.exports={isValidUrl:t,isValidHeaders:r,errorMessage:(e,t=!1)=>{let r=`Invalid value for the argument ${e}.`;return t&&(r+=" TimeOut should be greater than 0."),r},checkIfValidParams:(e,o)=>(e=t(e),o=r(o),e||o?e?!!o||"headers":"URL":"URL and Headers"),abortControllerNotRegisteredError:e=>`${e} is not registered. Register it to use this function`,checkIfValidJson:e=>{try{return JSON.parse(e)}catch(e){return!1}}}}},t={};var r=function r(o){var s=t[o];if(void 0!==s)return s.exports;var a=t[o]={exports:{}};return e[o](a,a.exports,r),a.exports}(879);module.exports=r})();
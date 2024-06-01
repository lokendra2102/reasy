# 🚀 Reazi

#### Reazi - Requests made Easy, is a light-weight promise bases HTTP client library. reazi is made for javascript be it client or server side technologies (Isomorphic). It internally uses fetch API to make API calls over the network.

## 🌐  Features

- Promise based API requests.
- Uses **Fetch API**, which is modular and supported by native Javascript
- Interceptors to handle requests and response
- Global defaults to reduce bloat code
- Timeouts (Global Timeout and request level Timeout options are available) 
    
    `NOTE : Request level timeouts are given priority when both global timeout and request level timeout present`
- Automatic parsing of multiple response formats. ***(JSON, Text, Blob, ArrayBuffer)***. Special handling can be registered via hooks.

## ❗Methods Available

### API Calls ✨ ✨

### ***reazi.request*** instance can be used to make API calls to server/url using reazi.
- #### Instance
    - Instance() takes two parameters ***URL*** and ***headers***.
    - Instance can be create a request object and can be used to fire multiple API calls with same endpoint.
    - ***Example*** 
    \
    &nbsp;
    ```js
    const instance = reazi.request.instance(URL, {
        "header": //method name,
        // other request headers
    })
    instance.get()
    instance.post("", {
        "body" : //Data
    })
    /* can fire multiple calls */
    ```

- #### get()
    - Get() takes two parameters ***URL*** and ***headers***.
    - Result will be **Standard JSON Format**, Developer will have full control over it.
    - ***Example*** 
    \
    &nbsp;
    ```js
    reazi.request.get(URL, {
        // other request headers
    }, (true|false))
    ```
- #### post()
    - Post() takes three parameters ***URL***, ***body*** and ***headers***.
    - ***body*** should be JSON object. Form Data isn't supported as of now. Will include support in near future.
    - Result will be **Standard JSON Format**, Developer will have full control over it.
    - ***Example*** 
    \
    &nbsp;
    ```js
    reazi.request.post(URL, {
        "data" : //data
    }, {
        // request headers
    }, (true|false))
    ```
- #### put()
    - Put() takes three parameters ***URL***, ***body*** and ***headers***.
    - ***body*** should be JSON object. Form Data isn't supported as of now. Will include support in near future.
    - Result will be **Standard JSON Format**, Developer will have full control over it.
    - ***Example*** 
    \
    &nbsp;
    ```js
    reazi.request.put(URL, {
        "data" : //data
    }, {
        // request headers
    }, (true|false))
    ```
- #### patch()
    - Patch() takes three parameters ***URL***, ***body*** and ***headers***.
    - ***body*** should be JSON object. Form Data isn't supported as of now. Will include support in near future.
    - Result will be **Standard JSON Format**, Developer will have full control over it.
    - ***Example*** 
    \
    &nbsp;
    ```js
    reazi.request.patch(URL, {
        "data" : //data
    }, {
        // request headers
    }, (true|false))
    ```
- #### delete()
    - Delete() takes two parameters ***URL*** and ***headers***.
    - Result will be **Standard JSON Format**, Developer will have full control over it.
    - ***Example*** 
    \
    &nbsp;
    ```js
    reazi.request.delete(URL, {
        // other request headers
    }, (true|false))
    ```

- #### all([])
    - **all([], (true | false))** method is used to execute a series of API calls.
    - Unlike default **Promise.all()** where all the requests are executed even if any one of it fails, We will abort all the active requests which helps to improve the performance and reduce server overhead.

    - ***Example***
    \
    &nbsp;
    ```js
    reazi.request.all([
        reazi.request.get(URL, {
            // request headers
        }, true),
        reazi.request.get(URL, {
            // request headers
        }, true)
    ])
    ```
    > ***Note1*** : While making concurrent API calls it is mandatory to specify whether to execute remaining requests incase any one fails. By default it is set to false. You can override it passing second param.\
    > ***Note2*** : It is also mandatory to send **isConcurrent** param to let **reazi** know that current request is a concurrrent request. Because we store **abort** data in a Map, In any circumstances if it's misplaced it'll cause bloating unnecessary data. You can remove the same using ```reazi.erase.abortMap()```.



### File Upload ✨ ✨
- #### upload() - POST
    - upload() takes three parameters ***URL***, ***body*** and ***headers***.
    - Result will be **Standard JSON Format**, Developer will have full control over it or can also add responseType in header list so the response will be transformed that way.
    - ***Example*** 
    \
    &nbsp;
    ```js
    reazi.request.file(URL, body, {
        // request headers
    }, (true|false)).upload()
    ```

- #### update() - PUT
    - update() takes three parameters ***URL***, ***body*** and ***headers***.
    - Result will be **Standard JSON Format**, Developer will have full control over it or can also add responseType in header list so the response will be transformed that way.
    - ***Example*** 
    \
    &nbsp;
    ```js
    reazi.request.file(URL, body, {
        // request headers
    }, (true|false)).update()
    ```

- #### download() - GET
    - download() takes two parameters ***URL***, and ***headers***.
    - Result will be **Standard JSON Format**, Developer will have full control over it or can also add responseType in header list so the response will be transformed that way.
    - Body should be empty (2nd paramter) for download request.
    - ***Example*** 
    \
    &nbsp;
    ```js
    reazi.request.file(URL, {}, {
        // request headers
    }, (true|false)).download()
    ```

### Registering Globals ✨ ✨

- #### headers() 
    - reazi.register.headers() method can be used to add defualt headers which will be passed to all the requests fired using reazi.
    \
    &nbsp;
    ```js
    reazi.register.headers({
        'header name' : 'header value',
        // other headers
    })
    ```

- #### domain()
    - reazi.register.domain() method can be used to add defualt domain which will be appended to all the requests fired using reazi.
    \
    &nbsp;
    ```js
    reazi.register.domain(URL)
    ```

- #### registerAbortController() 
    - registerAbortController() method can be used to add global timeout for requests fired using reazi.
    - This method requires `abortTime` param to be passed along.
    \
    &nbsp;
    ```js
    reazi.register.abortController('{{Time in ms}}')
    ```

- #### postRequest() 
    - reazi.interceptor.postRequest() method is an interceptor which can be used to override the default response handling of reazi as per user expects it to be.
    
    ``This hook can modify only the response returned by the server. Unknown Error handling will not be modified such as aborting request.``
    \
    &nbsp;
    ```js
    reazi.interceptor.postRequest((response, success, failure) => {
        if (!response.ok) {
            // Failure Callback
            failure(response); //send data between parenthesis
        } else {
            // Success Callback
            success(response); //send data between parenthesis
        }
    })
    ```

- #### preRequest()
    - reazi.interceptor.preRequest() method is an interceptor which can be used to modify the request before making the call.
    - We will be using native [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. Refer the following article on how to modify [`Request`](https://developers.cloudflare.com/workers/examples/modify-request-property/).
    \
    &nbsp;
    ```js
    reazi.interceptor.preRequest((request) => {
        const newRequest = new Request(
            {modifiedChanges}, // Add changes need to be done before firing request.
            request
        );
        return newRequest
    })
    ```

### Removing Globals ✨ ✨

- #### headers() 
    - reazi.erase.headers() method can be used to remove any defualt headers present in globalHeaders object.
    \
    &nbsp;
    ```js
    reazi.erase.headers()
    ```

- #### domain()
    - reazi.erase.domain() method can be used to remove defualt domain added previously.
    \
    &nbsp;
    ```js
    reazi.erase.domain()
    ```

- #### postRequest() 
    - reazi.erase.postRequest() method is used to remove the post response hook interceptor and sets back to default response handling.
    \
    &nbsp;
    ```js
    reazi.erase.postRequest()
    ```

- #### preRequest()
    - reazi.erase.preRequest() method is used to remove the pre request hook interceptor and sets back to default request handling.
    \
    &nbsp;
    ```js
    reazi.erase.preRequest()
    ```

- #### abortController() 
    - reazi.erase.removeAbortController() method will remove global timeout for requests fired using reazi. Timeout still can be used in request level.
    \
    &nbsp;
    ```js
    reazi.erase.abortController()
    ```
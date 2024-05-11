# 🚀 Reasy

#### Reasy - Requests made Easy, is a light-weight promise bases HTTP client library. Reasy is made for javascript be it client or server side technologies (Isomorphic). It internally uses fetch API to make API calls over the network.

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

### ***reasy.request*** instance can be used to make API calls to server/url using reasy.
- #### Instance
    - Instance() takes two parameters ***URL*** and ***headers***.
    - Instance can be create a request object and can be used to fire multiple API calls with same endpoint.
    - ***Example*** 
    \
    &nbsp;
    ```js
    const instance = reasy.request.instance(URL, {
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
    reasy.request.get(URL, {
        // other request headers
    })
    ```
- #### post()
    - Post() takes three parameters ***URL***, ***body*** and ***headers***.
    - ***body*** should be JSON object. Form Data isn't supported as of now. Will include support in near future.
    - Result will be **Standard JSON Format**, Developer will have full control over it.
    - ***Example*** 
    \
    &nbsp;
    ```js
    reasy.request.post(URL, {
        "data" : //data
    }, {
        // request headers
    })
    ```
- #### put()
    - Put() takes three parameters ***URL***, ***body*** and ***headers***.
    - ***body*** should be JSON object. Form Data isn't supported as of now. Will include support in near future.
    - Result will be **Standard JSON Format**, Developer will have full control over it.
    - ***Example*** 
    \
    &nbsp;
    ```js
    reasy.request.put(URL, {
        "data" : //data
    }, {
        // request headers
    })
    ```
- #### patch()
    - Patch() takes three parameters ***URL***, ***body*** and ***headers***.
    - ***body*** should be JSON object. Form Data isn't supported as of now. Will include support in near future.
    - Result will be **Standard JSON Format**, Developer will have full control over it.
    - ***Example*** 
    \
    &nbsp;
    ```js
    reasy.request.patch(URL, {
        "data" : //data
    }, {
        // request headers
    })
    ```
- #### delete()
    - Delete() takes two parameters ***URL*** and ***headers***.
    - Result will be **Standard JSON Format**, Developer will have full control over it.
    - ***Example*** 
    \
    &nbsp;
    ```js
    reasy.request.delete(URL, {
        // other request headers
    })
    ```

- #### all([])
    - all([]) method is used to execute a series of API calls.
    - Unlike default **Promise.all()** where all the requests are executed even if any one of it fails, We will abort all the active requests which helps to improve the performance and reduce server overhead. 
    - ***Example***
    \
    &nbsp;
    ```js
    reasy.request.all([
        reasy.request.get(URL, {
            // request headers
        }),
        reasy.request.get(URL, {
            // request headers
        })
    ])
    ```
### File Upload ✨ ✨
- #### upload() - POST
    - upload() takes three parameters ***URL***, ***body*** and ***headers***.
    - Result will be **Standard JSON Format**, Developer will have full control over it or can also add responseType in header list so the response will be transformed that way.
    - ***Example*** 
    \
    &nbsp;
    ```js
    reasy.request.file(URL, body, {
        // request headers
    }).upload()
    ```

- #### update() - PUT
    - update() takes three parameters ***URL***, ***body*** and ***headers***.
    - Result will be **Standard JSON Format**, Developer will have full control over it or can also add responseType in header list so the response will be transformed that way.
    - ***Example*** 
    \
    &nbsp;
    ```js
    reasy.request.file(URL, body, {
        // request headers
    }).update()
    ```

- #### download() - GET
    - download() takes two parameters ***URL***, and ***headers***.
    - Result will be **Standard JSON Format**, Developer will have full control over it or can also add responseType in header list so the response will be transformed that way.
    - Body should be empty (2nd paramter) for download request.
    - ***Example*** 
    \
    &nbsp;
    ```js
    reasy.request.file(URL, {}, {
        // request headers
    }).download()
    ```

### Registering Globals ✨ ✨

- #### headers() 
    - reasy.register.headers() method can be used to add defualt headers which will be passed to all the requests fired using reasy.
    \
    &nbsp;
    ```js
    reasy.register.headers({
        'header name' : 'header value',
        // other headers
    })
    ```

- #### domain()
    - reasy.register.domain() method can be used to add defualt domain which will be appended to all the requests fired using reasy.
    \
    &nbsp;
    ```js
    reasy.register.domain(URL)
    ```

- #### registerAbortController() 
    - registerAbortController() method can be used to add global timeout for requests fired using reasy.
    - This method requires `abortTime` param to be passed along.
    \
    &nbsp;
    ```js
    reasy.register.abortController('{{Time in ms}}')
    ```

- #### postRequest() 
    - reasy.interceptor.postRequest() method is an interceptor which can be used to override the default response handling of reasy as per user expects it to be.
    
    ``This hook can modify only the response returned by the server. Unknown Error handling will not be modified such as aborting request.``
    \
    &nbsp;
    ```js
    reasy.interceptor.postRequest((response, success, failure) => {
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
    - reasy.interceptor.preRequest() method is an interceptor which can be used to modify the request before making the call.
    - We will be using native [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. Refer the following article on how to modify [`Request`](https://developers.cloudflare.com/workers/examples/modify-request-property/).
    \
    &nbsp;
    ```js
    reasy.interceptor.preRequest((request) => {
        const newRequest = new Request(
            {modifiedChanges}, // Add changes need to be done before firing request.
            request
        );
        return newRequest
    })
    ```

### Removing Globals ✨ ✨

- #### headers() 
    - reasy.erase.headers() method can be used to remove any defualt headers present in globalHeaders object.
    \
    &nbsp;
    ```js
    reasy.erase.headers()
    ```

- #### domain()
    - reasy.erase.domain() method can be used to remove defualt domain added previously.
    \
    &nbsp;
    ```js
    reasy.erase.domain()
    ```

- #### postRequest() 
    - reasy.erase.postRequest() method is used to remove the post response hook interceptor and sets back to default response handling.
    \
    &nbsp;
    ```js
    reasy.erase.postRequest()
    ```

- #### preRequest()
    - reasy.erase.preRequest() method is used to remove the pre request hook interceptor and sets back to default request handling.
    \
    &nbsp;
    ```js
    reasy.erase.preRequest()
    ```

- #### abortController() 
    - reasy.erase.removeAbortController() method will remove global timeout for requests fired using reasy. Timeout still can be used in request level.
    \
    &nbsp;
    ```js
    reasy.erase.abortController()
    ```

### 🗣️🗣️ &nbsp; For any issues kindly raise an issue or connect with me via LinkedIn.
### <p style="text-align:center">➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖</p>
## 📢  Will update Open Source Policy. 🔜
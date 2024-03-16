# Reasy

#### Reasy - Requests made Easy, is a light-weight promise bases HTTP client library. Reasy is made for javascript be it client or server side technologies (Isomorphic). It internally uses fetch API to make API calls over the network.

### Features

- Promise based API requests.
- Uses **Fetch API**, which is modular and supported by native Javascript
- Interceptors to handle requests and response
- Global defaults to reduce bloat code
- Timeouts (Global Timeout and request level Timeout options are available) 
    
    `NOTE : Request level timeouts are given priority when both global timeout and request level timeout present`
- Automatic parsing of JSON response

## Methods Available

### API Calls

- #### sendRequest()
    - sendRequest() method can be used to make API calls to server/url using reasy.
    - sendRequest() takes two parameters ***URL*** and ***headers***.
    - Result will be **Standard Response Format**, Developer will have full control over on success state.
    - ***Example*** 
    \
    &nbsp;
    ```js
    sendRequest(URL, {
        "method": //method name,
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
    all([
        sendRequest(URL, {
            "method": //method name,
            // other request headers
        }),
        sendRequest(URL, {
            "method": //method name,
            // other request headers
        }),
        sendRequest(URL, {
            "method": //method name,
            // other request headers
        })
    ])
    ```

### Registering Globals

- #### registerGlobalHeaders() 
    - registerGlobalHeaders() method can be used to add defualt headers which will be passed to all the requests fired using reasy.
    \
    &nbsp;
    ```js
    registerGlobalHeaders({
        'header name' : 'header value',
        // other headers
    })
    ```

- #### registerDefaultDomain()
    - registerDefaultDomain() method can be used to add defualt domain which will be appended to all the requests fired using reasy.
    \
    &nbsp;
    ```js
    registerDefaultDomain(URL)
    ```

- #### registerPostRequestHook() 
    - registerPostRequestHook() method is an interceptor which can be used to override the default response handling of reasy as per user expects it to be.
    
    ``This hook can modify only the response returned by the server. Unknown Error handling will not be modified such as aborting request.``
    \
    &nbsp;
    ```js
    registerPostRequestHook((response, success, failure) => {
        if (!response.ok) {
            // Failure Callback
            failure(response); //send data between parenthesis
        } else {
            // Success Callback
            success(response); //send data between parenthesis
        }
    })
    ```

- #### registerPreRequestHook()
    - registerPreRequestHook() method is an interceptor which can be used to modify the request before making the call.
    - We will be using native [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. Refer the following article on how to modify [`Request`](https://developers.cloudflare.com/workers/examples/modify-request-property/).
    \
    &nbsp;
    ```js
    registerPreRequestHook((request) => {
        const newRequest = new Request(
            {modifiedChanges}, // Add changes need to be done before firing request.
            request
        );
        return newRequest
    })
    ```

- #### registerAbortController() 
    - registerAbortController() method can be used to add global timeout for requests fired using reasy.
    - This method requires `abortTime` param to be passed along.
    \
    &nbsp;
    ```js
    registerAbortController('{{Time in ms}}')
    ```

### Removing Globals

- #### removeGlobalHeaders() 
    - removeGlobalHeaders() method can be used to remove any defualt headers present in globalHeaders object.
    \
    &nbsp;
    ```js
    removeAbortController()
    ```

- #### removeDefaultDomain()
    - removeDefaultDomain() method can be used to remove defualt domain added previously.
    \
    &nbsp;
    ```js
    removeDefaultDomain()
    ```

- #### removePostRequestHook() 
    - removePostRequestHook() method is used to remove the post response hook interceptor and sets back to default response handling.
    \
    &nbsp;
    ```js
    removePostRequestHook()
    ```

- #### removePreRequestHook()
    - removePreRequestHook() method is used to remove the pre request hook interceptor and sets back to default request handling.
    \
    &nbsp;
    ```js
    removePreRequestHook()
    ```

- #### removeAbortController() 
    - removeAbortController() method will remove global timeout for requests fired using reasy. Timeout still can be used in request level.
    \
    &nbsp;
    ```js
    removeAbortController()
    ```
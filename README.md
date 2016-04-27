# WebSocket JSON-RPC Client

Javascript library implements JSON-RPC protocol for WebSockets

## Installation

```javascript
npm install --save websocket-rpc-client
```

## Usage

### Connecting
```javascript
import WS from 'websocket-rpc-client';

var params = {
    url: 'ws://url_to_ws_server/',
    reconnectTimeout: 5000,
    reconnectCount: 2,
}

WS.start(params).then(function(){
    // on success
}).catch(function(){
    // on failure
})
```

### Send Data

```javascript
    // send a request of format  {id:1, method: "signIn", params: {"username":"username", "password":"password"}}
    WS.send("signIn", {
        "username":"username",
        "password":"password",
    }).then(function(resp) {
        // on success
    }).catch(function(e) {
        // on error
    })
```

### Subscribe on events
```javascript
WS.subscribe('onConnect', function(params){
    // ...
});
```

### Unsubscribe on events
```javascript
WS.unsubscribe('onConnect'[,function])
```
import WS from '../src/ws/ws.js';

WS.subscribe('onConnect', function(params){
    console.log('onConnect', params);
});
var url = 'wss://dev.hivecompany.ru/websocket';
WS.start({url: url})
    .then(function(e) {
        console.log('Success connected', e);
        WS.send("signIn", {
            "username":"ra",
            "password":"350db081a661525235354dd3e19b8c05",
            "locale":"ru_RU"
        }).then(function(resp) {
            debugger;
        }).catch(function(e) {
            debugger;
        })
    }).catch(function(e) {
        console.log('Failure connection', e);
    });
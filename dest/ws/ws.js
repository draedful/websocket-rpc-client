'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _pool = require('./pool');

var _pool2 = _interopRequireDefault(_pool);

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

var _packet = require('./packet');

var _packet2 = _interopRequireDefault(_packet);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isUndefined = require('lodash/isUndefined');

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

var _pako = require('pako');

var _pako2 = _interopRequireDefault(_pako);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WSStatus = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
};

exports.default = {
    ws: null,
    reconnectCount: 0,
    config: {
        reconnectTimeout: 2000,
        reconnectCount: 2,
        poolSize: 100,
        poolTimeout: 1000 // life time packet
    },
    start: function start(config) {
        var _this = this;

        if (config && config.url && !this.isOnline()) {
            (0, _merge2.default)(this.config, config);
            return new Promise(function (resolve, reject) {
                _this.connect(resolve, reject);
            });
        } else {
            return Promise.reject();
        }
    },
    connect: function connect(resolve, reject) {
        var _this2 = this;

        this.ws = new WebSocket(this.config.url);
        this.ws.binaryType = 'arraybuffer';

        this.ws.onopen = function (e) {
            _this2.reconnectTimeoutHandler = null;
            _this2.reconnectCount = 0;
            _this2.ws.onmessage = _this2.onMessage.bind(_this2);
            _pool2.default.init(100);
            resolve(e);
        };

        this.ws.onclose = function (e) {
            if (_this2.lostConnection && _this2.reconnectCount < _this2.config.reconnectCount) {
                _this2.reconnectCount++;
                _this2.reconnectTimeoutHandler = setTimeout(function () {
                    _this2.connect(resolve, reject);
                }, _this2.config.reconnectTimeout);
            } else {
                reject();
            }
        };

        this.ws.onerror = function (e) {
            _this2.lostConnection = true;
        };
    },
    isOnline: function isOnline() {

        if (this.ws) {
            switch (this.ws.readyState) {
                case WSStatus.OPEN:
                    return true;
                case WSStatus.CONNECTING:
                case WSStatus.CLOSED:
                case WSStatus.CLOSING:
                    return false;
            }
        }

        return false;
    },
    onMessage: function onMessage(data) {
        if (data.data instanceof ArrayBuffer) {
            this.ws.isBinary = true;
            //try {
            this.resolve(JSON.parse(_pako2.default.inflate(new Uint8Array(data.data), { to: 'string' })));
            /*} catch (e) {
                this.resolve({
                    error: e
                })
            }*/
        } else {
                this.resolve(JSON.parse(data.data));
            }
    },
    resolve: function resolve(response) {
        if (!(0, _isUndefined2.default)(response.id)) {
            _pool2.default.resolvePacket(response);
        } else {
            _events2.default.resolveEvent(response);
        }
    },
    send: function send(method, params) {
        var _this3 = this;

        return new Promise(function (resolve, reject) {
            var packet = _pool2.default.createPacket();
            packet.create(method, params, resolve, reject);

            if (_this3.isOnline() && (0, _isString2.default)(method) && (0, _isObject2.default)(params)) {

                var data = JSON.stringify(packet.getMessage());
                packet.sourceOut = data;
                if (_this3.isBinary) {
                    data = _pako2.default.deflate(data, { gzip: true }).buffer;
                }
                _this3.ws.send(data);
            } else {
                packet.reject('WS недостпупен');
            }
        });
    },
    subscribe: function subscribe(name, cb) {
        return _events2.default.subscribe(name, cb);
    },
    unsubscribe: function unsubscribe(name, cb) {
        return _events2.default.unsubscribe(name, cb);
    }
};
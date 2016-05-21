'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _defer = require('lodash/defer');

var _defer2 = _interopRequireDefault(_defer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/***
 * @namespace
 * @class
 *
 * @property {number} id - id message
 * @property {object} data - request data
 * @property {object|string} error - server error
 * @property {function} reject - reject promise
 * @propery {function} resolve - resolve promise
 * @propery {object} config - describe body
 * */

var WSPacket = function () {
    /**
     * @constructor
     * @param {number} id -  идентификатор сообщения
     * */

    function WSPacket(id) {
        _classCallCheck(this, WSPacket);

        this.id = id;
        this.message = {};
    }

    _createClass(WSPacket, [{
        key: 'create',
        value: function create(method, params, resolve, reject) {
            this.message.id = this.id;
            this.message.method = method;
            this.message.params = params;
            this.rejectCb = reject;
            this.resolveCb = resolve;
        }
    }, {
        key: 'getMessage',
        value: function getMessage() {
            return this.message;
        }
    }, {
        key: 'resolve',
        value: function resolve(data) {
            if ((0, _isFunction2.default)(this.resolveCb)) {
                (0, _defer2.default)(this.resolveCb, {
                    data: data
                });
            }
            return this;
        }
    }, {
        key: 'reject',
        value: function reject(error) {
            if ((0, _isFunction2.default)(this.rejectCb)) {
                (0, _defer2.default)(this.rejectCb, {
                    error: error
                });
            }
            return this;
        }
    }, {
        key: 'clear',
        value: function clear() {
            /*delete this.id;
            this.message = {};
            delete this.data;
            delete this.rejectCb;
            delete this.resolveCb;
            delete this.sourceOut;
            delete this.sourceIn;
            delete this.error;*/
        }
    }]);

    return WSPacket;
}();

exports.default = WSPacket;
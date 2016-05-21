'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defer = require('lodash/defer');

var _defer2 = _interopRequireDefault(_defer);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WSEvents = {
    pool: new Map(),

    /**
     * @param {string} name - channel name
     * @param {function} cb - callback
     *
     * @return {WSEvents}
     * */
    subscribe: function subscribe(name, cb) {

        var cbs = this.pool.get(name);

        if (!cbs) {
            this.pool.set(name, [cb]);
        } else {
            cbs.push(cb);
        }
        return this;
    },


    /**
     * @param {string} name - channel name
     * @param {function} cb - callback
     *
     * @return {WSEvents}
     * */
    unsubscribe: function unsubscribe(name, cb) {
        if (name) {
            var cbs = this.pool.get(name);

            if (cbs) {
                var index = cbs.indexOf(cb);
                if (index >= 0) {
                    cbs.slice(index, 1);
                }
            } else {
                this.pool.delete(name);
            }
        }
        return this;
    },


    /**
     * @private
     * @param {Object} resp - JSON-RPC event
     * 
     * */
    resolveEvent: function resolveEvent(resp) {
        var cbs = this.pool.get(resp.method);
        if (cbs) {
            (0, _each2.default)(cbs, function (cb) {
                (0, _defer2.default)(cb, resp.params);
            });
        }
    }
};

exports.default = WSEvents;
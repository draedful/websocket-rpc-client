'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _packet = require('./packet');

var _packet2 = _interopRequireDefault(_packet);

var _isFinite = require('lodash/isFinite');

var _isFinite2 = _interopRequireDefault(_isFinite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = {
    current: 1,
    pool: new Set(),
    packets: new Map(),
    index: 0,
    init: function init(size) {
        for (var i = 0; i < size; i++) {
            this.pool.add(new _packet2.default());
        }
    },
    getIndex: function getIndex() {
        return ++this.index;
    },
    clear: function clear() {
        this.pool.clear();
        this.packets.clear();
    },
    getLastPacket: function getLastPacket() {
        var packets = [].concat(_toConsumableArray(this.pool)),
            // SetObject to Array
        packet = packets[packets.length - 1];
        this.pool.delete(packet);
        return packet;
    },

    /**
     * @return {WSPacket} packet
     * */
    createPacket: function createPacket() {
        var packet = null,
            index = this.getIndex();
        if (this.pool.size) {
            packet = this.getLastPacket();
            packet.id = index;
        } else {
            packet = new _packet2.default(index);
        }

        this.packets.set(index, packet);

        return packet;
    },
    resolvePacket: function resolvePacket(resp) {
        var packet = this.packets.get(resp.id);
        if (packet && packet instanceof _packet2.default) {
            packet.sourceIn = resp.sourceIn;
            if (resp.error) {
                packet.reject(resp.error);
            } else {
                packet.resolve(resp.result);
            }
            packet.clear();
            this.packets.delete(resp.id);
            this.pool.add(packet);
        }
    }
};
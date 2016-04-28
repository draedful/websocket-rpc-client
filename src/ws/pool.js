import WSPacket from './packet';
import isFinite from 'lodash/isFinite';

export default {
    current: 1,
    pool: new Set(),
    packets: new Map(),
    index: 0,
    init(size) {
        for(var i = 0; i < size; i++) {
            this.pool.add(new WSPacket());
        }
    },
    getIndex() {
        return ++this.index;
    },
    clear() {
        this.pool.clear();
        this.packets.clear();
    },
    getLastPacket() {
        var packets = [...this.pool], // SetObject to Array
            packet = packets[packets.length - 1];
        this.pool.delete(packet);
        return packet;
    },
    /**
     * @return {WSPacket} packet
     * */
    createPacket() {
        var packet = null,
            index = this.getIndex();
        if(this.pool.size) {
            packet = this.getLastPacket();
            packet.id = index;
        } else {
            packet = new WSPacket(index);
        }

        this.packets.set(index, packet);

        return packet;
    },

    resolvePacket(resp) {
        var packet = this.packets.get(resp.id);
        if (packet && packet instanceof WSPacket) {
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
}
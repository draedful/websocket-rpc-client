import WSPacket from './packet';

export default {
    count: 1,
    pool: new Map(),

    /**
     * @return {WSPacket} packet
     * */
    createPacket() {
        var index = this.count++,
            packet = new WSPacket(index);

        this.pool.set(index, packet);

        return packet;
    },

    resolvePacket(resp) {
        var packet = this.pool.get(resp.id);
        if (packet instanceof WSPacket) {
            packet.sourceIn = resp.sourceIn;
            if (resp.error) {
                packet.reject(resp.error);
            } else {
                packet.resolve(resp.result);
            }
            this.pool.delete(resp.id);
        }
    }
}
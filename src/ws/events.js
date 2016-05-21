import defer from 'lodash/defer';
import each from 'lodash/each';


var WSEvents = {
    pool: new Map(),

    /**
     * @param {string} name - channel name
     * @param {function} cb - callback
     *
     * @return {WSEvents}
     * */
    subscribe(name, cb) {

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
    unsubscribe(name, cb) {
        if(name) {
            var cbs = this.pool.get(name);

            if (cbs) {
                var index = cbs.indexOf(cb);
                if(index >= 0) {
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
    resolveEvent(resp) {
        var cbs = this.pool.get(resp.method);
        if(cbs) {
            each(cbs, function(cb) {
                defer(cb, resp.params);
            })
        }
    }
}


export default WSEvents
import defer from 'lodash/defer';
import each from 'lodash/each';


var WSEvents = {
    pool: new Map(),

    subscribe(name, cb) {

        var cbs = this.pool.get(name);

        if (!cbs) {
            this.pool.set(name, [cb]);
        } else {
            cbs.push(cb);
        }
    },

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

    },

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
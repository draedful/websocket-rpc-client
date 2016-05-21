
import isFunction from 'lodash/isFunction';
import defer from 'lodash/defer';

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
export default class WSPacket {
    /**
     * @constructor
     * @param {number} id -  идентификатор сообщения
     * */
    constructor(id) {
        this.id = id;
        this.message = {}
    }

    create(method, params, resolve, reject) {
        this.message.id = this.id;
        this.message.method = method;
        this.message.params = params;
        this.rejectCb = reject;
        this.resolveCb = resolve;
    }

    getMessage() {
        return this.message;
    }

    resolve(data) {
        if(isFunction(this.resolveCb)) {
            defer(this.resolveCb, {
                data: data
            });
        }
        return this;
    }

    reject(error) {
        if(isFunction(this.rejectCb )) {
            defer(this.rejectCb, {
                error: error
            });
        }
        return this;
    }

    clear() {
        /*delete this.id;
        this.message = {};
        delete this.data;
        delete this.rejectCb;
        delete this.resolveCb;
        delete this.sourceOut;
        delete this.sourceIn;
        delete this.error;*/
    }
}

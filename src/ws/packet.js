
import isFunction from 'lodash/isFunction';

/***
 * @namespace
 * @class
 * @classdesc Описывает пакет запроса. Определяет методы для резолва вызова, тип получаемых данных и описание ошибки
 *
 * @property {number} id - идентификатор сообщения
 * @property {object} data - данные полученные в результате запроса
 * @property {object|string} error - серверная ошибка
 * @property {function} reject - метод промиса
 * @propery {function} resolve - метод промиса
 * @propery {object} config - описание тела запроса
 * */
export default (function(){
    class WSPacket {
        /**
         * @constructor
         * @param {number} id -  идентификатор сообщения
         * */
        constructor(id) {
            this.id = id;
            this.config = {}
        }

        setConfig(config) {
            this.config = config || {};
        }

        getConfig() {
            return this.config;
        }

        setMessage(method, params) {
            var config = this.getConfig();
            config.id = this.id;
            config.method = method;
            config.params = params;
            this.sourceOut = JSON.stringify(config);
            return this;
        }

        getMessage() {
            return this.getConfig();
        }

        /**
         *
         * */
        setResolve(resolve) {
            this.resolveDefer = resolve;
            return this;
        }

        setReject(reject) {
            this.rejectDefer = reject;
        }

        resolve(data) {
            if(isFunction(this.resolveDefer)) {
                this.data = data;
                this.resolveDefer(this);
                delete this.rejectDefer;
                delete this.resolveDefer;
            }
            return this;
        }

        reject(error) {
            this.error = error;
            if(isFunction(this.rejectDefer )) {
                this.rejectDefer(this);
            }
            delete this.rejectDefer;
            delete this.resolveDefer;
            return this;
        }

        setData(data) {
            this.data = data;
            return this;
        }

        getData() {
            return this.data;
        }

        isError() {
            return !!this.error;
        }

        getError() {
            return this.error;
        }

        setError(error) {
            this.error = error;
            return this;
        }
    }

    return WSPacket;
})()


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
                this.resolveCb({
                    data: data
                });
            }
            return this;
        }

        reject(error) {
            if(isFunction(this.rejectCb )) {
                this.rejectCb({
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

    return WSPacket;
})()

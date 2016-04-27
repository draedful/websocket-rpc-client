import WSPool from './pool';
import WSEvents from './events';
import WSPacket from './packet';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import isObject from 'lodash/isObject';
import merge from 'lodash/merge';
import pako from 'pako';

var WSStatus = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
};


export default {
    ws: null,
    reconnectCount: 0,
    config: {
        reconnectTimeout: 2000,
        reconnectCount: 2
    },
    start(config) {
        if (config && config.url && !this.isOnline()) {
            merge(this.config, config);
            return new Promise((resolve, reject) => {
                this.connect(resolve, reject);
            })

        } else {
            return Promise.reject();
        }
    },

    connect(resolve, reject) {
        this.ws = new WebSocket(this.config.url);
        this.ws.binaryType = 'arraybuffer';

        this.ws.onopen = (e) => {
            this.reconnectTimeoutHandler = null;
            this.reconnectCount = 0;
            this.ws.onmessage = this.onMessage.bind(this);
            resolve(e);
        };

        this.ws.onclose = (e) => {
            if (this.lostConnection && this.reconnectCount < this.config.reconnectCount) {
                this.reconnectCount++;
                this.reconnectTimeoutHandler = setTimeout(() => {
                    this.connect(resolve, reject);
                }, this.config.reconnectTimeout);

            } else {
                reject();
            }
        };

        this.ws.onerror = (e) => {
            this.lostConnection = true;
        };


    },

    isOnline() {

        if (this.ws) {
            switch (this.ws.readyState) {
                case WSStatus.OPEN:
                    return true;
                case WSStatus.CONNECTING:
                case WSStatus.CLOSED:
                case WSStatus.CLOSING:
                    return false;
            }
        }

        return false;
    },

    onMessage(data) {
        /**
         * При получении сообщения нам нужно распарсить сообщение
         * */
        var response = null;
        if (data.data instanceof ArrayBuffer) {
            this.ws.isBinary = true;
            try {
                var sourceIn = pako.inflate(new Uint8Array(data.data), {to: 'string'});
                response = JSON.parse(sourceIn);
                response.sourceIn = sourceIn;
            } catch (e) {
                response = {
                    error: e
                }
            }
        } else {
            response = JSON.parse(data.data);
            response.sourceIn = data.data;
        }

        /**
         * Если сообщение не имеет идентификатора -
         * значит сообщение пришло не в результате запроса, т.к БЕ всегда возвращает идентификатор запроса
         * значит это событие.
         *
         * */

        if (!isUndefined(response.id)) {
            WSPool.resolvePacket(response);
        } else {
            WSEvents.resolveEvent(response);
        }

    },

    send(method, params) {
        return new Promise((resolve, reject) => {
            var packet = WSPool.createPacket();
            packet.setMessage(method, params);

            if (this.isOnline() && isString(method) && isObject(params)) {
                // Добавляем пакет в пулл

                // устанавливаем методы для резолва собятия

                packet
                    .setResolve(resolve)
                    .setReject(reject);

                // отправляем сообщение
                this.ws.send(packet);

                var data = JSON.stringify(packet.getMessage());
                if (this.isBinary) {
                    data = pako.deflate(data, {gzip: true}).buffer;
                }
                this.ws.send(data);

            } else {
                packet.setError('WS недостпупен');
                reject(packet);
            }

        });
    },

    subscribe(name, cb) {
        return WSEvents.subscribe(name, cb);
    },

    unsubscribe(name, cb) {
        return WSEvents.unsubscribe(name, cb);
    }


}
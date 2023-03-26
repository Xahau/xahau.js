"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class WSWrapper extends events_1.EventEmitter {
    constructor(url, _protocols, _websocketOptions) {
        super();
        this.setMaxListeners(Infinity);
        this.ws = new WebSocket(url);
        this.ws.onclose = (closeEvent) => {
            let reason;
            if (closeEvent.reason) {
                const enc = new TextEncoder();
                reason = enc.encode(closeEvent.reason);
            }
            this.emit('close', closeEvent.code, reason);
        };
        this.ws.onopen = () => {
            this.emit('open');
        };
        this.ws.onerror = (error) => {
            this.emit('error', error);
        };
        this.ws.onmessage = (message) => {
            this.emit('message', message.data);
        };
    }
    get readyState() {
        return this.ws.readyState;
    }
    close(code, reason) {
        if (this.readyState === 1) {
            this.ws.close(code, reason);
        }
    }
    send(message) {
        this.ws.send(message);
    }
}
exports.default = WSWrapper;
WSWrapper.CONNECTING = 0;
WSWrapper.OPEN = 1;
WSWrapper.CLOSING = 2;
WSWrapper.CLOSED = 3;
//# sourceMappingURL=WSWrapper.js.map
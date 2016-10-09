/**
 * Created by zongwen1 on 16-10-8.
 */
( function ( ) {
    var _this = null;
    VrSocket = function () {
        console.log("VrSocket");
        _this = this;

        this.WORKER_MSG_TYPE = {INIT:1, SEND:2};
        this.WS_MSG_TYPE = {ONMESSAGE: 1, ONOPEN: 2, ONCLOSE: 3};
    };

    VrSocket.prototype = {
        constructor: VrSocket,

        init_ws: function (ws_url) {
            this.ws = new WebSocket(ws_url);
            this.ws.onmessage = this.ws_onmessage;
            this.ws.onopen = this.ws_onopen;
            this.ws.onclose = this.ws_onclose;
        },

        send: function (msg) {
            if (typeof msg != "string") {
                msg = JSON.stringify(msg);
            }
            this.ws.send(msg);
        },

        ws_onmessage: function (event) {
            var msg = {
                type: this.WS_MSG_TYPE.ONMESSAGE,
                data: event.data
            };
            this.worker_send(msg);
        },

        ws_onopen: function (event) {
            var msg = {
                type: this.WS_MSG_TYPE.ONOPEN,
                data: event.data
            };
            this.worker_send(msg);
        },

        ws_onclose: function (event) {
            var msg = {
                type: this.WS_MSG_TYPE.ONCLOSE,
                data: event.data
            };
            this.worker_send(msg);
        },

        worker_onmessage: function (event) {
            switch (event.data.type) {
                case _this.WORKER_MSG_TYPE.INIT:
                    _this.init_ws(event.data.data.ws_url);
                    break;
                case _this.WORKER_MSG_TYPE.SEND:
                    _this.ws_send(event.data.data);
                    break;
            }
        },

        worker_send: function (msg) {
            postMessage(msg);
        },

        ws_send: function (msg) {
            this.ws.send(msg);
        }

    };

    var ws = new VrSocket();
    onmessage = ws.worker_onmessage;

}() );
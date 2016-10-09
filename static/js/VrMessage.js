/**
 * Created by zongwen1 on 16-10-8.
 */
( function ( ) {
    var _this = null;
    VrMessage = function (worker_js, ws_url, onmessage) {
        console.log("VrMessage");
        _this = this;

        this.WORKER_MSG_TYPE = {INIT:1, SEND:2};
        this.WS_MSG_TYPE = {ONMESSAGE: 1, ONOPEN: 2, ONCLOSE: 3};
        //this.MSG_TYPE = {VIDEO: 1,MENU: 2, ITEM: 3, MUSIC: 4, UID: 5, DELITEM: 6, HEADMENU: 7, TIPS: 8, RANK: 9};
        this.MSG_TYPE = {GIFT: 1};
        this.onmessage = onmessage;
        this.init_worker(worker_js, ws_url);
    };

    VrMessage.prototype = {
        constructor: VrMessage,

        start: function () {

        },

        stop: function () {

        },

        send: function (data) {
            var msg = {
                type: this.WORKER_MSG_TYPE.SEND,
                data: data
            };
            this.worker.worker.postMessage(msg);
        },

        send_gift: function (user) {
            var msg = {
                type: this.MSG_TYPE.GIFT,
                data: {
                    uid: user.uid
                }
            };
            this.send(msg);
        },

        worker_onmessage: function (event) {
            switch (event.data.type) {
                case _this.WS_MSG_TYPE.ONMESSAGE:
                    _this.onmessage(event.data.data);
                    break;
                case _this.WS_MSG_TYPE.ONOPEN:

                    break;
                case _this.WS_MSG_TYPE.ONCLOSE:

                    break;
            }
        },

        init_worker: function (worker_js, ws_url) {

            this.worker_js = worker_js;
            this.worker = new VrWorker(worker_js,_this.worker_onmessage,_this.start,_this.stop);

            //初始化websocket
            var msg = {
                type: this.WORKER_MSG_TYPE.INIT,
                data: {
                    ws_url: ws_url
                }
            };
            this.worker.worker.postMessage( msg );
        }
    };

}() );
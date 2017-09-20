/**
 * Created by zongwen1 on 16-10-8.
 */
( function ( ) {
    var _this = null;
    VrWorker = function (worker_js,onmessage,onstart,onstop,single) {
        console.log("VrWorker: "+worker_js);

        this.onstart = onstart;
        this.onstop = onstop;
        this.worker_id = VrWorker.prototype.worker_num++;
        this.worker_js = worker_js;
        this.worker = new Worker(worker_js);
        this.worker.onmessage = onmessage;
        this.postMessage = this.worker.postMessage;

        if (typeof single == "undefined") {
            single = false;
        }
        this.single = single;

        this.workers.push(this);
        onstop();
    };

    VrWorker.prototype = {
        constructor: VrWorker,
        worker_num: 0,
        workers: [],
        cur_worker: null,

        start: function () {
            if (this.single) {
                this.close_other_single();
            }
            this.cur_worker = this;
            this.onstart();
        },

        close_other_single: function () {
            for(var i = 0; i < this.worker_num; i++) {
                if (this.workers[i].single && this.workers[i].worker_id != this.worker_id) {
                    this.workers[i].stop();
                }
            }
        },

        stop: function () {
            this.onstop();
        },


    };
}() );
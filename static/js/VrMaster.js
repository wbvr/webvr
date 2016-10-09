/**
 * Created by zongwen1 on 16-10-9.
 */
( function ( ) {
    var _this = null;
    VrMaster = function (ws) {
        console.log("VrMaster");
        _this = this;

        this.total_group = 2;

        this.ws = ws;
        ws.onmessage = this.onmessage;
        this.MSG_TYPE = {
            GIFT: 1,         //{type:1, data:{uid: 110, gid: 1, gift_type: 1}}
            ONLINE: 'userup',
            OFFLINE: 'userdown'
        };

    };

    VrMaster.prototype = {
        constructor: VrMaster,
        rank: [],   //  array('uid'=>array('score'=>2))
        grank: [],  //  array('gid'=>rank)
        users: [],

        onmessage: function (event) {
            var msg = JSON.parse(event.data);
            switch (msg.type) {
                case _this.MSG_TYPE.GIFT:
                    _this.rerank(msg.data.uid, 1);
                    break;
                case _this.MSG_TYPE.ONLINE:
                    _this.update_users(msg.data);
                    break;
                case _this.MSG_TYPE.OFFLINE:

                    break;
            }
        },

        update_users: function (data) {
            var gid = this.users.length % this.total_group;
            var uid = data + "";
            if (typeof this.users[uid] == "undefined") {
                this.users[uid] = {
                    uid: uid,
                    gid: gid
                };
            }
        },

        rerank: function (uid,gift_num) {
            if (typeof this.rank[uid] == "undefined") {
                this.rank[uid] = 0;
            }
            var gid = this.users[uid]['gid'];
            this.rank[uid]['score'] += gift_num;
            this.grank[gid][uid]['score'] += gift_num;
            this.rank.sort(function (a,b) {
                return a.score < b.score;
            });
            this.grank[gid].sort(function (a,b) {
                return a.score < b.score;
            });
            this.send_rerank_msg(this.rank);
            this.send_rerank_msg(this.grank);
        },

        send_rerank_msg: function (rank) {
            var msg = {
                type: this.MSG_TYPE.GIFT,
                data: rank
            };
            this.ws.send(msg);
        }
    };
}() );
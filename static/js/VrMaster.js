/**
 * Created by zongwen1 on 16-10-9.
 */
( function ( ) {
    var _this = null;
    VrMaster = function (ws) {
        console.log("VrMaster");
        _this = this;

        this.total_group = 2;
        this.user_num = 0;

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
            var gid = this.user_num % this.total_group;
            var uid = "u"+data;
            if (typeof this.users[uid] == "undefined") {
                this.users[uid] = {
                    uid: uid,
                    gid: gid
                };
                this.rank[uid] = {uid: uid, score: 0};
                if (typeof this.grank[gid] == "undefined") {
                    this.grank[gid] = [];
                }
                this.grank[gid][uid] = {uid: uid, score: 0};
                this.user_num++;
            }
        },

        rerank: function (uid,gift_num) {
            uid = "u"+uid;
            var gid = this.users[uid]['gid'];

            this.rank[uid]['score'] += gift_num;
            this.grank[gid][uid]['score'] += gift_num;
            this.rank.sort(function (a,b) {
                return a.score < b.score;
            });
            this.grank[gid].sort(function (a,b) {
                return a.score < b.score;
            });

            var tmp_rank = [];
            var x;
            for (x in this.rank) {
                tmp_rank[this.rank[x].uid] = this.rank[x];
            }
            this.rank = tmp_rank;

            var tmp_grank = [];
            for (x in this.grank[gid]) {
                tmp_grank[this.grank[gid][x].uid] = this.grank[gid][x];
            }
            this.grank[gid] = tmp_grank;

            this.send_rerank_msg(this.rank);
            this.send_rerank_msg(this.grank);
        },

        send_rerank_msg: function (rank) {
            var data = {
                type: this.MSG_TYPE.GIFT,
                data: rank
            };
            var msg = JSON.stringify(data);
            this.ws.send(msg);
        }
    };
}() );
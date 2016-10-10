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
            GIFT: "gift",         //{type:"gift", data:{uid: 110, gift_type: "flower"}}
            ONLINE: 'userup',
            OFFLINE: 'userdown',
            RANK: 'rank'
        };

    };

    VrMaster.prototype = {
        constructor: VrMaster,
        rank: [],   //  {"type":"rank","data":[{"group_name":"total","group_data":[{"uid":"242","score":1}]}]}
        grank: [],  //  {"type":"rank","data":[{"group_name":0,"gid":0,"group_data":[{"uid":"242","score":1}]}]}
        users: [],

        onmessage: function (event) {
            var msg = JSON.parse(event.data);
            switch (msg.type) {
                case _this.MSG_TYPE.GIFT:
                    _this.ws_send(msg);
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
            var uid = data;
            if (typeof this.users[uid] == "undefined") {
                this.users[uid] = {
                    uid: uid,
                    gid: gid
                };

                if (this.rank.length == 0) {
                    this.rank.push({group_name:"total",group_data:[]})
                }
                this.rank[0].group_data.push({uid: uid, score: 0});
                if (typeof this.grank[gid] == "undefined") {
                    this.grank.push({group_name:gid,gid: gid,group_data:[]});
                }

                this.user_num++;
            }
            this.send_rerank_msg(this.rank);
            this.send_rerank_msg(this.grank);
        },

        rerank: function (uid,gift_num) {
            var gid = this.users[uid]['gid'];

            var i;
            for (i= 0; i < this.rank[0].group_data.length; i++) {
                if (this.rank[0].group_data[i].uid == uid) {
                    this.rank[0].group_data[i].score += gift_num;
                    break;
                }
            }
            var group_data = [];
            for (i = 0; i < this.grank.length; i++) {
                if (gid == this.grank[i].gid) {
                    group_data = this.grank[i].group_data;
                }
            }
            var flag = false;
            for (i = 0; i < group_data.length; i++) {
                if (group_data[i].uid == uid) {
                    group_data[i].score += gift_num;
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                group_data.push({uid: uid, score: gift_num});
            }

            this.rank[0].group_data.sort(function (a,b) {
                return a.score < b.score;
            });
            group_data.sort(function (a,b) {
                return a.score < b.score;
            });

            this.send_rerank_msg(this.rank);
            this.send_rerank_msg(this.grank);
        },

        send_rerank_msg: function (rank) {
            var data = {
                type: this.MSG_TYPE.RANK,
                data: rank
            };
            var msg = JSON.stringify(data);
            console.log(msg);
            this.ws_send(msg);
        },

        ws_send: function (data) {
            var msg = JSON.stringify(data);
            this.ws.send(msg);
        }
    };
}() );
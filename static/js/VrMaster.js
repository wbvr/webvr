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
            OFFLINE: 'userdown',
            RANK: 'rank'
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
            var uid = data;
            if (typeof this.users[uid] == "undefined") {
                this.users[uid] = {
                    uid: uid,
                    gid: gid
                };

                if (this.rank.length == 0) {
                    this.rank.push({group_name:"total",group_data:[]})
                }
                this.rank.group_data.push({uid: uid, score: 0});
                if (typeof this.grank[gid] == "undefined") {
                    this.grank.push({group_name:gid,gid: gid,group_data:[]});
                }
                this.grank[gid].push({uid: uid, score: 0});

                this.user_num++;
            }
        },

        rerank: function (uid,gift_num) {
            var gid = this.users[uid]['gid'];

            var i;
            for (i= 0; i < this.rank.group_data.length; i++) {
                if (this.rank.group_data[i].uid == uid) {
                    this.rank.group_data[i].score += gift_num;
                    break;
                }
            }
            var group = [];
            for (i = 0; i < this.grank.length; i++) {
                if (gid == this.grank[i].gid) {
                    group = this.grank[i];
                }
            }
            for (i = 0; i < group.length; i++) {
                if (group[i].uid == uid) {
                    group[i].score += gift_num;
                    break;
                }
            }

            this.rank.group_data.sort(function (a,b) {
                return a.score < b.score;
            });
            group.sort(function (a,b) {
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
            this.ws.send(msg);
        }
    };
}() );
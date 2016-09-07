/**
 * Created by zongwen1 on 2016/8/28.
 */
( function ( THREE ) {
    THREE.EyeControls = function (camera) {
        console.log("EyeControls");
        this.camera = camera;
        this.objects = [];

        this.STATUS = {
            STATUS_SHOW: 1,
            STATUS_HIDEN: 2
        };
        this.status = this.STATUS.STATUS_SHOW;

        this.HOVER_STATUS = {
            STATUS_NOHOVE: 1,
            STATUS_HOVERING: 2
        };
        this.hover_status = this.HOVER_STATUS.STATUS_NOHOVE;

        this.intersects = null;
        this.last_hover_obj = null;

        this.spote = null;
        this.spote_l = null;
        this.spote_r = null;
        this.SPOTE_NUM = 17;
        this.spote_num = this.SPOTE_NUM;
        this.spote_speed = 300;
        this.show_spote();
        this.op_status = 0;

        this.point = new THREE.Vector2(0, 0);
        this.raycaster = new THREE.Raycaster();

    };
    
    THREE.EyeControls.prototype = {
        constructor: THREE.EyeControls,
        
        bind: function (object,callback) {
            var index = this.objects.indexOf(object);
            if (index == -1) {
                object.eye_callback = callback;
                this.objects.push(object);
            }
        },

        hover_over: function () {
            console.log("hover_over");
            //if (this.hover_status != this.HOVER_STATUS.STATUS_HOVERING) {
                this.hover_status = this.HOVER_STATUS.STATUS_HOVERING;
                if (this.spote) {
                    this.spoting();
                }
            //}
        },

        hover_out: function () {
            console.log("hover_out");
            this.hover_status = this.HOVER_STATUS.STATUS_NOHOVE;
            this.init_spote();
            this.op_status = 0;
        },
    
        unbind: function (object) {
            var index = this.objects.indexOf(object);
            if (index != -1) {
                this.objects.splice(index, 1);
            }
        },
        
        show: function () {
            this.show_spote();
        },
        
        remove: function () {
            this.remove_spote();
        },
    
        update: function () {
            if (this.status != this.STATUS.STATUS_SHOW) {
                return false;
            }

            this.raycaster.setFromCamera( this.point, this.camera );
            this.intersects = this.raycaster.intersectObjects( this.objects );
            if ( this.intersects.length > 0 ) {
                if (this.last_hover_obj != this.intersects[ 0 ].object) {
                    this.hover_out();
                }
                this.last_hover_obj = this.intersects[ 0 ].object;
                this.hover_over();
            } else {
                if (this.last_hover_obj) {
                    this.hover_out();
                    this.last_hover_obj = null;
                }
            }
        },

        init_spote: function () {
            if (this.spote) {
                this.spote.style.backgroundPositionX = 0;
            }
            if (this.spote_l) {
                this.spote_l.style.backgroundPositionX = 0;
            }
            if (this.spote_r) {
                this.spote_r.style.backgroundPositionX = 0;
            }

            this.spote_num = this.SPOTE_NUM;
        },

        play_spote: function () {
            if (this.spote) {
                this.spote.style.backgroundPositionX = parseInt(this.spote.style.backgroundPositionX) -20 + 'px';
            }
            if (this.spote_l) {
                this.spote_l.style.backgroundPositionX = parseInt(this.spote_l.style.backgroundPositionX) -20 + 'px';
            }
            if (this.spote_r) {
                this.spote_r.style.backgroundPositionX = parseInt(this.spote_r.style.backgroundPositionX) -20 + 'px';
            }
        },

        show_spote: function () {
            var div = document.createElement( 'div' );
            div.id = 'spote';
            div.style.position = 'absolute';
            div.style.backgroundPosition = '0 0';
            div.style.width = '20px';
            div.style.height = '20px';
            div.style.backgroundImage = 'url(static/img/cursor.png)';
            div.style.backgroundRepeat = 'no-repeat';
            div.style.backgroundSize = '340px 20px';
            div.style.left = '50%';
            div.style.marginLeft = '-10';
            div.style.top = '50%';
            div.style.marginTop = '-10';
            this.spote = div;
            document.body.appendChild(this.spote);
        },

        show_spote_l: function () {
            var div = document.createElement( 'div' );
            div.id = 'spote';
            div.style.position = 'absolute';
            div.style.backgroundPosition = '0 0';
            div.style.width = '20px';
            div.style.height = '20px';
            div.style.backgroundImage = 'url(static/img/cursor.png)';
            div.style.backgroundRepeat = 'no-repeat';
            div.style.backgroundSize = '340px 20px';
            div.style.left = '25%';
            div.style.marginLeft = '-10';
            div.style.top = '50%';
            div.style.marginTop = '-10';
            div.style.zIndex = '1';
            this.spote_l = div;
            return div;
        },

        show_spote_r: function () {
            var div = document.createElement( 'div' );
            div.id = 'spote';
            div.style.position = 'absolute';
            div.style.backgroundPosition = '0 0';
            div.style.width = '20px';
            div.style.height = '20px';
            div.style.backgroundImage = 'url(static/img/cursor.png)';
            div.style.backgroundRepeat = 'no-repeat';
            div.style.backgroundSize = '340px 20px';
            div.style.left = '75%';
            div.style.marginLeft = '-10';
            div.style.top = '50%';
            div.style.marginTop = '-10';
            div.style.zIndex = '1';
            this.spote_r = div;
            return div;
        },

        remove_spote: function () {
            if (this.spote) {
                document.removeChild(this.spote);
                this.spote = null;
            }
        },

        toString: function () {
            return 'THREE.EyeControls';
        },

        spoting: function () {
            if (this.hover_status == this.HOVER_STATUS.STATUS_HOVERING && --this.spote_num > 0) {
                this.play_spote();
                //TODO 传this有问题
                window.setTimeout(THREE.EyeControls.spoting, this.spote_speed);
            } else {
                if (this.spote_num == 0) {
                    console.log("EyeControls callbak");
                    if(this.op_status != 1){
                        this.op_status = 1;
                        this.last_hover_obj.eye_callback(this.last_hover_obj);
                    }
                }
                this.init_spote();
            }
        }


    };
}( THREE ) );
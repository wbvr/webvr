/**
 * Created by zongwen1 on 2016/8/29.
 */
( function ( THREE ) {
    THREE.VrMenu = function () {
        this.options = [];
        this.option_width = 50;
        this.option_height = 50;
        this.option_margin = 5;

        this.STATUS = {
            STATUS_SHOW: 1,
            STATUS_HIDDEN: 2
        };
        this.status = this.STATUS.STATUS_SHOW;
        
        this.menu_position = new THREE.Vector3(0,-120,-100);
    };

    THREE.VrMenu.prototype = {
        constructor: THREE.EyeControls,

        show: function (scene,eye_contrler) {
            this.options.forEach(function (e) {
                scene.add(e);
                if (typeof e.eye_callback != "undefined") {
                    eye_contrler.bind(e, e.eye_callback);
                }
            });
        },

        hide: function (scene,eye_contrler) {
            this.options.forEach(function (e) {
                if (typeof e.eye_callback != "undefined") {
                    eye_contrler.unbind(e);
                }
                scene.remove(e);
            });
        },

        move: function (x,y) {
            this.options.forEach(function (e) {
                e.position.x += x;
                e.position.y += y;
            });
        },

        add_option: function (scene, eye_contrler, pic,callback) {
            var plane = new THREE.PlaneGeometry( this.option_width, this.option_height );

            var texture = new THREE.TextureLoader().load( pic );
            var option = new THREE.Mesh( plane ,new THREE.MeshBasicMaterial({
                map: texture,
                //color: 0xff0000,
                transparent: true
                //opacity: 0.9
            }));

            option.position.x = this.menu_position.x + this.options.length * (this.option_width + this.option_margin);
            option.position.y = this.menu_position.y;
            option.position.z = this.menu_position.z;
            option.menu_index = this.options.length;
            console.log("add_option:",option.position);
            scene.add(option);
            if (typeof callback != "undefined") {
                eye_contrler.bind(option, callback);
            }
            this.options.push(option);
            return option;
        },

        remove_option: function (scene, eye_contrler, option) {
            var index = this.options.indexOf(option);
            if (index != -1) {
                this.options.splice(index, 1);
                scene.remove();
                if (typeof option.eye_callback != "undefined") {
                    eye_contrler.unbind(option);
                }
            }
        }
    };
}( THREE ) );

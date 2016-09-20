/**
 * Created by zongwen1 on 2016/8/29.
 */
( function ( THREE ) {
    THREE.VrMenu = function () {
        this.options = [];
        this.option_width = 50;
        this.option_height = 50;
        this.option_margin_angle = Math.PI/6;
        this.option_margin_x = 100;

        this.STATUS = {
            STATUS_SHOW: 1,
            STATUS_HIDDEN: 2
        };
        this.status = this.STATUS.STATUS_SHOW;

        this.move_speed = 5;

        this.cursor_up = null;
        this.cursor_down = null;
        this.cursor_left = null;
        this.cursor_right = null;
        this.cursor_height = 20;
        this.cursor_size = 15;

        this.rotate_index = 1;

        this.menu_position = new THREE.Vector3(0,-260,-340);
    };

    THREE.VrMenu.prototype = {
        constructor: THREE.EyeControls,

        show: function (scene,eye_contrler) {
            this.show_as_plane(scene,eye_contrler);
        },

        show_as_circle: function (s,eye_contrler) {
            var angle = (this.options.length - 1) / 2 * this.option_margin_angle;
            var e;
            for (var i = 0; i < this.options.length; i++) {
                e = this.options[i];
                console.log("angle: "+angle);
                e.position.applyEuler(new THREE.Euler(0,angle,0, "XYZ"));
                console.log("e.position: "+e.position);
                s.add(e);
                if (typeof e.eye_callback != "undefined") {
                    eye_contrler.bind(e, e.eye_callback);
                }
                angle -= this.option_margin_angle;
            }
        },

        show_as_plane: function (s,eye_contrler) {
            var x = (this.options.length - 1) * this.option_margin_x / 2;
            x = this.menu_position.x - x;
            var e;
            for (var i = 0; i < this.options.length; i++) {
                e = this.options[i];
                e.position.x = x;
                console.log("option "+(i+1)+" positon: ",e.position);
                s.add(e);
                if (typeof e.eye_callback != "undefined") {
                    eye_contrler.bind(e, e.eye_callback);
                }
                x += this.option_margin_x;
            }
            //this.show_cursor(scene,eye_contrler);
        },

        hide: function (scene,eye_contrler) {
            for (var i = 0; i < this.options.length; i++) {
                e = this.options[i];
                if (typeof e.eye_callback != "undefined") {
                    eye_contrler.unbind(e);
                }
                scene.remove(e);
            }
        },

        move_menu: function (x,y) {
            console.log(x,y);
            for (var i = 0; i < this.options.length; i++) {
                e = this.options[i];
                e.position.x += x;
                e.position.y += y;
                console.log(e.position);
            }
        },

        move: function (x,y,z) {
            for (var i = 0; i < this.options.length; i++) {
                e = this.options[i];
                e.position.x += x;
                e.position.y += y;
            }
            e.position.z = z;
        },

        onmenu_up: function (obj) {
            obj.callback_param.move_cursor(obj.callback_param,0,obj.callback_param.move_speed);
            obj.callback_param.move_menu(0,obj.callback_param.move_speed);
        },

        onmenu_down: function (obj) {
            obj.callback_param.move_cursor(obj.callback_param,0,-1*obj.callback_param.move_speed);
            obj.callback_param.move_menu(0,-1*obj.callback_param.move_speed);
        },

        onmenu_left: function (obj) {
            obj.callback_param.move_cursor(obj.callback_param,-1*obj.callback_param.move_speed,0);
            obj.callback_param.move_menu(-1*obj.callback_param.move_speed,0);
        },

        onmenu_right: function (obj) {
            obj.callback_param.move_cursor(obj.callback_param,obj.callback_param.move_speed,0);
            obj.callback_param.move_menu(obj.callback_param.move_speed,0);
        },

        move_cursor: function (_this,x,y) {
            _this.cursor_up.position.x += x;
            _this.cursor_up.position.y += y;

            _this.cursor_down.position.x += x;
            _this.cursor_down.position.y += y;

            _this.cursor_left.position.x += x;
            _this.cursor_left.position.y += y;

            _this.cursor_right.position.x += x;
            _this.cursor_right.position.y += y;
        },

        show_cursor: function (scene,eye_contrler) {
            console.log("enter show_cursor()");
            var triangle = new THREE.triangleGeometry(this.cursor_size);
            this.cursor_up = new THREE.Mesh( triangle ,new THREE.MeshBasicMaterial({
                //map: texture,
                color: 0xff0000
            }));
            this.cursor_up.position.x = this.menu_position.x;
            this.cursor_up.position.y = this.menu_position.y + this.option_height / 2 + this.cursor_height / 2;
            this.cursor_up.position.z = this.menu_position.z;
            console.log("this.cursor_up.rotation.z: "+this.cursor_up.rotation.z);
            this.cursor_up.rotation.z = (this.cursor_up.rotation.z - Math.PI*3/4) % (Math.PI * 2);
            this.cursor_up.callback_param = this;
            eye_contrler.bind(this.cursor_up,this.onmenu_up);
            console.log("cursor_up position: ",this.cursor_up.position);
            scene.add(this.cursor_up);

            this.cursor_down = new THREE.Mesh( triangle ,new THREE.MeshBasicMaterial({
                //map: texture,
                color: 0xff0000
            }));
            this.cursor_down.position.x = this.menu_position.x;
            this.cursor_down.position.y = this.menu_position.y - this.option_height / 2 - this.cursor_height / 2;
            this.cursor_down.position.z = this.menu_position.z;
            console.log("this.cursor_down.rotation.z: "+this.cursor_down.rotation.z);
            this.cursor_down.rotation.z = (this.cursor_down.rotation.z + Math.PI/4) % (Math.PI * 2);
            this.cursor_down.callback_param = this;
            eye_contrler.bind(this.cursor_down,this.onmenu_down);
            console.log("cursor_down position: ",this.cursor_down.position);
            scene.add(this.cursor_down);

            this.cursor_left = new THREE.Mesh( triangle ,new THREE.MeshBasicMaterial({
                //map: texture,
                color: 0xff0000
            }));
            var left_margin = (this.options.length - 1) * this.option_margin_x / 2 + this.option_width / 2 +this.cursor_height / 2;
            this.cursor_left.position.x = this.menu_position.x - left_margin;
            this.cursor_left.position.y = this.menu_position.y;
            this.cursor_left.position.z = this.menu_position.z;
            this.cursor_left.rotation.z = (this.cursor_left.rotation.z - Math.PI/4) % (Math.PI * 2);
            this.cursor_left.callback_param = this;
            eye_contrler.bind(this.cursor_left,this.onmenu_left);
            console.log("cursor_left position: ",this.cursor_left.position);
            scene.add(this.cursor_left);

            this.cursor_right = new THREE.Mesh( triangle ,new THREE.MeshBasicMaterial({
                //map: texture,
                color: 0xff0000
            }));
            this.cursor_right.position.x = this.menu_position.x + left_margin;
            this.cursor_right.position.y = this.menu_position.y;
            this.cursor_right.position.z = this.menu_position.z;
            this.cursor_right.rotation.z = (this.cursor_right.rotation.z + Math.PI*3/4) % (Math.PI * 2);
            this.cursor_right.callback_param = this;
            eye_contrler.bind(this.cursor_right,this.onmenu_right);
            console.log("cursor_right position: ",this.cursor_right.position);
            scene.add(this.cursor_right);
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
            option.position.x = this.menu_position.x;
            option.position.y = this.menu_position.y;
            option.position.z = this.menu_position.z;

            option.menu_index = this.options.length;
            if (typeof callback != "undefined") {
                option.eye_callback = callback;
            }
            this.options.push(option);
            return option;
        },

        add_text_option: function (scene, eye_contrler, text,callback) {

            var textMaterial = new THREE.MultiMaterial( [
                new THREE.MeshPhongMaterial( { color: 0x000000, shading: THREE.FlatShading } ), // front
                new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
            ] );

            var plane = new THREE.TextGeometry( text, {
                font: font,
                size: 20,
                height: 10,
                curveSegments: 4,
                bevelThickness: 2,
                bevelSize: 1.5,
                bevelEnabled: true,
                material: 0,
                extrudeMaterial: 1
            });

            plane.computeBoundingBox();
            plane.computeVertexNormals();
            var option = new THREE.Mesh( plane, textMaterial );

            option.position.x = this.menu_position.x + this.options.length * (this.option_width + this.option_margin);
            option.position.x = this.menu_position.x;
            option.position.y = this.menu_position.y;
            option.position.z = this.menu_position.z;

            option.menu_index = this.options.length;
            if (typeof callback != "undefined") {
                option.eye_callback = callback;
            }
            this.options.push(option);
            return option;
        },

        update: function(hc) {
            var eulerZYX = hc.getEulerZYX();
            var x = eulerZYX.x/Math.PI*180;
            var is_follow = true;
            if ((x > 90 && x  < 160) || (x > -90 && x  < -20)) {
                is_follow = false;
            }

            if (is_follow) {
                var eulerYXZ = hc.getEulerYXZ();
                var y = eulerZYX.y/Math.PI*180;
                var th = eulerYXZ.y;
                var e;
                var half = (this.options.length - 1) * this.option_margin_x / 2;
                var px = this.menu_position.z * Math.sin(th),
                    py = this.options[0].position.y,
                    pz = this.menu_position.z * Math.cos(th);
                for (var i = 0; i < this.options.length; i++) {
                    var c = half - i*this.option_margin_x;
                    e = this.options[i];
                    e.position.set(px - c*Math.cos(th), py,pz + c*Math.sin(th));
                    e.rotation.set(0,th,0);
                }
            }
        },
        updatePosition: function(hc) {
            var eulerZYX = hc.getEulerZYX();
            var x = eulerZYX.x/Math.PI*180;
            var is_follow = true;
            if (is_follow) {
                var eulerYXZ = hc.getEulerYXZ();
                var y = eulerZYX.y/Math.PI*180;
                var th = eulerYXZ.y;
                var e;
                var half = (this.options.length - 1) * this.option_margin_x / 2;
                var px = this.menu_position.z * Math.sin(th),
                    py = this.options[0].position.y,
                    pz = this.menu_position.z * Math.cos(th);
                for (var i = 0; i < this.options.length; i++) {
                    var c = half - i*this.option_margin_x;
                    e = this.options[i];
                    e.position.set(px - c*Math.cos(th), py,pz + c*Math.sin(th));
                    e.rotation.set(0,th,0);
                }
            }
        },
        remove_option: function (scene, eye_contrler, option) {
            var index = this.options.indexOf(option);
            if (index != -1) {
                this.options.splice(index, 1);
                scene.remove(option);
                if (typeof option.eye_callback != "undefined") {
                    eye_contrler.unbind(option);
                }
            }
        },
        
        change_pic: function (option,pic) {
            option.material.map = new THREE.TextureLoader().load( pic );
            option.material.map = true;
        }
    };
}( THREE ) );

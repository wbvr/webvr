/**
 * Created by zongwen1 on 16-9-14.
 */
( function ( ) {
    var _this = null;
    CvControls = function (obj,callback,camera) {
        console.log("CvControls");

        _this = this;
        this.paused = false;
        this.DEBUG = false;
        window.DEBUG = this.DEBUG;

        if (typeof callback != "undefined" && callback != null) {
            this.callback = callback;
        }

        if (typeof camera != "undefined") {
            this.camera = camera;
        }

        if (obj.tagName == "VIDEO") {
            this.video = obj;
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');

            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            console.log(this.canvas.width,this.canvas.height);
            this.init_cv();
            this.update_frome_video();

        } else if (obj.tagName == "CANVAS") {
            this.canvas = obj;
            this.ctx = this.canvas.getContext('2d');
            this.init_cv();
            this.update_frome_canvas();
        }
    };

    CvControls.prototype = {
        constructor: CvControls,

        stop: function () {
            this.paused = true;
        },

        start: function () {
            this.paused = false;
        },

        set_fov: function (fov) {
            this.half_horizontal_fov = Math.atan(Math.tan(fov/2 * Math.PI/180) * (this.canvas.width / this.canvas.height) / 2 );
        },

        init_cv: function () {

            if (this.DEBUG) {
                this.create_debug_canvas();
            }

            this.detector = new FLARMultiIdMarkerDetector(new FLARParam(this.canvas.width,this.canvas.height), 80);
            this.detector.setContinueMode(true);
            this.raster = new NyARRgbRaster_Canvas2D(this.canvas);
            this.half_canvas_width = this.canvas.width / 2;
            this.create_cursor();
            this.set_fov(75);
        },

        //返回找到的坐标
        found: function (x,y) {
            if (typeof this.callback != "undefined") {
                this.callback(x,y);
                return;
            }

            var look = this.cameraWorldDirection;
            var look_rad = 0;
            if (look.x > 0 && look.z <= 0) {
                look_rad = 2 * Math.PI + Math.atan(look.z/look.x);
                console.log('look: '+1);
            } else if (look.x > 0 && look.z >= 0) {
                look_rad = Math.atan(look.z/look.x);
                console.log('look: '+2);
            } else if (look.x < 0 && look.z >= 0) {
                look_rad = Math.PI + Math.atan(look.z/look.x);
                console.log('look: '+3);
            } else if (look.x < 0 && look.z <= 0) {
                look_rad = Math.PI + Math.atan(look.z/look.x);
                console.log('look: '+4);
            } else if (look.x == 0 && look.z < 0) {
                look_rad = 3 * Math.PI / 2;
            } else if (look.x == 0 && look.z > 0) {
                look_rad = Math.PI / 2;
            } else {
                return;
            }
            var found_rad = ((x / this.canvas.width) * 2*Math.PI + Math.PI/3) % (2*Math.PI);
            var rad = look_rad - found_rad;
            console.log("look_rad: "+(look_rad*(180/Math.PI)).toFixed(0));
            console.log("found_rad: "+(found_rad*(180/Math.PI)).toFixed(0));
            if (Math.abs(rad) < Math.PI/3 || (2*Math.PI-Math.abs(rad)) < Math.PI/3) {
                //alert('hide');
                this.hide();
            } else if ((rad > 0 && rad < Math.PI) || (rad < 0 && Math.abs(rad) > Math.PI)) {
                //this.video.pause();
                this.show_left_cursor();
            } else {
                this.show_right_cursor();
            }

        },

        hide: function () {
            this.hide_cursor(this.left_cursor);
            this.hide_cursor(this.right_cursor);
        },

        //从canvas中找
        update_frome_canvas: function () {
            requestAnimationFrame( function () {
                _this.update_frome_canvas();
            } );

            if (this.paused) return;
            if (!this.canvas.changed) return;

            this.detector.detectMarkerLite(this.raster, 170);
            //detector._bin_raster.getBuffer().drawOnCanvas(canvas);
        },

        //从video中找
        update_frome_video: function () {
            // requestAnimationFrame( function () {
            //     _this.update_frome_video();
            // } );

            if (this.paused) return;

            if ( this.video.readyState >= this.video.HAVE_CURRENT_DATA ) {

                this.cameraWorldDirection = this.camera.getWorldDirection();
                //console.log(this.cameraWorldDirection);
                this.ctx.drawImage(this.video, 0, 0, this.canvas.width,this.canvas.height);
                this.canvas.changed = true;
                var result = this.detector.detectMarkerLite(this.raster, 170);
                if (!result) {
                    this.hide();
                }

            }

            setTimeout(function () {
                _this.update_frome_video();
            },500);
        },

        //显示箭头
        show_left_cursor: function () {
            console.log("show_left_cursor");
            //alert('show_left_cursor');

            if (this.right_cursor.style.display != "none") {
                this.right_cursor.style.display = "none";
            }

            if (this.left_cursor.style.display == "none") {
                this.left_cursor.style.display = "";
            }

        },

        //显示箭头
        show_right_cursor: function () {
            console.log("show_right_cursor");
            //alert('show_right_cursor');

            if (this.left_cursor.style.display != "none") {
                this.left_cursor.style.display = "none";
            }

            if (this.right_cursor.style.display == "none") {
                this.right_cursor.style.display = "";
            }
        },

        //隐藏箭头
        hide_cursor: function (cursor) {
            if (cursor.style.display == "none") {
                return;
            }
            cursor.style.display = "none";
        },

        create_cursor: function () {
            var left_cursor = document.createElement( 'img' );
            left_cursor.id = 'left_cursor';
            left_cursor.style.position = 'absolute';

            left_cursor.style.width = '20px';
            left_cursor.style.height = '20px';

            left_cursor.style.left = '20px';
            left_cursor.style.marginLeft = '-10px';
            left_cursor.style.top = '50%';
            left_cursor.style.marginTop = '-10';

            left_cursor.src = 'static/img/left_cursor.png';

            left_cursor.style.zIndex = '1';
            left_cursor.style.display = 'none';
            this.left_cursor = left_cursor;
            document.body.appendChild(this.left_cursor);


            var right_cursor = document.createElement( 'img' );
            right_cursor.id = 'right_cursor';
            right_cursor.style.position = 'absolute';

            right_cursor.style.width = '20px';
            right_cursor.style.height = '20px';

            right_cursor.style.right = '20px';
            right_cursor.style.marginLeft = '-10px';
            right_cursor.style.top = '50%';
            right_cursor.style.marginTop = '-10';

            right_cursor.src = 'static/img/right_cursor.png';

            right_cursor.style.zIndex = '1';
            right_cursor.style.display = 'none';
            this.right_cursor = right_cursor;

            document.body.appendChild(this.right_cursor);
        },

        create_debug_canvas: function () {
            var debugCanvas = document.createElement('canvas');
            debugCanvas.width = this.canvas.width;
            debugCanvas.height = this.canvas.height;
            debugCanvas.id = 'debugCanvas';
            this.debugCanvas = debugCanvas;
            document.body.appendChild(debugCanvas);
        }
    };
}() );
/**
 * Created by zongwen1 on 16-9-14.
 */
( function ( ) {
    CvControls = function (canvas,callback,camera) {
        console.log("CvControls");
        this.paused = false;
        this.video_last_time = 0;
        this.DEBUG = true;
        window.DEBUG = this.DEBUG;

        this.canvas2d_width = window.innerWidth;
        this.canvas2d_height = window.innerHeight;
        this.glcanvas_width = window.innerWidth;
        this.glcanvas_height = window.innerHeight;
        this.canvas_display = "none";

        if (typeof callback != "undefined") {
            this.callback = callback;
        }

        if (this.DEBUG) {
            this.canvas2d_width = 200;
            this.canvas2d_height = 200;
            this.glcanvas_width = 200;
            this.glcanvas_height = 200;
            this.canvas_display = "";

            var debugCanvas = document.createElement('canvas');
            debugCanvas.width = this.canvas2d_width;
            debugCanvas.height = this.canvas2d_height;
            debugCanvas.id = 'debugCanvas';
            document.body.appendChild(debugCanvas);
        }

        if (typeof camera != "undefined") {
            this.camera = new THREE.PerspectiveCamera(75, this.glcanvas_width / this.glcanvas_height, 0.1, 10000);
            this.camera.copy(camera);

            this.canvas = document.createElement('canvas');
            this.canvas.id = "test_canvas";
            this.canvas.width = this.canvas2d_width;
            this.canvas.height = this.canvas2d_height;
            this.canvas.style.display = this.canvas_display;
            document.body.appendChild(this.canvas);

            this.renderer = new THREE.WebGLRenderer({antialias: false,preserveDrawingBuffer: true});
            this.renderer.setPixelRatio(Math.floor(window.devicePixelRatio));
            this.renderer.setSize( this.glcanvas_width, this.glcanvas_height );
            this.renderer.domElement.style.display = this.canvas_display;
            document.body.appendChild(this.renderer.domElement);

            if (typeof THREE.VRControls != "undefined") {
                this.controls = new THREE.VRControls(this.camera);
                this.effect = new THREE.VREffect(this.renderer);
                this.effect.setSize(this.glcanvas_width, this.glcanvas_height);
            }

        } else if (typeof canvas == "undefined") {
            this.canvas = document.createElement('canvas');
        } else {
            this.canvas = canvas;
        }

        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = 'white';
        this.ctx.font = "24px URW Gothic L, Arial, Sans-serif";

        this.video_width = 0;
        this.video_height = 0;
        //this.ctx.fillRect(0,0,this.video_width,this.video_height);

        this.cursor = '';

        this.create_cursor();
    };

    CvControls.prototype = {
        constructor: CvControls,

        stop: function () {
            this.paused = true;
        },

        start: function () {
            this.paused = false;
        },

        //返回找到的坐标
        found: function (x,y) {
            if (typeof this.callback != "undefined") {
                this.callback(x,y);
            }
            //console.log("found",x, y);
        },

        update: function (scene) {
            if (this.paused) return;

            this.controls.update();

            this.effect.render(scene,this.camera);


        },

        timer: function () {
            for (var i = 0; i < 8; i++) {
                if (typeof window.cv.effect != "undefined") {
                    window.cv.effect.render(scene,window.cv.camera);
                } else {
                    window.cv.renderer.render(scene,window.cv.camera);
                }

                window.cv.ctx.drawImage(window.cv.renderer.domElement,0,0,window.cv.canvas.width,window.cv.canvas.height);

                if (window.cv.update_frome_canvas()) {
                    console.log("update found i="+i);
                    if (i == 0) {
                        window.cv.hide_cursor(window.cv.left_cursor);
                        window.cv.hide_cursor(window.cv.right_cursor);
                    }
                    else if (i > 4) {
                        window.cv.show_right_cursor();
                    } else {
                        window.cv.show_left_cursor();
                    }
                    break;
                }

                window.cv.camera.rotation.y = (window.cv.camera.rotation.y + Math.PI / 4) % 2 * Math.PI;
            }
        },

        //从canvas中找
        update_frome_canvas: function () {
            if (this.paused) return;

            if (typeof this.detector == "undefined") {
                this.detector = new FLARMultiIdMarkerDetector(new FLARParam(this.canvas.width,this.canvas.height), 80);
                this.detector.setContinueMode(true);
                this.raster = new NyARRgbRaster_Canvas2D(this.canvas);
            }

            this.canvas.changed = true;
            var detected = this.detector.detectMarkerLite(this.raster, 170);
            //detector._bin_raster.getBuffer().drawOnCanvas(canvas);
            //detected > 0 && console.log("detected: "+detected);

            return detected;

        },

        //从video中找
        update_frome_video: function (video) {
            if (video.paused) return;
            if (this.paused) return;
            if (video.currentTime == this.video_last_time) return;
            this.video_last_time = video.currentTime;

            if (this.video_width == 0) {
                this.video_width = video.videoWidth;
                this.video_height = video.videoHeight;

                this.canvas.width = this.video_width;
                this.canvas.height = this.video_height;

                //this.ctx.fillRect(0,0,this.video_width,this.video_height);
                this.detector = new FLARMultiIdMarkerDetector(new FLARParam(this.video_width,this.video_height), 80);
                this.detector.setContinueMode(true);
                this.raster = new NyARRgbRaster_Canvas2D(this.canvas);
            }

            this.ctx.drawImage(video, 0, 0, this.video_width,this.video_height);
            this.canvas.changed = true;
            var detected = this.detector.detectMarkerLite(this.raster, 170);
            //detector._bin_raster.getBuffer().drawOnCanvas(canvas);
            //detected > 0 && console.log("detected: "+detected);

            return detected;
        },

        //显示箭头
        show_left_cursor: function () {
            console.log("show_left_cursor");

            // if (typeof window.cv.left_cursor == "undefined" ||
            //     typeof window.cv.right_cursor == "undefined" ) {
            //     window.cv.create_cursor();
            // }

            if (window.cv.right_cursor.style.display != "none") {
                window.cv.right_cursor.style.display = "none";
            }

            if (window.cv.left_cursor.style.display != "none") {
                return;
            } else {
                window.cv.left_cursor.style.display = "";
            }

        },

        //显示箭头
        show_right_cursor: function () {
            console.log("show_right_cursor");

            // if (typeof window.cv.left_cursor == "undefined" ||
            //     typeof window.cv.right_cursor == "undefined" ) {
            //     window.cv.create_cursor();
            // }

            if (window.cv.left_cursor.style.display != "none") {
                window.cv.left_cursor.style.display = "none";
            }

            if (window.cv.right_cursor.style.display != "none") {
                return;
            } else {
                window.cv.right_cursor.style.display = "";
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


        //显示箭头
        show_left_cursor2: function () {
            if (typeof window.cv.right_cursor != "undefined" && window.cv.right_cursor.cursor_state) {
                window.cv.hide_cursor(window.cv.right_cursor);
            }
            if (typeof window.cv.left_cursor != "undefined" && window.cv.left_cursor.cursor_state) {
                // window.cv.left_cursor.position.x = 200;
                // window.cv.left_cursor.position.y = 0;
                // window.cv.left_cursor.position.z = -10;
                return;
            }

            var triangle_size = 15;
            var triangle = new THREE.triangleGeometry(triangle_size);
            var cursor = new THREE.Mesh( triangle ,new THREE.MeshBasicMaterial({
                //map: texture,
                color: 0xff0000
            }));
            cursor.position.x = -200;
            cursor.position.y = 0;
            cursor.position.z = -10;
            cursor.rotation.z = -1*Math.PI/4;
            cursor.cursor_state = 1;
            window.cv.left_cursor = cursor;
            scene.add(window.cv.left_cursor);
        },

        //显示箭头
        show_right_cursor2: function () {
            if (typeof window.cv.left_cursor != "undefined" && window.cv.left_cursor.cursor_state) {
                window.cv.hide_cursor(window.cv.left_cursor);
            }
            if (typeof window.cv.right_cursor != "undefined" && window.cv.right_cursor.cursor_state) {
                // window.cv.right_cursor.position.x = 200;
                // window.cv.right_cursor.position.y = 0;
                // window.cv.right_cursor.position.z = -10;
                return;
            }

            var triangle_size = 15;
            var triangle = new THREE.triangleGeometry(triangle_size);
            var cursor = new THREE.Mesh( triangle ,new THREE.MeshBasicMaterial({
                //map: texture,
                color: 0xff0000
            }));
            cursor.position.x = 200;
            cursor.position.y = 0;
            cursor.position.z = -10;
            cursor.rotation.z = 3*Math.PI/4;
            cursor.cursor_state = 1;
            window.cv.right_cursor = cursor;
            scene.add(window.cv.right_cursor);
        },

        //隐藏箭头
        hide_cursor2: function (cursor) {
            cursor.cursor_state = 0;
            scene.remove(cursor);
        }
    };
}() );
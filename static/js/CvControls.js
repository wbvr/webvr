/**
 * Created by zongwen1 on 16-9-14.
 */
( function ( ) {
    CvControls = function (canvas,callback) {
        console.log("CvControls");
        this.paused = false;
        this.video_last_time = 0;

        if (typeof callback != "undefined") {
            this.callback = callback;
        }

        if (typeof canvas == "undefined") {
            this.canvas = document.createElement('canvas');
        } else {
            this.canvas = canvas;
        }
        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = 'white';
        this.ctx.font = "24px URW Gothic L, Arial, Sans-serif";

        this.video_width = 0;
        this.video_height = 0;
        this.ctx.fillRect(0,0,this.video_width,this.video_height);

        this.DEBUG = false;
        window.DEBUG = this.DEBUG;

        this.cursor = '';
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
            console.log("found",x, y);
        },

        //从canvas中找
        update: function () {
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

                this.ctx.fillRect(0,0,this.video_width,this.video_height);
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
        show_cursor: function (scene) {
            var triangle_size = 15;
            var triangle = new THREE.triangleGeometry(triangle_size);
            this.cursor = new THREE.Mesh( triangle ,new THREE.MeshBasicMaterial({
                //map: texture,
                color: 0xff0000
            }));
            this.cursor.position.x = -200;
            this.cursor.position.y = 0;
            this.cursor.position.z = -400;
            this.cursor.rotation.z = -1*Math.PI/4;
            scene.add(this.cursor);
        },

        //隐藏箭头
        hide_cursor: function (scene) {
            scene.remove(this.cursor);
        }
    };
}() );
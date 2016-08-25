/**
 * Created by sohow on 16-8-17.
 */

/*全局变量*/
var camera, scene, renderer;
var canvas, texture;
var container;
var vr_video, normal_video;
var controls, effect;
var vrDisplay;
var render;
var fov;
var fps;
var curtain, curtain_width, curtain_height,
    curtain_cur_height, up_curtain_time,
    down_curtain_time, curtain_exit;

var zoom_screen_num, zoom_screen_cur_num;

var onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0;

var onWindowResize = function () {};
var onDocumentMouseDown = function () {};
var onDocumentMouseMove = function () {};
var onDocumentMouseUp = function () {};
var onDocumentMouseWheel = function () {};
var container;
var font;
var loader = new THREE.FontLoader();
loader.load( 'static/json/optimer_bold.typeface.json', function ( response ) {
    font = response;
} );
var hc = new HControl();     //头势控制
/**/


init_webvr();

function init_webvr() {
    set_webvr();                            //初始化,加载场景,设置默认配置等
    play_vr_video();                        //播放VR视频
    setTimeout(init_screen,5000);
}

function init_screen() {
    var is_countdown = true;
    container = document.getElementById( 'container' );
    container.addEventListener( 'click', function () {
        if (is_countdown) {
            vr_video.play();
            countdown(function(){
                add_curtain();
                HControlBegin(init_nod);
                vr_video.addEventListener('ended',function(){
                    vr_video.pause();
                    init_backward();
                });
            });
            is_countdown= false;
        }

    });

    //add_normal_video_end_listener(init_backward);
}

function init_nod() {
    //play_pa_effect();                                       //播放pa特效
    up_curtain();                                           //升幕帘
    // add_normal_video_end_listener(init_normal_video_end);   //添加普通视频播放结束事件
    // add_forward_control_listener(init_forward);             //添加身体前倾事件
    // add_backward_control_listener(init_backward);           //添加身体后仰事件
}

function init_forward() {
    zoom_in_screen();       //放大场景
}

function init_backward() {
    zoom_out_screen();                                      //缩小场景
    down_curtain();                                         //降幕帘
}


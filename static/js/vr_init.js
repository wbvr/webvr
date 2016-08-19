/**
 * Created by sohow on 16-8-17.
 */

/*全局变量*/
var camera, scene, renderer;
var canvas, texture;
var vr_video, normal_video;
var controls, effect;
var vrDisplay;
var render;
var fov;
var curtain, curtain_width, curtain_height;    //幕帘

var onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0;

var onWindowResize = function () {};
var onDocumentMouseDown = function () {};
var onDocumentMouseMove = function () {};
var onDocumentMouseUp = function () {};
var onDocumentMouseWheel = function () {};
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
    add_vr_video_end_listener(init_screen); //添加VR视频播放结束事件
}

function init_screen() {
    set_screen();                                               //设置场景,添加物体
    countdown(function(){
        play_normal_video();                                    //倒计时,结束后播放普通视频(画面不可见,只有音频)
        HControlBegin(function(){
            console.log('111');                                 //运行点头后的操作
        });
    });
}

function init_nod() {
    play_pa_effect();                                       //播放pa特效
    up_curtain();                                           //升幕帘
    add_normal_video_end_listener(init_normal_video_end);   //添加普通视频播放结束事件
    add_forward_control_listener(init_forward);             //添加身体前倾事件
    add_backward_control_listener(init_backward);           //添加身体后仰事件
}

function init_forward() {
    zoom_in_screen();       //放大场景
}

function init_backward() {
    zoom_out_screen();      //缩小场景
}

function init_normal_video_end() {
    down_curtain();                                         //降幕帘
    add_eye_control_listener(init_eye_yes, init_eye_no);     //添加视控选择事件
}

function init_eye_yes() {
    //下一个选手
    clear_webvr();  //清除释放资源
    next_uid = 2;   //设置下一位选手
    init_webvr();   //重新初始化
}

function init_eye_no() {
    //退出
}
/**
 * Created by sohow on 16-8-17.
 */

/*全局变量*/
var camera, scene, renderer;
var canvas, video, texture;
var controls, effect;
var vrDisplay;
var onWindowResize;
var render;

/**/


init_webvr();

function init_webvr() {
    set_webvr();                            //初始化,加载场景,设置默认配置等
    play_vr_video();                        //播放VR视频
    //add_vr_video_end_listener(init_screen); //添加VR视频播放结束事件
}

function init_screen() {
    set_screen();                           //设置场景,添加物体
    play_normal_video();                    //播放普通视频(画面不可见,只有音频)
    add_nod_control_listener(init_nod);     //添加点头事件
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
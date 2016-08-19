/**
 * Created by sohow on 16-8-17.
 */

function set_webvr() {
    var container = document.getElementById( 'container' );
    container.addEventListener( 'click', function () {
        vr_video.play();
    });
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.layers.enable( 1 );

    fov = 60;   //默认视角
    fps = 60;   //fps
    curtain_width = 240;
    curtain_height = 100;
    curtain_cur_height = curtain_height;
    up_curtain_time = 5;    //升窗帘所需时间秒
    down_curtain_time = 5;  //降窗帘所需时间秒
    zoom_screen_num = 10;    //场景放大次数
    zoom_screen_cur_num = 0; //场景放大当前次数
    curtain_exit = 0;


    window.addEventListener( 'resize', onWindowResize, false );

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
    document.addEventListener( 'MozMousePixelScroll', onDocumentMouseWheel, false);

    //预先加载VR视频
    vr_video = document.createElement( 'video' );
    //video.loop = true;
    vr_video.muted = true;
    vr_video.src = 'static/video/vr_video.webm';
    vr_video.setAttribute('crossorigin', 'anonymous');
    vr_video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
    vr_video.load();

    animate();
}

function animate() {
    if (render) {
        render();
    }
    requestAnimationFrame( animate );
}

function play_vr_video() {

    //vr_video.play();

    texture = new THREE.VideoTexture( vr_video );
    texture.minFilter = THREE.NearestFilter;
    texture.maxFilter = THREE.NearestFilter;
    texture.format = THREE.RGBFormat;
    texture.generateMipmaps = false;

    scene = new THREE.Scene();

    // left

    var geometry = new THREE.SphereGeometry( 500, 60, 40 );
    geometry.scale( - 1, 1, 1 );

    var uvs = geometry.faceVertexUvs[ 0 ];

    var i, j;
    for ( i = 0; i < uvs.length; i ++ ) {

        for ( j = 0; j < 3; j ++ ) {

            uvs[ i ][ j ].x *= 0.5;

        }

    }

    var material = new THREE.MeshBasicMaterial( { map: texture } );

    var mesh = new THREE.Mesh( geometry, material );
    mesh.rotation.y = - Math.PI / 2;
    mesh.layers.set( 1 );
    scene.add( mesh );

    // right

    geometry = new THREE.SphereGeometry( 500, 60, 40 );
    geometry.scale( - 1, 1, 1 );

    uvs = geometry.faceVertexUvs[ 0 ];

    for ( i = 0; i < uvs.length; i ++ ) {

        for ( j = 0; j < 3; j ++ ) {

            uvs[ i ][ j ].x *= 0.5;
            uvs[ i ][ j ].x += 0.5;

        }

    }

    material = new THREE.MeshBasicMaterial( { map: texture } );

    mesh = new THREE.Mesh( geometry, material );
    mesh.rotation.y = - Math.PI / 2;
    mesh.layers.set( 2 );
    scene.add( mesh );

    canvas = document.getElementById('canvas');
    renderer = new THREE.WebGLRenderer({canvas:canvas});
    renderer.setClearColor( 0x101010 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );


    controls = new THREE.VRControls( camera );

    effect = new THREE.VREffect( renderer );
    effect.scale = 0;
    effect.setSize( window.innerWidth, window.innerHeight );

    if ( WEBVR.isAvailable() === true ) {
        navigator.getVRDisplays().then(function(displays) {
            if (displays.length > 0) {
                vrDisplay = displays[0];
            }
        });
        document.body.appendChild( WEBVR.getButton(  ) );
    }

    //播放vr视频onWindowResize响应事件
    onWindowResize = function() {
        console.log('onWindowResize for vr');
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        effect.setSize( window.innerWidth, window.innerHeight );
    };

    //播放vr视频render响应事件
    render = function() {
        controls.update();
        effect.render( scene, camera );
    };
}

function add_vr_video_end_listener(init_screen) {
    var flag = true;
    vr_video.addEventListener('ended',function(){
        if (flag) {
            init_screen();
            flag = false;
        }
    });
}

function add_normal_video_play_listener(HControlBegin,init_nod) {
    normal_video.addEventListener('play',function(){
        //setTimeout(HControlBegin,5000);
        HControlBegin(init_nod);
    });
}

function add_normal_video_end_listener(init_normal_video_end) {
    normal_video.addEventListener('ended',function(){
        //setTimeout(HControlBegin,5000);
        init_normal_video_end();
    });
}

/**
 * 倒计时
 */
function count_down(play_normal_video) {

    play_normal_video();
}

/**
 * 对话框
 */
function confirm_msg_box(init_nod) {
    var flag = confirm("是否选择?");
    if (flag) {
        alert('yes');
    } else {
        alert('no');
    }
}

/**
 * 升幕帘
 */
function up_curtain() {
    console.log('up_curtain');
    if (curtain.position.y < curtain_height) {
        var up = curtain_height / up_curtain_time / fps;
        console.log('up: '+up);
        curtain.position.y += up;
        requestAnimationFrame(up_curtain);
    } else {
        scene.remove(curtain);
        curtain_exit = 0;
        init_forward();
    }
}

/**
 * 降幕帘
 */
function down_curtain() {
    if (!curtain_exit) {
        scene.add(curtain);
    }
    console.log('down_curtain');
    if (curtain.position.y > 0) {
        var down = curtain_height / up_curtain_time / fps;
        console.log('down: '+down);
        curtain.position.y -= down;
        requestAnimationFrame(down_curtain);
    } else {

    }
}

/**
 * 缩小
 */
function zoom_out_screen() {
    console.log('zoom_out_screen fov: '+camera.fov);
    if (zoom_screen_cur_num++ < zoom_screen_num) {
        camera.fov += 3;
        camera.updateProjectionMatrix();
        requestAnimationFrame(zoom_out_screen);
    } else {
        zoom_screen_cur_num = 0;
    }
}

/**
 * 放大
 */
function zoom_in_screen() {
    console.log('zoom_in_screen fov: '+camera.fov);
    if (zoom_screen_cur_num++ < zoom_screen_num) {
        camera.fov -= 3;
        camera.updateProjectionMatrix();
        requestAnimationFrame(zoom_in_screen);
    } else {
        zoom_screen_cur_num = 0;
    }
}


function set_screen() {
    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 1100 );
    camera.lookAt(new THREE.Vector3( 0, 0, 0 ));

    scene = new THREE.Scene();
    scene.add(camera);

    var geometry = new THREE.SphereGeometry( 500, 32, 16 );
    geometry.scale( - 1, 1, 1 );

    var texture = new THREE.TextureLoader().load( 'static/img/screen.jpg' );
    var material = new THREE.MeshBasicMaterial( {
        map: texture
    } );
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    canvas = document.getElementById('canvas');
    renderer = new THREE.WebGLRenderer({canvas:canvas});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );



    render = function() {
        lat = Math.max( - 85, Math.min( 85, lat ) );
        phi = THREE.Math.degToRad( 90 - lat );
        theta = THREE.Math.degToRad( lon );

        camera.position.x = 100 * Math.sin( phi ) * Math.cos( theta );
        camera.position.y = 100 * Math.cos( phi );
        camera.position.z = 100 * Math.sin( phi ) * Math.sin( theta );
        camera.lookAt( scene.position );

        controls.update();
        effect.render(scene, camera);
    };

    init_webvr_controls();

    onWindowResize = function() {
        console.log('onWindowResize for sceen');
        renderer.setSize( window.innerWidth, window.innerHeight );
        camera.projectionMatrix.makePerspective( fov, window.innerWidth / window.innerHeight, 1, 1100 );
    };

    onDocumentMouseDown = function( event ) {
        event.preventDefault();

        onMouseDownMouseX = event.clientX;
        onMouseDownMouseY = event.clientY;

        onMouseDownLon = lon;
        onMouseDownLat = lat;
    };

    onDocumentMouseMove = function( event ) {
        lon = ( onMouseDownMouseX - event.clientX ) * 0.1 + onMouseDownLon;
        lat = ( event.clientY - onMouseDownMouseY ) * 0.1 + onMouseDownLat;
    };

    onDocumentMouseUp = function( event ) {

    };

    onDocumentMouseWheel = function( event ) {

        // WebKit

        if ( event.wheelDeltaY ) {

            camera.fov -= event.wheelDeltaY * 0.05;

            // Opera / Explorer 9

        } else if ( event.wheelDelta ) {

            camera.fov -= event.wheelDelta * 0.05;

            // Firefox

        } else if ( event.detail ) {

            camera.fov += event.detail * 1.0;

        }

        camera.updateProjectionMatrix();

    };

    //预加载普通视频
    normal_video = document.createElement( 'video' );
    //normal_video.loop = true;
    //normal_video.muted = true;
    normal_video.src = 'static/video/normal_video.mp4';
    normal_video.setAttribute('crossorigin', 'anonymous');
    normal_video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
    normal_video.load();
}

function play_normal_video() {
    console.log('play_normal_video');

    normal_video.play();

    videoTexture = new THREE.VideoTexture( normal_video );
    videoTexture.minFilter = THREE.NearestFilter;
    videoTexture.maxFilter = THREE.NearestFilter;

    var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
    var movieGeometry = new THREE.PlaneGeometry( curtain_width, curtain_height );
    var curtainGeometry = new THREE.PlaneGeometry( curtain_width, curtain_height );
    var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
    curtain = new THREE.Mesh( curtainGeometry ,new THREE.MeshBasicMaterial({
        color: 0x000000
    }));


    movieScreen.position.set(0,0,-400);
    curtain.position.set(0,0,-399);
    scene.add(movieScreen);
    scene.add(curtain);
    curtain_exit = 1;
}


function init_webvr_controls() {
    // Apply VR headset positional data to camera.
    controls = new THREE.VRControls(camera);

    // Apply VR stereo rendering to renderer.
    effect = new THREE.VREffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);

    // Get the VRDisplay and save it for later.
    navigator.getVRDisplays().then(function(displays) {
        if (displays.length > 0) {
            vrDisplay = displays[0];
        }
    });
}













var WEBVR = {

    isLatestAvailable: function () {

        return navigator.getVRDisplays !== undefined;

    },

    isAvailable: function () {

        return navigator.getVRDisplays !== undefined || navigator.getVRDevices !== undefined;

    },

    getMessage: function () {

        var message;

        if ( navigator.getVRDisplays ) {

            navigator.getVRDisplays().then( function ( displays ) {

                if ( displays.length === 0 ) message = 'WebVR supported, but no VRDisplays found.';

            } );

        } else if ( navigator.getVRDevices ) {

            message = 'Your browser supports WebVR but not the latest version. See <a href="http://webvr.info">webvr.info</a> for more info.';

        } else {

            message = 'Your browser does not support WebVR. See <a href="http://webvr.info">webvr.info</a> for assistance.';

        }

        if ( message !== undefined ) {

            var container = document.createElement( 'div' );
            container.style.position = 'absolute';
            container.style.left = '0';
            container.style.top = '0';
            container.style.right = '0';
            container.style.zIndex = '999';
            container.align = 'center';

            var error = document.createElement( 'div' );
            error.style.fontFamily = 'sans-serif';
            error.style.fontSize = '16px';
            error.style.fontStyle = 'normal';
            error.style.lineHeight = '26px';
            error.style.backgroundColor = '#fff';
            error.style.color = '#000';
            error.style.padding = '10px 20px';
            error.style.margin = '50px';
            error.style.display = 'inline-block';
            error.innerHTML = message;
            container.appendChild( error );

            return container;

        }

    },

    getButton: function () {

        var button = document.createElement( 'button' );
        button.style.position = 'absolute';
        button.style.left = 'calc(50% - 50px)';
        button.style.bottom = '20px';
        button.style.width = '100px';
        button.style.border = '0';
        button.style.padding = '8px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = '#000';
        button.style.color = '#fff';
        button.style.fontFamily = 'sans-serif';
        button.style.fontSize = '13px';
        button.style.fontStyle = 'normal';
        button.style.textAlign = 'center';
        button.style.zIndex = '999';
        button.textContent = 'ENTER VR';
        button.onclick = function() {
            vrDisplay.requestPresent([{source: renderer.domElement}]);
        };

        window.addEventListener( 'vrdisplaypresentchange', function ( event ) {

            button.textContent = effect.isPresenting ? 'EXIT VR' : 'ENTER VR';

        }, false );

        return button;

    }

};
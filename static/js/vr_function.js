/**
 * Created by sohow on 16-8-17.
 */

function set_webvr() {
    var container = document.getElementById( 'container' );
    container.addEventListener( 'click', function () {
        video.play();
    });
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.layers.enable( 1 );
    
    
    
    window.addEventListener( 'resize', onWindowResize, false );
    
    animate();
}

function animate() {
    if (render) {
        render();
    }
    requestAnimationFrame( animate );
}

function play_vr_video() {

    // video

    video = document.createElement( 'video' );
    video.loop = true;
    video.muted = true;

    video.src = 'static/video/vr_video.webm';
    //video.src = 'http://sohow.applinzi.com/static/img/hsy.mp4';
    video.setAttribute('crossorigin', 'anonymous');
    video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
    video.load();
    //video.play();

    texture = new THREE.VideoTexture( video );
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
            console.log('vr model');
            //vrDisplay.isPresenting ? vrDisplay.exitPresent() : vrDisplay.requestPresent([{source: renderer.domElement}]);
            vrDisplay.requestPresent([{source: renderer.domElement}]);
            //init_webvr();

        };

        window.addEventListener( 'vrdisplaypresentchange', function ( event ) {

            button.textContent = effect.isPresenting ? 'EXIT VR' : 'ENTER VR';

        }, false );

        return button;

    }

};
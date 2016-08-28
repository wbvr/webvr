var curtain;
function texiao() {
    var texture = new THREE.TextureLoader().load( 'static/img/b.png' );
    var material = new THREE.MeshBasicMaterial( {
        map: texture
    } );
    var curtainGeometry = new THREE.PlaneGeometry( 100, 100 );
    curtain = new THREE.Mesh( curtainGeometry ,material);

    curtain.position.set(0, 0, -100);
    scene.add(curtain);
    var dp = 0;

    function up() {
        if(dp<360){
            var th = dp * Math.PI /180;
            curtain.position.set(300 * Math.sin(th), 0, (-300 * Math.cos(th)));
            curtain.rotation.set(0,-th,0);
            dp+=4;
        }
        if (dp >= 360) {
            scene.remove(curtain);
        }
        camera.updateProjectionMatrix();
        setTimeout(up, 100)
    }
    setTimeout(up, 100)
}

function texiao1() {
    var Geometry = [];
    var curtain = [];
    var texture = new THREE.TextureLoader().load( 'static/img/b.png' );
    var material = new THREE.MeshBasicMaterial( {
        map: texture
    } );
    for (var i=-180;i < 180; i+=10){
        Geometry[i] = new THREE.PlaneGeometry( 20, 20 );
        curtain[i] = new THREE.Mesh( Geometry[i] ,material);
        var th = i * Math.PI /180;
        curtain[i].position.set(300 * Math.sin(th), 0, (-300 * Math.cos(th)));
        curtain[i].rotation.set(0,-th,0);
        scene.add(curtain[i]);
    }
    setTimeout(function(){
        for (var i=-180;i < 180; i+=10){
            scene.remove(curtain[i]);
        }
    },2000);
}
function texiao() {
    var texture = new THREE.TextureLoader().load( 'static/img/b.png' );
    var material = new THREE.MeshBasicMaterial( {
        map: texture,
        transparent: true,
    } );
    var curtainGeometry = new THREE.PlaneGeometry( 100, 100 );
    var ef = new THREE.Mesh( curtainGeometry ,material);

    ef.position.set(0, 0, -100);
    scene.add(ef);
    var dp = 0;

    function up() {
        if(dp<360){
            var th = dp * Math.PI /180;
            ef.position.set(300 * Math.sin(th), 0, (-300 * Math.cos(th)));
            ef.rotation.set(0,-th,0);
            dp+=4;
        }
        if (dp >= 360) {
            scene.remove(ef);
        }
        camera.updateProjectionMatrix();
        setTimeout(up, 100)
    }
    setTimeout(up, 100)
}

function texiao1() {
    var Geometry = [];
    var efs = [];
    var texture = new THREE.TextureLoader().load( 'static/img/b.png' );
    var material = new THREE.MeshBasicMaterial( {
        map: texture,
        transparent: true,
    } );
    for (var i=-180;i < 180; i+=10){
        Geometry[i] = new THREE.PlaneGeometry( 20, 20 );
        efs[i] = new THREE.Mesh( Geometry[i] ,material);
        var th = i * Math.PI /180;
        efs[i].position.set(300 * Math.sin(th), 0, (-300 * Math.cos(th)));
        efs[i].rotation.set(0,-th,0);
        scene.add(efs[i]);
    }
    setTimeout(function(){
        for (var i=-180;i < 180; i+=10){
            scene.remove(efs[i]);
        }
    },2000);
}
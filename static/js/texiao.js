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
            requestAnimationFrame(up);
        } else {
            scene.remove(ef);
        }
        camera.updateProjectionMatrix();
    }
    requestAnimationFrame(up);
}

function texiao1() {
    var Geometry = [];
    var efs = [];
    var texture = new THREE.TextureLoader().load( 'static/img/flower.png' );
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


function texiao2(x, y, z) {

    var dp = 0;
    var h = 0;
    var th = dp * Math.PI /180;
    var dh = 0.5 + 1.5 * Math.random();
    var dz = 100 + 900 * Math.random();
    var rd = 10 + 100 * Math.random();
    var drd = 0.1 + 0.2 * Math.random();
    var f = Math.random() > 0.5 ? true: false;
    var img = Math.floor(1 + 9 * Math.random());
    var texture = new THREE.TextureLoader().load( 'static/img/' + img + '.png' );
    var material = new THREE.MeshBasicMaterial( {
        map: texture,
        transparent: true,
    } );
    var curtainGeometry = new THREE.PlaneGeometry(20, 20 );
    var ef = new THREE.Mesh( curtainGeometry ,material);

    ef.position.set(40 * Math.sin(th)+x, (y + h * dh), ((-40 * Math.cos(th))/dz + z));
    scene.add(ef);

    function up() {
        if (h < 400) {
            if(dp<360 && dp>-360){
                th = dp * Math.PI /180;
                ef.position.set(rd * Math.sin(th)+x, (y + h), ((rd * Math.cos(th))/dz + z));
                if (f){
                    dp+=4;
                } else {
                    dp-=4;
                }
                h += 2 * dh;
                rd += drd;
            } else {
                dp =0;
            }
            requestAnimationFrame(up);
        } else {
            scene.remove(ef);
            ef = undefined;
            texture  = undefined;
            material = undefined;
        }
        camera.updateProjectionMatrix();
    }
    requestAnimationFrame(up);
}



function s(x, y, z) {
    var texture = new THREE.TextureLoader().load( 'static/img/b.png' );
    var material = new THREE.MeshBasicMaterial( {
        map: texture,
        transparent: true,
    } );
    var curtainGeometry = new THREE.PlaneGeometry( 100, 100 );
    var ef = new THREE.Mesh( curtainGeometry ,material);

    ef.position.set(x, y, z);
    scene.add(ef);
    var dp = 0;
}
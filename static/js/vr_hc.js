function HControlBegin(callback) {
    var texture = new THREE.TextureLoader().load( 'static/img/text.png' );
    var material = new THREE.MeshBasicMaterial( {
        map: texture
    } );
    var geometry = new THREE.PlaneGeometry( 400, 200 );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(0,50,-398);
    scene.add( mesh );


    scene.add(curtain);
    setTimeout(function(){
        console.log('nod start');
        hc.setNod(function(){
            console.log('nod');
            scene.remove(mesh);
            hc.closeNod();
            hc.close();
            callback();
        });
    },2000);
}
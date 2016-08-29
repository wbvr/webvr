function HControlBegin(callback) {
    hc.open();
    //渲染对话框
    var pointLight = new THREE.PointLight( 0xffffff, 1.5 );
    pointLight.position.set( 0, 100, 90 );
    scene.add( pointLight );

    var colorhash  = "00ffff";
    hex = colorhash;
    pointLight.color.setHex( parseInt( colorhash, 16 ) );


    var curtainGeometry = new THREE.PlaneGeometry( 400, 200 );
    var curtain = new THREE.Mesh( curtainGeometry ,new THREE.MeshBasicMaterial({
        color: 0x000000
    }));
    curtain.position.set(0,50,-399);

    var textMaterial = new THREE.MultiMaterial( [
        new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
        new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
    ] );
    var textGeo = new THREE.TextGeometry( '如果选中本名选手', {

        font: font,

        size: 30,
        height: 10,
        curveSegments: 4,
        bevelThickness: 2,
        bevelSize: 1.5,
        bevelEnabled: true,
        material: 0,
        extrudeMaterial: 1
    });
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();
    var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

    var textMesh = new THREE.Mesh( textGeo, textMaterial );
    textMesh.position.x = centerOffset;
    textMesh.position.y = 50;
    textMesh.position.z = -350;
    textMesh.rotation.x = 0;
    textMesh.rotation.y = Math.PI * 2;

    var textGeo1 = new THREE.TextGeometry( '请点头', {

        font: font,

        size: 30,
        height: 10,
        curveSegments: 4,
        bevelThickness: 2,
        bevelSize: 1.5,
        bevelEnabled: true,
        material: 0,
        extrudeMaterial: 1
    });
    textGeo1.computeBoundingBox();
    textGeo1.computeVertexNormals();
    var centerOffset1 = -0.5 * ( textGeo1.boundingBox.max.x - textGeo1.boundingBox.min.x );

    var textMesh1 = new THREE.Mesh( textGeo1, textMaterial );
    textMesh1.position.x = centerOffset1+100;
    textMesh1.position.y = -10;
    textMesh1.position.z = -350;
    textMesh1.rotation.x = 0;
    textMesh1.rotation.y = Math.PI * 2;

    scene.add(curtain);
    scene.add(textMesh);
    scene.add(textMesh1);

    setTimeout(function(){
        console.log('nod start');
        hc.setNod(function(){
            console.log('nod');
            scene.remove(textMesh);
            scene.remove(textMesh1);
            hc.closeNod();
            hc.close();
            callback();
        });
    },2000);
}
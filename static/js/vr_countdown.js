
var  count =3;
function countdown(callback) {
    if (typeof callback !== 'function') {
        console.warn('callback is not function');
    }



    var pointLight = new THREE.PointLight( 0xffffff, 1.5 );
    pointLight.position.set( 0, 100, 90 );
    scene.add( pointLight );

    var colorhash  = "00ffff";
    hex = colorhash;
    pointLight.color.setHex( parseInt( colorhash, 16 ) );


    var curtainGeometry = new THREE.PlaneGeometry( 300, 200 );
    var curtain = new THREE.Mesh( curtainGeometry ,new THREE.MeshBasicMaterial({
        color: 0x000000
    }));
    curtain.position.set(0,50,-399);

    var textMaterial = new THREE.MultiMaterial( [
        new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
        new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
    ] );
    var textGeo = new THREE.TextGeometry( count, {

        font: font,

        size: 70,
        height: 20,
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
    textMesh.position.y = 0;
    textMesh.position.z = -350;
    textMesh.rotation.x = 0;
    textMesh.rotation.y = Math.PI * 2;


    scene.add(curtain);
    scene.add(textMesh);

    var count_do = function() {
        if(count <= 0) {
            scene.remove(curtain);
            scene.remove(textMesh);
            callback();
        } else {
            count--;
            scene.remove(textMesh);
            textGeo = new THREE.TextGeometry( count, {

                font: font,

                size: 70,
                height: 20,
                curveSegments: 4,
                bevelThickness: 2,
                bevelSize: 1.5,
                bevelEnabled: true,
                material: 0,
                extrudeMaterial: 1
            });
            textGeo.computeBoundingBox();
            textGeo.computeVertexNormals();
            centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

            textMesh = new THREE.Mesh( textGeo, textMaterial );
            textMesh.position.x = centerOffset;
            textMesh.position.y = 0;
            textMesh.position.z = -350;
            textMesh.rotation.x = 0;
            textMesh.rotation.y = Math.PI * 2;

            scene.add(curtain);
            scene.add(textMesh);
            setTimeout(count_do,1000);
        }
    };
    setTimeout(count_do,1000);
}

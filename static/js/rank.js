var op;
function showRank(data){
    if (op !== undefined){
        removeRank();
        op = null;
    }
    if (data !== undefined) {
        rank_data = data;
    }
    if (rank_data === undefined) {
        return false;
    }

    if (!rankStatus) {
        return;
    }
    op= getRank(rank_data);
    op.position.z = -500;
    scene.add(op);
    function update() {
        var eulerYXZ = hc.getEulerYXZ();
        var th = eulerYXZ.y;
        op.position.x = -500 * Math.sin(th);
        op.position.y = 0;
        op.position.z = -500 * Math.cos(th);
        op.rotation.set(0,th,0);
        requestAnimationFrame(update);
    }
    update();
}
function removeRank() {
        scene.remove(op);
}

function getRank(data){
    var object = new THREE.Group();
    if (data.length == 1) {
        var op = getOneRank(data[0]);
        object.add(op);
    } else if (data.length == 2) {
        var op1 = getOneRank(data[0]);
        op1.position.x = 220;
        object.add(op1);
        var op2 = getOneRank(data[1]);
        op2.position.x = -220;
        object.add(op2);
    }
    return object;
}

function getOneRank(data){
    var object = new THREE.Group();
    var title = data.group_name;
    var rank = data.group_data;
    var ob = getTotal(title);
    ob.position.y=500;
    ob.position.x=-100;
    ob.position.z=-400;
    object.add(ob);

    for (var i=0;i<rank.length;i++) {
        ob = getOne(rank[i]);
        ob.position.y=500-80*(i+1);
        ob.position.x=-100;
        ob.position.z=-400;
        object.add(ob);
    }
    return object;

}

function getOne(data) {
    var ob = new THREE.Group();
    var user = data.uid;
    var count = data.score

    var text = '【' + user + '】送给主播' + count + '朵鲜花';
    var textMaterial =  new THREE.MeshPhongMaterial( { color: 0x000000} );
    var textGeo = new THREE.TextGeometry( text, {
        font: font,
        size: 20,
        height: 0,
        curveSegments: 4,
        bevelThickness: 2,
        bevelSize: 1,
        bevelEnabled: true,
        material: 0,
        extrudeMaterial: 1
    });
    var textMesh = new THREE.Mesh( textGeo, textMaterial );
    textMesh.position.x = 70;
    textMesh.position.y = -20;
    textMesh.position.z = -299;
    ob.add(textMesh);

    var curtainGeometry = new THREE.PlaneGeometry( 400, 60);
    var mesh = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7
    });
    var curtain = new THREE.Mesh( curtainGeometry ,mesh);
    curtain.position.set(200,0,-300);
    ob.add(curtain);

    var img = Math.floor(1 + 9 * Math.random());
    var texture;
    if(textures.like === undefined){
        var like = [];
        for (var i=1;i<10;i++) {
            like[i] = new THREE.TextureLoader().load( 'static/img/' + i + '.png' );
        }
        texture = like[img];
        textures.like = like;
    } else {
        texture = textures.like[img];
    }
    var material = new THREE.MeshBasicMaterial( {
        map: texture,
        transparent: true,
    } );
    var curtainGeometry1 = new THREE.PlaneGeometry( 60, 60);
    var ef = new THREE.Mesh( curtainGeometry1 ,material);
    ef.position.set(40,0,-299);
    ob.add(ef);
    return ob;
}


function getTotal(data) {
    var ob = new THREE.Group();
    var text = data;
    var textMaterial = new THREE.MeshPhongMaterial( { color: 0x000000} );
    var textGeo = new THREE.TextGeometry( text, {
        font: font,
        size: 20,
        height: 0,
        curveSegments: 4,
        bevelThickness: 2,
        bevelSize: 1,
        bevelEnabled: true,
        material: 0,
        extrudeMaterial: 1
    });
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();
    var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

    var textMesh = new THREE.Mesh( textGeo, textMaterial );
    textMesh.position.x = centerOffset + 200;
    textMesh.position.y = -20;
    textMesh.position.z = -299;
    ob.add(textMesh);

    var curtainGeometry = new THREE.PlaneGeometry( 400, 60);
    var mesh = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7
    });
    var curtain = new THREE.Mesh( curtainGeometry ,mesh);
    curtain.position.set(200,0,-300);
    ob.add(curtain);
    return ob;
}

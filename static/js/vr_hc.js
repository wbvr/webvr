function HControlBegin(callback) {
    hc.open();
    //渲染对话框
    var text = new THREE.TextGeometry('text',{
        size: 20,
        height: 0,
        weight: 'normal',
        font:  font,
        style: 'normal',
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 1,
        curveSegments: 50,
        steps: 1
    });
    var tmaterial = new THREE.MeshBasicMaterial({color:0xffffff});        //物体加上材质
    var tmesh = new THREE.Mesh(text,tmaterial);
    tmesh.position.set(-20,-10,-200);

    setTimeout(function(){
        console.log('nod start');
        scene.add(tmesh);
        hc.setNod(function(){
            scene.remove(tmesh);
            hc.closeNod();
            hc.close();
            callback();
        });
    },2000);
}
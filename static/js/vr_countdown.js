
var  count =3;
function countdown(callback) {
    if (typeof callback !== 'function') {
        console.warn('callback is not function');
    }

    var curtainGeometry = new THREE.PlaneGeometry( curtain_width, curtain_height );
    var curtain = new THREE.Mesh( curtainGeometry ,new THREE.MeshBasicMaterial({
        color: 0x000000
    }));
    curtain.position.set(0,0,-399);

    var text = new THREE.TextGeometry(count,{
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
    tmesh.position.set(-10,-10,-200);

    scene.add(curtain);
    scene.add(tmesh);

    var count_do = function() {
        if(count <= 0) {
            scene.remove(curtain);
            scene.remove(tmesh);
            callback();
        } else {
            count--;
            scene.remove(tmesh);
            text = new THREE.TextGeometry(count,{
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
            tmaterial = new THREE.MeshBasicMaterial({color:0xffffff});        //物体加上材质
            tmesh = new THREE.Mesh(text,tmaterial);
            tmesh.position.set(-10,-10,-200);

            scene.add(curtain);
            scene.add(tmesh);
            setTimeout(count_do,1000);
        }
    };
    setTimeout(count_do,1000);
}

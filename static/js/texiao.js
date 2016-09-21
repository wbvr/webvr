var textures = {};
function texiao() {

    if (ws != null || user !== false) {
        var msg = {
            type : 'boat',
            uid : user
        };
        msg=JSON.stringify(msg);
        ws.send(msg);
    }
    var texture;
    if(textures.boat === undefined){
        texture = new THREE.TextureLoader().load( 'static/img/boat.png' );
        textures.boat = texture;
    } else {
        texture = textures.boat;
    }
    var material = new THREE.MeshBasicMaterial( {
        map: texture,
        transparent: true,
    } );

    var dp = 0;
    var dh = 50;
    var dl = 10;
    var th = dp * Math.PI /180;
    var rd = 200;
    var y = dh * Math.sin(th * dl);
    var curtainGeometry = new THREE.PlaneGeometry( 100, 100 );
    var ef = new THREE.Mesh( curtainGeometry ,material);

    ef.position.set(rd * Math.sin(th), y, (-rd * Math.cos(th)));
    scene.add(ef);

    function up() {
        if(dp>-360){
            th = dp * Math.PI /180;
            if(Math.abs(Math.sin(th * dl)) <= 0.0001) {
                dh = 40 + 20 * Math.random();
                dl = 2 + 3 * Math.random();
            }
            y = dh * Math.sin(th * dl);
            ef.position.set(rd * Math.sin(th), y, (-rd * Math.cos(th)));
            ef.rotation.set(0,-th,Math.cos(th * dl)/3);
            dp-=1;
            requestAnimationFrame(up);
        } else {
            scene.remove(ef);
        }
        camera.updateProjectionMatrix();
    }
    requestAnimationFrame(up);
}

function texiao1() {

    if (ws != null || user !== false) {
        var msg = {
            type : 'flowser',
            uid : user
        };
        msg=JSON.stringify(msg);
        ws.send(msg);
    }
    var texture;
    if(textures.flower === undefined){
        texture = new THREE.TextureLoader().load( 'static/img/flower1.png' );
        textures.flower = texture;
    } else {
        texture = textures.flower;
    }
    var Geometry = [];
    var efs = [];
    var rd = 200;
    var material = new THREE.MeshBasicMaterial( {
        map: texture,
        transparent: true,
    } );
    for (var i=-180;i < 180; i+=30){
        Geometry[i] = new THREE.PlaneGeometry( 40, 40 );
        efs[i] = new THREE.Mesh( Geometry[i] ,material);
        var th = i * Math.PI /180;
        efs[i].position.set(rd * Math.sin(th), 0, (-rd * Math.cos(th)));
        efs[i].rotation.set(0,-th,0);
        scene.add(efs[i]);
    }
    setTimeout(function(){
        for (var i=-180;i < 180; i+=30){
            scene.remove(efs[i]);
        }
    },2000);
}


function texiao2(x, y, z) {


    var img = Math.floor(1 + 9 * Math.random());console.log(img);
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
    var dp = 0;
    var h = 0;
    var th = dp * Math.PI /180;
    var dh = 0.5 + 1.5 * Math.random();
    var dz = 100 + 900 * Math.random();
    var rd = 10 + 100 * Math.random();
    var drd = 0.1 + 0.2 * Math.random();
    var f = Math.random() > 0.5 ? true: false;
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


function texiao3() {

    var img = Math.floor(1 + 9 * Math.random());console.log(img);
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
    var x = 0;
    var y = -200;
    var z = -300;
    var efs = [];

    var dp = 0;
    var h = 0;
    var th = dp * Math.PI /180;
    var dh = 0.5 + 1.5 * Math.random();
    var rd = 10 + 100 * Math.random();
    var drd = 0.1 + 0.2 * Math.random();
    var f = (Math.random() > 0.5) ? 1: -1;
    var material = new THREE.MeshBasicMaterial( {
        map: texture,
        transparent: true
    } );
    var Geometry = new THREE.PlaneGeometry(20, 20 );
    var rd1 = Math.sqrt(x*x + z*z);
    var bx,by,bz,dx,dy,dz;

    dx=rd * Math.sin(th);
    dy=h;
    dz=(rd * Math.cos(th));
    for (var i=-180;i < 180; i+=90){
        efs[i] = new THREE.Mesh( Geometry ,material);
        var th1 = i * Math.PI /180;
        bx=rd1 * Math.sin(th1);
        by=y;
        bz= (-rd1 * Math.cos(th1));
        if (i > -90 && i < 90){
            efs[i].position.set(bx+dx,by+dy,bz+dz);
        } else {
            efs[i].position.set(bx-dx,by+dy,bz-dz);
        }

        efs[i].rotation.set(0,-th1,0);
        scene.add(efs[i]);
    }

    var ef = new THREE.Mesh( Geometry ,material);

    scene.add(ef);

    function up() {
        if (h < 400) {
            if(dp<360 && dp>-360){
                th = dp * Math.PI /180;

                dx=rd * Math.sin(th);
                dy=h;
                dz=(rd * Math.cos(th));
                for (var i=-180;i < 180; i+=90){
                    var th1 = i * Math.PI /180;
                    bx=rd1 * Math.sin(th1);
                    by=y;
                    bz= (-rd1 * Math.cos(th1));
                    if (i > -90 && i < 90){
                        efs[i].position.set(bx+dx,by+dy,bz+dz);
                    } else {
                        efs[i].position.set(bx-dx,by+dy,bz-dz);
                    }
                }
                if (f > 0){
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
            for (var i=-180;i < 180; i+=90){
                scene.remove(efs[i]);
            }

            scene.remove(ef);
            efs = undefined;
            texture  = undefined;
            material = undefined;
        }
        camera.updateProjectionMatrix();
    }
    requestAnimationFrame(up);
}


function zan(count){
    if (ws != null || user !== false) {
        var msg = {
            type : 'like',
            uid : user
        };
        msg=JSON.stringify(msg);
        ws.send(msg);
    }
    var num =0;
    var handlr = function(){
        texiao3();
        if(num<=count) {
            setTimeout(handlr,300);
        }
        num++;
    };
    setTimeout(handlr,50);
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

function  showTips(text) {
    var curtains = [],
        texts = [];
    var time = 0;
    var curtainGeometry = new THREE.PlaneGeometry( 490, 50);
    var mesh = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });
    curtains[0] = new THREE.Mesh( curtainGeometry ,mesh);
    curtains[0].position.set(0,240,-360);
    scene.add(curtains[0]);
    curtains[1] = new THREE.Mesh( curtainGeometry ,mesh);
    curtains[1].position.set(-360,240,0);
    curtains[1].rotation.y = Math.PI/2;
    scene.add(curtains[1]);
    curtains[2] = new THREE.Mesh( curtainGeometry ,mesh);
    curtains[2].position.set(0,240,360);
    curtains[2].rotation.y = -Math.PI;
    scene.add(curtains[2]);
    curtains[3] = new THREE.Mesh( curtainGeometry ,mesh);
    curtains[3].position.set(360,240,0);
    curtains[3].rotation.y = -Math.PI/2;
    scene.add(curtains[3]);


    var textGeo = new THREE.TextGeometry(text,{
        size: 30,
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
    var textMaterial = new THREE.MeshBasicMaterial({color:0x000000});        //物体加上材质
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();
    var length = ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

    texts[0] = new THREE.Mesh( textGeo, textMaterial );
    texts[0].position.set(240,220,-359);
    scene.add(texts[0]);
    texts[1] = new THREE.Mesh( textGeo, textMaterial );
    texts[1].position.set(-359,220,-240);
    texts[1].rotation.y = Math.PI/2;
    scene.add(texts[1]);
    texts[2] = new THREE.Mesh( textGeo, textMaterial );
    texts[2].position.set(-240,220,359);
    texts[2].rotation.y = -Math.PI;
    scene.add(texts[2]);
    texts[3] = new THREE.Mesh( textGeo, textMaterial );
    texts[3].position.set(359,220,240);
    texts[3].rotation.y = -Math.PI/2;
    scene.add(texts[3]);
    var end = 240+length;
    function updateTips() {
        time += 1;
        var pos = 240-time;
        if(pos > -end) {
            texts[0].position.x=pos;
            texts[1].position.z=-pos;
            texts[2].position.x=-pos;
            texts[3].position.z=pos;
            window.requestAnimationFrame(updateTips);
        } else {
            scene.remove(texts[0]);
            scene.remove(texts[1]);
            scene.remove(texts[2]);
            scene.remove(texts[3]);
            scene.remove(curtains[0]);
            scene.remove(curtains[1]);
            scene.remove(curtains[2]);
            scene.remove(curtains[3]);
        }
    }
    window.requestAnimationFrame(updateTips);
}

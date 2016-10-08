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
    var length = -1/2 *( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

    texts[0] = new THREE.Mesh( textGeo, textMaterial );
    texts[0].position.set(length,220,-359);
    scene.add(texts[0]);
    texts[1] = new THREE.Mesh( textGeo, textMaterial );
    texts[1].position.set(-359,220,-length);
    texts[1].rotation.y = Math.PI/2;
    scene.add(texts[1]);
    texts[2] = new THREE.Mesh( textGeo, textMaterial );
    texts[2].position.set(-length,220,359);
    texts[2].rotation.y = -Math.PI;
    scene.add(texts[2]);
    texts[3] = new THREE.Mesh( textGeo, textMaterial );
    texts[3].position.set(359,220,length);
    texts[3].rotation.y = -Math.PI/2;
    scene.add(texts[3]);
    function delTips() {
        scene.remove(texts[0]);
        scene.remove(texts[1]);
        scene.remove(texts[2]);
        scene.remove(texts[3]);
        scene.remove(curtains[0]);
        scene.remove(curtains[1]);
        scene.remove(curtains[2]);
        scene.remove(curtains[3]);
    }
    setTimeout(delTips, 1000);


}



var is_voice_init = false;
var is_voice_change = false;
function voice() {
    var op;
    if(!is_voice_init) {
        open_voice();
        is_voice_init = true;
        is_voice_change = true;
        setTimeout(function() {
            is_voice_change = false;
        },10000);
        op = menu.options[3];
        voice_status = !voice_status;
        menu.change_pic(op,'static/img/novoice.png');
        menu.options[3].position.x = op.position.x;
        menu.options[3].position.y = op.position.y;
        menu.options[3].position.z = op.position.z;
        menu.options[3].rotation.x = op.rotation.x;
        menu.options[3].rotation.y = op.rotation.y;
        menu.options[3].rotation.z = op.rotation.z;
        menu.show(scene,eye_controler);
    }
    if (!is_voice_change){
        is_voice_change = true;
        setTimeout(function() {
            is_voice_change = false;
        },2000);
        if (1){
            voice_status = !voice_status;
            op = menu.options[3];
            if (voice_status){
                console.log('start');
                recognizer.postMessage({command: 'start'});
                menu.change_pic(op,'static/img/novoice.png');
            } else {
                console.log('stop');
                recognizer.postMessage({command: 'stop'});
                menu.change_pic(op,'static/img/voice.png');
            }
            menu.options[3].position.x = op.position.x;
            menu.options[3].position.y = op.position.y;
            menu.options[3].position.z = op.position.z;
            menu.options[3].rotation.x = op.rotation.x;
            menu.options[3].rotation.y = op.rotation.y;
            menu.options[3].rotation.z = op.rotation.z;
            menu.show(scene,eye_controler);
        }
    }




}
function playAudio(src) {
    var audio = new Audio();
    audio.src=src;
    audio.play();
    audio.addEventListener('ended',function(){
        audio = null;
    });

}

var item;
function placeItem(data) {
    var     width =  100,
        height =  100,
        x =  300,
        y =  100,
        z =  0,
        pic = "static/img/9.png";
    if (typeof data != "undefined") {
        width =  data.width || 100;
        height =  data.height || 100;
        x =  data.x || 0;
        y =  data.y || 100;
        z =  data.z || -300;
        pic = data.pic || "static/img/9.png";
    }
    var radiu =  Math.sqrt(x * x + z * z);
    var ths = Math.asin(x / radiu);
    var thc = Math.acos(-z / radiu);
    console.log(ths);
    console.log(thc);
    var th;
    if (x >= 0 && z >= 0) {
        th = Math.acos(-z / radiu);
    } else if (x < 0 && z >= 0) {
        th = -Math.acos(-z / radiu);
    } else if (x >= 0 && z < 0) {
        th = Math.asin(x / radiu);
    } else if (x < 0 && z < 0) {
        th = Math.asin(x / radiu);
    }

    item = new THREE.VrMenu();
    item.menu_position.set(x, y, z);
    item.option_margin_x = width;
    item.option_height = height;
    item.option_width = width;
    item.add_option(scene, eye_controler, pic, function (obj) {
        if (ws != null || user !== false) {
            var msg = {
                type : 'finditem',
                uid : user
            };
            msg=JSON.stringify(msg);
            ws.send(msg);
        }
        delItem();
    });
    item.options[0].position.x = x;
    item.options[0].position.y = y;
    item.options[0].position.z = z;
    item.options[0].rotation.y = -th;
    item.show(scene,eye_controler);

}
function delItem() {
    item.remove_option(scene, eye_controler, item.options[0]);
}
function head(data) {
    var box;
    var textMesh;

    function clear(msg) {
        console.log(msg);
        if (ws != null || user !== false) {
            var msgs = {
                type : 'head',
                data : msg,
                uid : user
            };
            msgs=JSON.stringify(msgs);
            ws.send(msgs);
        }
        hc.closeNod();
        hc.closeShook();
        scene.remove(textMesh);
    }

    if (data.title != ""){
        //开启头势
        setTimeout(function(){
            console.log('nod start');
            hc.setNod(function(){
                var msg = "Nod";
                clear(msg);
            });
            hc.setShook(function(){
                var msg = "Shook";
                clear(msg);
            });
        },2000);
        var p,r;
        var eulerZYX = hc.getEulerZYX();
        var eulerYXZ = hc.getEulerYXZ();
        var th = eulerYXZ.y;
        var e;
        p = {
            x:300 * Math.sin(th),
            y:50,
            z:-300 * Math.cos(th)
        };
        r = {
            x:0,
            y:-th,
            z:0
        };

        var textMaterial = new THREE.MultiMaterial( [
            new THREE.MeshPhongMaterial( { color: 0x000000, shading: THREE.FlatShading } ), // front
            new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
        ] );
        var textGeo = new THREE.TextGeometry( data.title, {
            font: font,
            size: 50,
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

        textMesh = new THREE.Mesh( textGeo, textMaterial );
        textMesh.position.x = centerOffset + p.x;
        textMesh.position.y = p.y+50;
        textMesh.position.z = p.z;
        textMesh.rotation.x = r.x;
        textMesh.rotation.y = r.y;
        textMesh.rotation.z = r.z;

        scene.add(textMesh);
    }
}

function addBox(data) {
    var box;
    var textMesh;
    function remove() {
        if (data.title != ""){
            scene.remove(textMesh);
        }

        var len = box.options.length;
        for(var i=0; i<len;i++){
            op = box.options[i];
            box.remove_option(scene, eye_controler, op);
        }
        len = box.options.length;
        for(i=0; i<len;i++){
            op = box.options[i];
            box.remove_option(scene, eye_controler, op);
        }

    }

    box = new THREE.VrMenu();
    box.menu_position.set(0, -50, -300);
    box.option_margin_x = 100;
    for(var i=0;i<data.items.length;i++){
        var ms = data.items[i];
        box.add_text_option(scene, eye_controler, ms, function (obj) {
            console.log(obj.name);
            if (ws != null || user !== false) {
                var msg = {
                    type : 'selectmenu',
                    data : obj.name,
                    uid : user
                };
                msg=JSON.stringify(msg);
                ws.send(msg);
            }
            remove();
        });
        box.options[i].name = ms;
    }
    box.show(scene,eye_controler);

    box.updatePosition(hc);

    if (data.title != ""){
        var l = box.options.length;
        var p, r,index;
        if ((l%2)==0) {
            index = l/2;
            p = {
                x:(box.options[index].position.x + box.options[index-1].position.x)/2,
                y:(box.options[index].position.y + box.options[index-1].position.y)/2,
                z:(box.options[index].position.z + box.options[index-1].position.z)/2
            };
            r = box.options[index].rotation;
        } else {
            index = (l-1)/2;
            p = box.options[index].position;
            r = box.options[index].rotation;
        }
        var textMaterial = new THREE.MultiMaterial( [
            new THREE.MeshPhongMaterial( { color: 0x000000, shading: THREE.FlatShading } ), // front
            new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
        ] );
        var textGeo = new THREE.TextGeometry( data.title, {
            font: font,
            size: 50,
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

        textMesh = new THREE.Mesh( textGeo, textMaterial );
        textMesh.position.x = centerOffset + p.x;
        textMesh.position.y = p.y+50;
        textMesh.position.z = p.z;
        textMesh.rotation.x = r.x;
        textMesh.rotation.y = r.y;
        textMesh.rotation.z = r.z;

        scene.add(textMesh);
    }

}

function changeVideo(src) {
    var video_status = 0;
    var tmpMesh;
    var tmpVideo = document.createElement( 'video' );
    tmpVideo.src = src;
    tmpVideo.setAttribute('crossorigin', 'anonymous');
    tmpVideo.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
    tmpVideo.load();
    tmpVideo.play();
    (function(){
        if (video_status != 1){
            video_status = 1;
            var light_status = 0;
            function black(color){
                color = (color - 2) /255;
                ambientLight.color.setRGB(color,color,color);
            }
            function light(color) {
                color = (color + 2) /255;
                ambientLight.color.setRGB(color,color,color);
            }
            function showVideo() {



                var tmpTexture = new THREE.VideoTexture( tmpVideo );
                tmpTexture.minFilter = THREE.NearestFilter;
                tmpTexture.maxFilter = THREE.NearestFilter;
                tmpTexture.format = THREE.RGBFormat;
                tmpTexture.generateMipmaps = false;

                var tmpGeometry = new THREE.SphereBufferGeometry( 600, 60, 40 ).toNonIndexed();
                tmpGeometry.scale( - 1, 1, 1 );
                var tmpMaterial = new THREE.MeshBasicMaterial( { map: tmpTexture } );
                tmpMesh = new THREE.Mesh( tmpGeometry, tmpMaterial );
                var eulerYXZ = hc.getEulerYXZ();
                var th = eulerYXZ.y - Math.PI / 2;
                tmpMesh.rotation.set(0,th,0);
                scene.add( tmpMesh );
            }
            function preDelVideo() {
                light_status=3;
                requestAnimationFrame(handler);
            }
            function delVideo() {
                scene.remove( tmpMesh );
            }
            tmpVideo.addEventListener('ended',function(){
                preDelVideo();
            });
            var handler = function(){
                var color = ambientLight.color.r * 255;
                if (light_status == 0) {
                    if (color > 10) {
                        black(color);
                        requestAnimationFrame(handler);
                    } else {
                        ambientLight.color.setRGB(0,0,0);
                        showVideo();
                        light_status++;
                        requestAnimationFrame(handler);
                    }
                } else if (light_status == 1) {
                    if (color < 245) {
                        light(color);
                        requestAnimationFrame(handler);
                    } else {
                        ambientLight.color.set(0xffffff);
                        light_status++;
                    }
                } else if (light_status == 3) {
                    if (color > 10) {
                        black(color);
                        requestAnimationFrame(handler);
                    } else {
                        ambientLight.color.setRGB(0,0,0);
                        delVideo();
                        light_status++;
                        requestAnimationFrame(handler);
                    }
                } else if (light_status == 4) {
                    if (color < 245) {
                        light(color);
                        requestAnimationFrame(handler);
                    } else {
                        ambientLight.color.set(0xffffff);
                        light_status = 0;
                        video_status = 0;
                    }
                }
            };
            handler();
        }

    })();

}
function countdown(num) {

    var pointLight = new THREE.PointLight( 0xffffff, 1.5 );
    pointLight.position.set( 0, 100, 90 );
    scene.add( pointLight );

    var colorhash  = "00ffff";
    pointLight.color.setHex( parseInt( colorhash, 16 ) );


    var curtainGeometry = new THREE.PlaneGeometry( 100, 100 );


    var textMaterial = new THREE.MultiMaterial( [
        new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
        new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
    ] );
    var textGeo = new THREE.TextGeometry( num, {

        font: font,

        size: 50,
        height: 0,
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
    var texts = [];
    var curtains = [];
    for (var i=-180;i < 180; i+=90){
        texts[i] = new THREE.Mesh( textGeo, textMaterial );
        curtains[i] = new THREE.Mesh( curtainGeometry ,new THREE.MeshBasicMaterial({
            color: 0x000000
        }));
        var th = i * Math.PI /180;
        texts[i].position.set(350 * Math.sin(th), 150, (-350 * Math.cos(th)));
        texts[i].rotation.set(0,-th,0);
        curtains[i].position.set(399 * Math.sin(th), 200, (-399 * Math.cos(th)));
        curtains[i].rotation.set(0,-th,0);

        scene.add(curtains[i]);
        scene.add(texts[i]);
    }
    var c_do = function(){
        num--;
        for (var i=-180;i < 180; i+=90){
            if(num < 0) {
                scene.remove( texts[i]);
                scene.remove(curtains[i]);
            } else {
                scene.remove(texts[i]);
                var textGeo = new THREE.TextGeometry( num, {
                    font: font,
                    size: 50,
                    height: 0,
                    curveSegments: 4,
                    bevelThickness: 2,
                    bevelSize: 1.5,
                    bevelEnabled: true,
                    material: 0,
                    extrudeMaterial: 1
                });
                textGeo.computeBoundingBox();
                textGeo.computeVertexNormals();
                var th = i * Math.PI /180;
                centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
                texts[i] = new THREE.Mesh( textGeo, textMaterial );
                texts[i].position.set(350 * Math.sin(th), 150, (-350 * Math.cos(th)));
                texts[i].rotation.set(0,-th,0);

                scene.add( texts[i]);
            }
        }
        setTimeout(c_do,1000);
    };
    setTimeout(c_do,1000);

}

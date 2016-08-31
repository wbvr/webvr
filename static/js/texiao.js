function texiao() {
    var texture = new THREE.TextureLoader().load( 'static/img/ship.png' );
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
    var Geometry = [];
    var efs = [];
    var rd = 200;
    var texture = new THREE.TextureLoader().load( 'static/img/flower.png' );
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


function texiao3() {
    var x = 0;
    var y = -200;
    var z = -300;
    var efs = [];

    var dp = 0;
    var h = 0;
    var th = dp * Math.PI /180;
    var dh = 0.5 + 1.5 * Math.random();
    var dz1 = 100 + 900 * Math.random();
    var rd = 10 + 100 * Math.random();
    var drd = 0.1 + 0.2 * Math.random();
    var f = (Math.random() > 0.5) ? 1: -1;
    var img = Math.floor(1 + 9 * Math.random());
    var texture = new THREE.TextureLoader().load( 'static/img/' + img + '.png' );
    var material = new THREE.MeshBasicMaterial( {
        map: texture,
        transparent: true
    } );
    var Geometry = new THREE.PlaneGeometry(20, 20 );
    var rd1 = Math.sqrt(x*x + z*z);
    var bx,by,bz,dx,dy,dz;

    dx=rd * Math.sin(th);
    dy=h;
    dz=(rd * Math.cos(th))/dz1 ;
    for (var i=-180;i < 180; i+=60){
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
                dz=(rd * Math.cos(th))/dz1 ;
                for (var i=-180;i < 180; i+=60){
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
            for (var i=-180;i < 180; i+=60){
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
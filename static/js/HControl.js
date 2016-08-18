/*
 * head control
 *
 */
var time=0;

function HControl() {
    this.isMonitor = false;        //总开关
    this.stats = {
        nod:false,
        shook:false,
        rock:false
    };
    this.callback = {
        nod:false,
        shook:false,
        rock:false
    };
    this.shiftList = {x:[], y:[], z:[], t:[]};
    this.pre = new THREE.Quaternion();
    this.num = 0;
    this.type = 0;  //1.点头、2.摇头、3.摆头
}

HControl.prototype.do = function(orientation){
    if (this.isMonitor){
        this.Q2E(orientation);      //转换
        this.judge();               //判定
        if (this.type !=0 && this.num > 4){
            switch (this.type){
                case 1:
                    if (this.stats.nod) {
                        this.callback.nod();
                    }
                    break;
                case 2:
                    if (this.stats.shook) {
                        this.callback.shook();
                    }
                    break;
                case 3:
                    if (this.stats.rock) {
                        this.callback.rock();
                    }
                    break;
            }
            this.clean();
        }
    }
};

HControl.prototype.Q2E = function(o) {
    var q = new THREE.Quaternion();
    var time = new Date();
    q.fromArray(o);
    if (this.pre.x != 0 || this.pre.y != 0 || this.pre.z != 0){
        this.pre.inverse().multiply(q);
        var e = new THREE.Euler();
        e.setFromQuaternion(this.pre);
        this.shiftList.x.unshift((e.x * 180) / Math.PI);
        this.shiftList.y.unshift((e.y * 180) / Math.PI);
        this.shiftList.z.unshift((e.z * 180) / Math.PI);
        this.shiftList.t.unshift(time);
    }
    this.pre.fromArray(o);
};

HControl.prototype.judge = function() {
    if (this.shiftList.x.length < 20) {
        return false;
    }

    //sum
    var X = eval(this.shiftList.x.join("+"));
    var Y = eval(this.shiftList.y.join("+"));
    var Z = eval(this.shiftList.z.join("+"));

    //aver
    var aX = Math.abs(X / this.shiftList.x.length);
    var aY = Math.abs(Y / this.shiftList.y.length);
    var aZ = Math.abs(Z / this.shiftList.z.length);

    this.shiftList.x.pop();
    this.shiftList.y.pop();
    this.shiftList.z.pop();
    this.shiftList.t.pop();

    if (aX < 2 && aY < 2 && aZ < 2){
        this.num = 0;
        this.type = 0;
        return false;
    }
    if (aX > aY && aX > aZ) {
        if (this.type == 1) {
            this.num++;
        } else {
            this.num = 1;
            this.type = 1;
        }
    }
    if (aY > aX && aY > aZ) {
        if (this.type == 2) {
            this.num++;
        } else {
            this.num = 1;
            this.type = 2;
        }
    }
    if (aZ > aX && aZ > aY) {
        if (this.type == 3) {
            this.num++;
        } else {
            this.num = 1;
            this.type = 3;
        }
    }
};

HControl.prototype.open = function(){
    this.isMonitor = true;
    this.shiftList.x.length = 0;
    this.shiftList.y.length = 0;
    this.shiftList.z.length = 0;
    this.shiftList.t.length = 0;
    this.pre.fromArray([0,0,0,1]);
};

HControl.prototype.close = function(){
    this.isMonitor = false;
    this.shiftList.x.length = 0;
    this.shiftList.y.length = 0;
    this.shiftList.z.length = 0;
    this.shiftList.t.length = 0;
    this.pre.fromArray([0,0,0,1]);
};

HControl.prototype.clean = function(){
    this.shiftList.x.length = 0;
    this.shiftList.y.length = 0;
    this.shiftList.z.length = 0;
    this.shiftList.t.length = 0;
    this.pre.fromArray([0,0,0,1]);
    this.num = 0;
    this.type = 0;
};

HControl.prototype.setNod = function(callback){
    if (typeof callback !== 'function') {
        console.warn('callback is not function');
    }
    if (!this.isMonitor) {
        this.open();
    }
    this.stats.nod = true;
    this.callback.nod = callback;
};
HControl.prototype.closeNod = function(){
    if (!this.isMonitor) {
        this.open();
    }
    this.stats.nod = false;
    this.callback.nod = false;
    if (!this.stats.nod && !this.stats.shook && !this.stats.rock) {
        this.close();
    }
};

HControl.prototype.setShook = function(callback){
    if (typeof callback !== 'function') {
        console.warn('callback is not function');
    }
    if (!this.isMonitor) {
        this.open();
    }
    this.stats.shook = true;
    this.callback.shook = callback;
};
HControl.prototype.closeShook = function(){

    if (!this.isMonitor) {
        this.open();
    }
    this.stats.shook = false;
    this.callback.shook = false;
    if (!this.stats.nod && !this.stats.shook && !this.stats.rock) {
        this.close();
    }
};

HControl.prototype.setRock = function(callback){
    if (typeof callback !== 'function') {
        console.warn('callback is not function');
    }
    if (!this.isMonitor) {
        this.open();
    }
    this.stats.rock = true;
    this.callback.rock = callback;
};
HControl.prototype.closeRock = function(){
    if (!this.isMonitor) {
        this.open();
    }
    this.stats.rock = false;
    this.callback.rock = false;
    if (!this.stats.nod && !this.stats.shook && !this.stats.rock) {
        this.close();
    }
};

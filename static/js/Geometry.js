/**
 * Created by zongwen1 on 16-8-30.
 */
(function (THREE) {
    THREE.triangleGeometry = function (size) {
        this.size = size;
        var geometry = new THREE.Geometry();

        geometry.vertices.push(
            new THREE.Vector3( -1*this.size,  this.size, 0 ),
            new THREE.Vector3( -1*this.size,  -1*this.size, 0 ),
            new THREE.Vector3( this.size,  -1*this.size, 0 )
        );

        geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

        geometry.computeBoundingSphere();

        return geometry;
    };

    THREE.triangleGeometry.prototype = {
        constructor: THREE.triangleGeometry,

    };

}(THREE));

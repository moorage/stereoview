var defaultPointSize = 0.02;
// Default Level of Detail
var defaultLOD = 10000;
var pointcloudPath = "/js/scene/cloud.js";
// var pointcloudPath = "/js/scene/out1.ply"; // potree can't read .ply files 
   


var renderer;
var camera;
var scene;
var pointcloud;
var pointcloudMaterial;

function buildAxis( src, dst, colorHex, dashed ) {
  var geom = new THREE.Geometry(),
    mat; 

  if(dashed) {
    mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
  } else {
    mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
  }

  geom.vertices.push( src.clone() );
  geom.vertices.push( dst.clone() );
  geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

  var axis = new THREE.Line( geom, mat, THREE.LinePieces );
  return axis;
}

function buildAxes( length ) {
  var axes = new THREE.Object3D();

  axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
  axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
  axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
  axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
  axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
  axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

  return axes;

}
  
function init(){
  scene = new THREE.Scene();
	axes = buildAxes( 1000 );
	scene.add( axes );
  
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100000);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // camera and controls
  camera.position.set(-1, 2, 3);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0 );
  camera.lookAt(controls.target);

  // load pointcloud
  var pco = POCLoader.load(pointcloudPath);
  pointcloudMaterial = new THREE.PointCloudMaterial( { size: defaultPointSize, vertexColors: true } );
  pointcloud = new Potree.PointCloudOctree(pco, pointcloudMaterial);
  scene.add(pointcloud);

  pointcloud.LOD = defaultLOD;
  
  // Un-Flip y axis
  // pointcloud.applyMatrix(new THREE.Matrix4().set(
  //     1,0,0,0,
  //     0,-1,0,0,
  //     0,0,1,0,
  //     0,0,0,1
  // ));
  
  // Un-Flip y and z
  // pointcloud.applyMatrix(new THREE.Matrix4().set(
  //     1,0,0,0,
  //     0,0,1,0,
  //     0,1,0,0,
  //     0,0,0,1
  // ));
  
  // pointcloud.rotation.set(Math.PI/2, 0.85* -Math.PI/2, -0.0);
  //pointcloud.moveToOrigin();
  // pointcloud.moveToGroundPlane();

}

function render() {
  requestAnimationFrame(render);

  pointcloud.update(camera);

  renderer.render(scene, camera);
};

init();
render();
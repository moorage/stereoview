var defaultPointSize = 0.03;
var defaultLOD = 15;
var pointcloudPath = "/js/scene/cloud.js";
// var pointcloudPath = "/js/scene/out1.ply"; // potree can't read .ply files =[
   


var renderer;
var camera;
var scene;
var pointcloud;
var pointcloudMaterial;


function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // camera and controls
  camera.position.set(1, 7, 7);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 4, 0 );
  camera.lookAt(controls.target);

  // load pointcloud
  var pco = POCLoader.load(pointcloudPath);
  pointcloudMaterial = new THREE.PointCloudMaterial( { size: defaultPointSize, vertexColors: true } );
  pointcloud = new Potree.PointCloudOctree(pco, pointcloudMaterial);
  scene.add(pointcloud);

  pointcloud.LOD = defaultLOD;
  pointcloud.rotation.set(Math.PI/2, 0.85* -Math.PI/2, -0.0);
  pointcloud.moveToOrigin();
  pointcloud.moveToGroundPlane();

}

function render() {
  requestAnimationFrame(render);

  pointcloud.update(camera);

  renderer.render(scene, camera);
};

init();
render();
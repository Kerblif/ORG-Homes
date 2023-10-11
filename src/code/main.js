import * as THREE from 'three';

import { MapControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

let camera, controls, scene, renderer, raycaster, pointer;
let intersectObjects;

init();
animate();

function init() {
  // scene init

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcccccc);
  scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

  // renderer init

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // camera init

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 200, - 400);

  // controls

  controls = new MapControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;

  controls.minDistance = 100;
  controls.maxDistance = 500;

  controls.maxPolarAngle = Math.PI / 2;

  // world
  const loader = new GLTFLoader();

  raycaster = new THREE.Raycaster();

  intersectObjects = []

  loader.load('./src/bin/models/khrushchevka/scene.gltf', function (gltf) {

    const model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);
    scene.add(model);
    intersectObjects.push(model)
  }, undefined, function (e) {

    console.error(e);

  });

  loader.load('./src/bin/models/brejnevka/brejnevka.glb', function (gltf) {

    const model = gltf.scene;
    model.position.set(300, 0, 0);
    model.scale.set(1, 1, 1);
    scene.add(model);
    intersectObjects.push(model)
  }, undefined, function (e) {

    console.error(e);

  });

  loader.load('./src/bin/models/brejnevka-2/brejnevka.glb', function (gltf) {

    const model = gltf.scene;
    model.position.set(300, 0, 100);
    model.scale.set(1, 1, 1);
    scene.add(model);
    intersectObjects.push(model)
  }, undefined, function (e) {

    console.error(e);

  });

  loader.load('./src/bin/models/panel-house/panel.glb', function (gltf) {

    const model = gltf.scene;
    model.position.set(-300, 0, 0);
    model.scale.set(4, 4, 4);
    scene.add(model);
    intersectObjects.push(model)
  }, undefined, function (e) {

    console.error(e);

  });

  loader.load('./src/bin/models/soviet-house/soviet.glb', function (gltf) {

    const model = gltf.scene;
    model.position.set(400, 0, 0);
    model.scale.set(10, 10, 10);
    scene.add(model);
    intersectObjects.push(model)
  }, undefined, function (e) {

    console.error(e);

  });

  // lights

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
  dirLight1.position.set(1, 1, 1);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xffcc33, 1);
  dirLight2.position.set(2, 5, -1);
  scene.add(dirLight2);

  const ambientLight = new THREE.AmbientLight(0x555555);
  scene.add(ambientLight);

  // resize listener

  window.addEventListener('resize', onWindowResize);

  pointer = new THREE.Vector2();
  document.addEventListener('mousemove', onPointerMove);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerMove(event) {

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

}

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  render();
}

function render() {
  raycaster.setFromCamera(pointer, camera);
  var intersects = raycaster.intersectObjects(intersectObjects, false);

  console.log(intersects)

  renderer.render(scene, camera);
}
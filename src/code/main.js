import * as THREE from 'three';

import { MapControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextGeometry } from 'three/src/geometries/TextGeometry';
import { FontLoader } from 'three/src/loaders/FontLoader';

let camera, controls, scene, renderer, pointer;

var info_btn = document.getElementsByTagName("button")[0];
var info_text = document.getElementById("info-text");
info_text.hidden = true;

var pos = 0
var globalScale = 3

var font = null;

var models = {
  "1-464": {
    height: 12.5,
    name: "1-464"
  },
  "1-515": {
    height: 13.2,
    name: "1-515"
  },
  "111-83": {
    height: 23.85,
    name: "111-83"
  },
  "II\ 68-03": {
    height: 29.76,
    name: "II-68-03"
  },
  "II-18": {
    height: 30.0,
    name: "II-18"
  },
  "II-57": {
    height: 31.68,
    name: "II-57"
  },
  "II-68-04": {
    height: 29.76,
    name: "II-68-04"
  },
  "KOPE-80": {
    height: 58.52,
    name: "КОПЭ-80"
  }
}

function gltfLoad (gltf) {
  const model = gltf.scene;
  let modelName = gltf.parser.options.path.split('/').slice(-2)[0]

  let bbox = new THREE.Box3().setFromObject(model);
  let size = bbox.getSize(new THREE.Vector3());
  let scale = models[modelName]["scale"] = models[modelName]["height"] / size.y * globalScale
  models[modelName]["pos"] = pos + size.x * scale / 2;

  let textGeom = new TextGeometry( models[modelName]["name"], {
      font: font,
      size: 10,
      height: 5
    } );
    const textMaterial = new THREE.MeshFaceMaterial([
      new THREE.MeshPhongMaterial({
        color: 0xff22cc,
        flatShading: true,
      }), // front
      new THREE.MeshPhongMaterial({
        color: 0xffcc22
      }), // side
  ])
  const textMesh = new THREE.Mesh(textGeom, textMaterial)

  let textBbox = new THREE.Box3().setFromObject(textMesh);
  let textSize = textBbox.getSize(new THREE.Vector3());

  textMesh.rotateY(Math.PI)
  textMesh.rotateX(-Math.PI / 2)

  textMesh.position.set(models[modelName]["pos"] + textSize.x / 2, 0, -80);
  model.position.set(models[modelName]["pos"], 0, 0);

  pos += 100 + size.x * scale

  model.scale.set(scale, scale, scale);

  model.rotateY(Math.PI)
  scene.add(model);
  scene.add(textMesh);

  console.log("%s spawned at %f", modelName, models[modelName]["pos"])
}

function errorCatcher(e) {

  console.error(e);

}

info_btn.addEventListener("click", infoButtonClick, false);

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

  const fontLoader = new FontLoader();

  fontLoader.load(
    // resource URL
    '/src/bin/fonts/hse-sans/HSESans.json',
  
    // onLoad callback
    function ( f ) {
      // do something with the font
      font = f
    },
  
    // onProgress callback
    function ( xhr ) {
      console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    },
  
    // onError callback
    function ( err ) {
      console.log( 'An error happened' );
    }
  );

  // world
  const loader = new GLTFLoader();

  loader.load('./src/bin/models/1-464/model.gltf', gltfLoad, undefined, errorCatcher);
  loader.load('./src/bin/models/1-515/model.gltf', gltfLoad, undefined, errorCatcher);
  loader.load('./src/bin/models/111-83/model.glb', gltfLoad, undefined, errorCatcher);
  loader.load('./src/bin/models/II\ 68-03/model.gltf', gltfLoad, undefined, errorCatcher);
  loader.load('./src/bin/models/II-18/model.gltf', gltfLoad, undefined, errorCatcher);
  loader.load('./src/bin/models/II-57/model.gltf', gltfLoad, undefined, errorCatcher);
  loader.load('./src/bin/models/II-68-04/model.glb', gltfLoad, undefined, errorCatcher);
  loader.load('./src/bin/models/KOPE-80/model.gltf', gltfLoad, undefined, errorCatcher);

  // lights

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
  dirLight1.position.set(1, 1, 1);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xffcc33, 1);
  dirLight2.position.set(2, 5, -1);
  scene.add(dirLight2);

  const dirLight3 = new THREE.DirectionalLight(0xffcc33, 1);
  dirLight3.position.set(2, -5, -1);
  scene.add(dirLight3);

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
  document.getElementById("coords").textContent = `Координаты камеры: (${camera.position.x.toFixed(2)};${camera.position.y.toFixed(2)};${camera.position.z.toFixed(2)})`;

  var d1 = new THREE.Vector3();
  var d2 = new THREE.Vector3();
  var d3 = new THREE.Vector3();
  var d4 = new THREE.Vector3();

  d1.subVectors(camera.position, new THREE.Vector3(0, 0, 0))
  d2.subVectors(camera.position, new THREE.Vector3(400, 0, 0))
  d3.subVectors(camera.position, new THREE.Vector3(-400, 0, 0))
  d4.subVectors(camera.position, new THREE.Vector3(0, 200, -400))

  d1 = d1.length()
  d2 = d2.length()
  d3 = d3.length()
  d4 = d4.length() * 5

  switch (Math.min(d1, d2, d3, d4)) {
    case d1:
      document.getElementById("title").textContent = 'Хрущевка'
      document.getElementById("info-text").textContent = "Начался рост населения в стране, жилья катастрофически стало не хватать. По настоящему серьезно за этот вопрос взялся Никита Сергеевич Хрущев, его «хрущёвки» 1958-1974 годов были по настоящему типовым массовым строительством на все территории СССР. Эти дома были 2-3, 4-5 или 8-10 этажей (Москва). Стиль этих домов называется в архитектуре «функционализм». Всё в таком доме направлено на удешевление строительства при хорошем качестве (дома первых серий до сих пор стоят во многих городах). Важным являлось быстрота возведения – дома собирали из готовых блоков-кубиков, отлитых и собранных уже на домостроительных комбинатах. К концу 1963 года в стране жилищный фонд составил 1184 млн.кв.м.";
      break
    case d2:
      document.getElementById("title").textContent = 'Брежневка'
      document.getElementById("info-text").textContent = "В 1964 году к власти в СССР пришёл Леонид Ильич Брежнев. В правительстве был поднят вопрос об улучшении качества строительства массового жилья для населения. Как результат - началось строительство в период до 1980 года панельных и кирпичных 9-17 этажных жилых домов. Улучшилась отделка, стали выше потолки (2,7 метра), количество вариантов «брежневок», в отличии от 7-9 видов «хрущевок», возросло до 40(!). Появились лифты, мусоропроводы, стали шири лестничные пролёты, был принят новый каталог строительных деталей и элементов, что позволяло так же строить быстро и достаточно дешево. В период правления Брежнева с 1964-1982 год было построено в стране свыше 2 миллиардов квадратных метров жилья. Это строительство тоже можно назвать типовым. В фильме «Ирония судьбы, или С легким паром!» как раз обыгрывается ситуация, когда одинаковая застройка в Москве и Ленинграде поставила в комическую ситуацию главного героя, когда он перепутал города(!), но своим ключом смог открыть чужую квартиру в типовом квартале. Целые кварталы были похожи друг на друга в разных уголках страны, всё было унифицировано и типизировано в жилищной строительной сфере.";
      break
    case d3:
      document.getElementById("title").textContent = 'Хрущевка'
      document.getElementById("info-text").textContent = "Начался рост населения в стране, жилья катастрофически стало не хватать. По настоящему серьезно за этот вопрос взялся Никита Сергеевич Хрущев, его «хрущёвки» 1958-1974 годов были по настоящему типовым массовым строительством на все территории СССР. Эти дома были 2-3, 4-5 или 8-10 этажей (Москва). Стиль этих домов называется в архитектуре «функционализм». Всё в таком доме направлено на удешевление строительства при хорошем качестве (дома первых серий до сих пор стоят во многих городах). Важным являлось быстрота возведения – дома собирали из готовых блоков-кубиков, отлитых и собранных уже на домостроительных комбинатах. К концу 1963 года в стране жилищный фонд составил 1184 млн.кв.м.";
      break
    case d4:
      document.getElementById("title").textContent = 'Типовая застройка'
      document.getElementById("info-text").textContent = "На самой заре развития человечества, используя примитивные орудия труда и физическую силу, люди возводили типовые строения в разных частях Земного шара. Это были и пирамиды, как египетские, так и пирамиды майя, дольмены, юрты, помпезные римские типовые арены и скандинавские приземистые домики с крышей, покрытой дёрном. В двадцатом веке в Советском союзе в период пятидесятых-восьмидесятых годов продолжилась типовая застройка как жилыми, так и промышленными, а также культурными объектами. У всех у нас на слуху такие названия типовых жилых домов как «сталинские», «хрущевские», «брежневские». Их названия привязаны к периоду нахождения у власти в партии и у руля государства генеральных секретарей, которые принимали решение возводить те или иные объекты в массовом количестве. Что можно назвать типовой застройкой? Типовая застройка – это множество зданий и сооружений, построенных по одному проекту в определенный период времени с использованием одинаковых материалов, с повторяющимся внешним видом, а также с одинаковой планировкой внутри.";
      break
  }

  renderer.render(scene, camera);
}

function infoButtonClick(e) {
  console.log(info_text.hidden)
  if (info_text.hidden) {
    info_text.hidden = false;
    info_text.style.display = "block";
    info_btn.innerText = "Скрыть информацию о здании";
  } else {
    info_btn.innerText = "Показать информацию о здании";
    info_text.hidden = true;
    info_text.style.display = "none";
  }
}
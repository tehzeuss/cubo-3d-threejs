import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import './style.css';

// Cena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcfd8dc);

// Câmera perspectiva
const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(6, 4.2, 7);

// Renderizador
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

document.body.appendChild(renderer.domElement);

// Controles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.target.set(0, 1.7, 0);
controls.maxDistance = 12;
controls.minDistance = 3;

// Materiais
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0xb79f7a,
  roughness: 0.78,
  metalness: 0.02,
});

const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0xe8e2d8,
  roughness: 0.9,
});

const baseboardMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.65,
});

const tableMaterial = new THREE.MeshStandardMaterial({
  color: 0x6b3f24,
  roughness: 0.48,
  metalness: 0.05,
});

const cubeMaterial = new THREE.MeshStandardMaterial({
  color: 0x1d4ed8,
  roughness: 0.32,
  metalness: 0.18,
});

const cubeEdgeMaterial = new THREE.LineBasicMaterial({
  color: 0xdbeafe,
});

// Luz ambiente mais suave
const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

// Luz do sol entrando na sala
const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
sunLight.position.set(-4, 7, 5);
sunLight.castShadow = true;

sunLight.shadow.mapSize.width = 4096;
sunLight.shadow.mapSize.height = 4096;

sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 30;
sunLight.shadow.camera.left = -10;
sunLight.shadow.camera.right = 10;
sunLight.shadow.camera.top = 10;
sunLight.shadow.camera.bottom = -10;

scene.add(sunLight);

// Luz quente interna
const roomLight = new THREE.PointLight(0xffe4b5, 0.9, 10);
roomLight.position.set(0, 4.5, 1.5);
roomLight.castShadow = true;
scene.add(roomLight);

// Chão
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 12),
  floorMaterial
);

floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Linhas simulando piso de madeira
for (let i = -5.5; i <= 5.5; i += 0.8) {
  const floorLine = new THREE.Mesh(
    new THREE.BoxGeometry(0.015, 0.01, 12),
    new THREE.MeshStandardMaterial({
      color: 0x8b7357,
      roughness: 0.9,
    })
  );

  floorLine.position.set(i, 0.012, 0);
  floorLine.receiveShadow = true;
  scene.add(floorLine);
}

// Parede fundo
const backWall = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 6),
  wallMaterial
);

backWall.position.set(0, 3, -6);
backWall.receiveShadow = true;
scene.add(backWall);

// Parede esquerda
const leftWall = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 6),
  wallMaterial
);

leftWall.position.set(-6, 3, 0);
leftWall.rotation.y = Math.PI / 2;
leftWall.receiveShadow = true;
scene.add(leftWall);

// Rodapé parede fundo
const backBaseboard = new THREE.Mesh(
  new THREE.BoxGeometry(12, 0.18, 0.08),
  baseboardMaterial
);

backBaseboard.position.set(0, 0.1, -5.96);
backBaseboard.castShadow = true;
backBaseboard.receiveShadow = true;
scene.add(backBaseboard);

// Rodapé parede esquerda
const leftBaseboard = new THREE.Mesh(
  new THREE.BoxGeometry(12, 0.18, 0.08),
  baseboardMaterial
);

leftBaseboard.position.set(-5.96, 0.1, 0);
leftBaseboard.rotation.y = Math.PI / 2;
leftBaseboard.castShadow = true;
leftBaseboard.receiveShadow = true;
scene.add(leftBaseboard);

// Mesa - tampo
const tableTop = new THREE.Mesh(
  new THREE.BoxGeometry(4.2, 0.28, 2.6),
  tableMaterial
);

tableTop.position.set(0, 1.55, 0);
tableTop.castShadow = true;
tableTop.receiveShadow = true;
scene.add(tableTop);

// Detalhe frontal da mesa
const tableFrontDetail = new THREE.Mesh(
  new THREE.BoxGeometry(4.3, 0.18, 0.12),
  tableMaterial
);

tableFrontDetail.position.set(0, 1.34, 1.32);
tableFrontDetail.castShadow = true;
tableFrontDetail.receiveShadow = true;
scene.add(tableFrontDetail);

// Pernas da mesa
function createTableLeg(x, z) {
  const leg = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 1.5, 0.28),
    tableMaterial
  );

  leg.position.set(x, 0.75, z);
  leg.castShadow = true;
  leg.receiveShadow = true;
  scene.add(leg);
}

createTableLeg(-1.85, -1.05);
createTableLeg(1.85, -1.05);
createTableLeg(-1.85, 1.05);
createTableLeg(1.85, 1.05);

// Cubo em cima da mesa
const cubeGeometry = new THREE.BoxGeometry(1.15, 1.15, 1.15);
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

cube.position.set(0, 2.27, 0);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

// Bordas do cubo
const cubeEdges = new THREE.EdgesGeometry(cubeGeometry);
const cubeLine = new THREE.LineSegments(cubeEdges, cubeEdgeMaterial);
cube.add(cubeLine);

// Pequena sombra/base de contato embaixo do cubo
const cubeBaseShadow = new THREE.Mesh(
  new THREE.CircleGeometry(0.9, 48),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.18,
  })
);

cubeBaseShadow.rotation.x = -Math.PI / 2;
cubeBaseShadow.position.set(0, 1.705, 0);
scene.add(cubeBaseShadow);

// Quadro na parede
const frameOuter = new THREE.Mesh(
  new THREE.BoxGeometry(2.4, 1.5, 0.08),
  new THREE.MeshStandardMaterial({
    color: 0x3a2a1d,
    roughness: 0.55,
  })
);

frameOuter.position.set(1.7, 3.45, -5.95);
frameOuter.castShadow = true;
scene.add(frameOuter);

const frameInner = new THREE.Mesh(
  new THREE.BoxGeometry(2.0, 1.1, 0.09),
  new THREE.MeshStandardMaterial({
    color: 0xa7c7e7,
    roughness: 0.7,
  })
);

frameInner.position.set(1.7, 3.45, -5.89);
scene.add(frameInner);

// Janela na parede esquerda
const windowFrame = new THREE.Mesh(
  new THREE.BoxGeometry(0.08, 2.2, 2.4),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
  })
);

windowFrame.position.set(-5.95, 3.25, -2.1);
windowFrame.rotation.y = Math.PI / 2;
windowFrame.castShadow = true;
scene.add(windowFrame);

const windowGlass = new THREE.Mesh(
  new THREE.PlaneGeometry(2.1, 1.9),
  new THREE.MeshStandardMaterial({
    color: 0x9bd3ff,
    transparent: true,
    opacity: 0.45,
    roughness: 0.05,
    metalness: 0.1,
  })
);

windowGlass.position.set(-5.9, 3.25, -2.1);
windowGlass.rotation.y = Math.PI / 2;
scene.add(windowGlass);

// Tapete
const carpet = new THREE.Mesh(
  new THREE.PlaneGeometry(5.2, 3.3),
  new THREE.MeshStandardMaterial({
    color: 0x6b7280,
    roughness: 0.95,
  })
);

carpet.rotation.x = -Math.PI / 2;
carpet.position.set(0, 0.018, 0.45);
carpet.receiveShadow = true;
scene.add(carpet);

// Luminária simples no teto
const lampCable = new THREE.Mesh(
  new THREE.CylinderGeometry(0.025, 0.025, 0.8, 24),
  new THREE.MeshStandardMaterial({
    color: 0x222222,
  })
);

lampCable.position.set(0, 5.2, 1.5);
scene.add(lampCable);

const lampShade = new THREE.Mesh(
  new THREE.ConeGeometry(0.55, 0.5, 32, 1, true),
  new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.55,
    side: THREE.DoubleSide,
  })
);

lampShade.position.set(0, 4.65, 1.5);
lampShade.rotation.x = Math.PI;
lampShade.castShadow = true;
scene.add(lampShade);

// Animação
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.003;
  cube.rotation.y += 0.006;

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Responsividade
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
// main.js

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 3, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const directionalLight = new THREE.DirectionalLight(0xffd699, 1.2);
directionalLight.position.set(30, 50, -10);
scene.add(directionalLight);
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

// Ground
const groundTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sand/sand1.jpg');
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(50, 50);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ map: groundTexture })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Water
const waterGeometry = new THREE.PlaneGeometry(15, 7);
const waterNormals = new THREE.TextureLoader().load('https://threejs.org/examples/textures/waternormals.jpg', function (texture) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
});

const water = new THREE.Water(waterGeometry, {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: waterNormals,
  alpha: 0.8,
  sunDirection: directionalLight.position.clone().normalize(),
  sunColor: 0xffffff,
  waterColor: 0x0066cc,
  distortionScale: 4.5,
  fog: scene.fog !== undefined,
});
water.rotation.x = -Math.PI / 2;
water.position.set(-7, 1, 0);
scene.add(water);

// Stickman
const stickman = new THREE.Group();
const mat = new THREE.MeshStandardMaterial({ color: 0x000000 });

const head = new THREE.Mesh(new THREE.SphereGeometry(0.35), mat);
head.position.y = 1.8;
stickman.add(head);

const body = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 1.0), mat);
body.position.y = 1.05;
stickman.add(body);

const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7), mat);
leftArm.position.set(-0.4, 1.4, 0);
leftArm.rotation.z = Math.PI / 5;
stickman.add(leftArm);

const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7), mat);
rightArm.position.set(0.4, 1.4, 0);
rightArm.rotation.z = -Math.PI / 5;
stickman.add(rightArm);

const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.85), mat);
leftLeg.position.set(-0.17, 0.3, 0);
stickman.add(leftLeg);

const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.85), mat);
rightLeg.position.set(0.17, 0.3, 0);
stickman.add(rightLeg);

stickman.position.set(-7, 0.5, 0);
scene.add(stickman);

// Controls
const runButton = document.getElementById("runButton");
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
if (isMobile) runButton.style.display = "block";

let run = false, speed = 0.1, angle = 0;

runButton.addEventListener("touchstart", e => { e.preventDefault(); run = true; });
runButton.addEventListener("touchend", e => { e.preventDefault(); run = false; });

document.addEventListener("keydown", e => { if (e.key === "ArrowRight") run = true; });
document.addEventListener("keyup", e => { if (e.key === "ArrowRight") run = false; });

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  water.material.uniforms.time.value += 1.0 / 60.0;

  if (run) {
    angle += 0.15;
    stickman.position.x += speed;
    camera.position.x += speed;
    water.position.x += speed * 0.9;
  }

  if (water.position.x > stickman.position.x - 1.5) {
    alert("The tsunami caught you!");
    location.reload();
  }

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

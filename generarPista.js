// Escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Iluminación
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// Crear pista
const trackLength = 100;
const trackWidth = 20;
const trackGeometry = new THREE.PlaneGeometry(trackLength, trackWidth);
const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
const track = new THREE.Mesh(trackGeometry, trackMaterial);
track.rotation.x = -Math.PI / 2;
scene.add(track);

// Agregar líneas de separación de carriles
const lineMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const lineWidth = 0.2; // Ancho de cada línea
const numHorses = 5; // Número de caballos (también define los carriles)

for (let i = 1; i < numHorses; i++) {
    const lineGeometry = new THREE.PlaneGeometry(trackLength, lineWidth);
    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    line.rotation.x = -Math.PI / 2;
    line.position.set(0, 0.02, (i - numHorses / 2) * 4); // Espaciado entre líneas
    scene.add(line);
}

// Línea de meta
const finishLineGeometry = new THREE.PlaneGeometry(1, trackWidth);
const finishLineMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const finishLine = new THREE.Mesh(finishLineGeometry, finishLineMaterial);
finishLine.rotation.x = -Math.PI / 2;
finishLine.position.set(trackLength / 2 - 2, 0.01, 0);
scene.add(finishLine);
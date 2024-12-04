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

// Agregar líneas de espacio avanzado a lo largo de la pista
const spaceLineMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const spaceLineWidth = 0.1; // Ancho muy fino
const spaceLineLength = trackWidth;
const spaceLineSpacing = 10; // Espaciado entre líneas de espacio avanzado

for (let i = 1; i < trackLength / spaceLineSpacing; i++) {
    const spaceLineGeometry = new THREE.PlaneGeometry(spaceLineWidth, spaceLineLength);
    const spaceLine = new THREE.Mesh(spaceLineGeometry, spaceLineMaterial);
    spaceLine.rotation.x = -Math.PI / 2;
    spaceLine.position.set(-trackLength / 2 + i * spaceLineSpacing, 0.01, 0);
    scene.add(spaceLine);
}

// Crear números de carril en el suelo
const numberMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const numberSize = 2; // Tamaño de los números

for (let i = 0; i < numHorses; i++) {
    const laneNumber = (i + 1).toString();
    const numberGeometry = new THREE.PlaneGeometry(numberSize, numberSize);
    const numberTexture = new THREE.CanvasTexture(createNumberTexture(laneNumber));
    const numberMaterialInstance = new THREE.MeshStandardMaterial({ map: numberTexture });

    // Número al principio del carril
    const numberMeshStart = new THREE.Mesh(numberGeometry, numberMaterialInstance);
    numberMeshStart.rotation.x = -Math.PI / 2;
    numberMeshStart.position.set(-trackLength / 2 + 2, 0.01, (i - numHorses / 2) * 4 + 2);
    scene.add(numberMeshStart);

    // Número al final del carril
    const numberMeshEnd = new THREE.Mesh(numberGeometry, numberMaterialInstance);
    numberMeshEnd.rotation.x = -Math.PI / 2;
    numberMeshEnd.position.set(trackLength / 2 - 4, 0.01, (i - numHorses / 2) * 4 + 2);
    scene.add(numberMeshEnd);
}

// Función para crear la textura del número
function createNumberTexture(number) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.font = '200px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(number, canvas.width / 2, canvas.height / 2);
    return canvas;
}

// Línea de meta
const finishLineGeometry = new THREE.PlaneGeometry(1, trackWidth);
const finishLineMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const finishLine = new THREE.Mesh(finishLineGeometry, finishLineMaterial);
finishLine.rotation.x = -Math.PI / 2;
finishLine.position.set(trackLength / 2 - 2, 0.01, 0);
scene.add(finishLine);


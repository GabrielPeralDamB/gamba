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

// Cargar modelo 3D de la gamba
const loader = new THREE.GLTFLoader();
loader.load('prawn/scene.gltf', function(gltf) {
    const prawnModel = gltf.scene;
    prawnModel.scale.set(0.0005, 0.0005, 0.0005); // Ajustar escala del modelo
    prawnModel.rotation.y = -Math.PI / 2; // Orientar hacia la derecha

    // Crear gambas
    const horses = [];
    const laneOffset = 2; // Desplazamiento para centrar en cada carril
    for (let i = 0; i < numHorses; i++) {
        const horse = prawnModel.clone();
        // Colocar la gamba en el centro de cada carril
        horse.position.set(-trackLength / 2, 0, (i - numHorses / 2) * 4 + laneOffset);
        horses.push(horse);
        scene.add(horse);
    }

    // Posición inicial de la cámara
    camera.position.set(0, 5, numHorses * 2.5);
    camera.lookAt(0, 1, 0);

    // Animar la carrera
    let raceInProgress = false;
    const speeds = horses.map(() => Math.random() * 0.1 + 0.02); // Velocidades iniciales

    function animate() {
        requestAnimationFrame(animate);
        if (raceInProgress) {
            let leaderIndex = 0; // Índice de la gamba líder
            horses.forEach((horse, index) => {
                horse.position.x += speeds[index];

                // Actualizar líder
                if (horse.position.x > horses[leaderIndex].position.x) {
                    leaderIndex = index;
                }

                // Detectar ganador
                if (horse.position.x >= trackLength / 2 - 2) {
                    raceInProgress = false;
                    alert(`¡Gamba ${leaderIndex + 1} ha ganado!`);
                }
            });

            // Actualizar posición de la cámara para seguir al líder
            const leaderX = horses[leaderIndex].position.x;
            camera.position.x = leaderX + 10; // Mantener una distancia hacia adelante
            camera.lookAt(leaderX, 1, 0);
        }
        renderer.render(scene, camera);
    }

    animate();

    // Iniciar la carrera al hacer clic
    window.addEventListener('click', () => {
        if (!raceInProgress) {
            raceInProgress = true;
            horses.forEach((horse, index) => {
                horse.position.x = -trackLength / 2; // Reiniciar posiciones
            });
        }
    });

    // Ajustar tamaño del renderizador al cambiar el tamaño de la ventana
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});


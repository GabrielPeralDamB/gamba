let speeds = [0.01,0.02,0.05,0.07,0.1]; // Velocidades iniciales

function velocidadesAleatorias(){
    for (let i = 0; i < 5; i++) {
        speeds[i] = Math.random() * 0.1;
    }
}

velocidadesAleatorias();

const velocidadSpin=0.01;
const velocidadWalk=[0.01,0.04];
const velocidadGallop=[0.04,0.08];
const velocidadFast=0.08;
/*
const velocidadSpin=1;
const velocidadWalk=[1,1];
const velocidadGallop=[1,1];
const velocidadFast=1;*/

// Cargar modelo 3D de la gamba
let selectedPrawn = null;
let bettingScreen = document.createElement('div');
bettingScreen.style.position = 'absolute';
bettingScreen.style.top = '0';
bettingScreen.style.left = '0';
bettingScreen.style.width = '100%';
bettingScreen.style.height = '100%';
bettingScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
bettingScreen.style.display = 'flex';
bettingScreen.style.flexWrap = 'wrap';
bettingScreen.style.justifyContent = 'center';
bettingScreen.style.alignItems = 'center';
bettingScreen.style.zIndex = '10';
document.body.appendChild(bettingScreen);

let bettingText = document.createElement('div');
bettingText.style.color = 'white';
bettingText.style.fontSize = '24px';
bettingText.style.width = '100%';
bettingText.style.textAlign = 'center';
bettingText.style.marginBottom = '20px';
bettingText.innerText = 'Seleccione una gamba para apostar:';
bettingScreen.appendChild(bettingText);

const loader = new THREE.GLTFLoader();
loader.load('prawn/scene.gltf', function(gltf) {
    const prawnModel = gltf.scene;
    prawnModel.scale.set(0.0005, 0.0005, 0.0005); // Ajustar escala del modelo

    // Crear gambas
    const horses = [];
    const laneOffset = 2; // Desplazamiento para centrar en cada carril
    for (let i = 0; i < numHorses; i++) {
        const horse = prawnModel.clone();
        // Colocar la gamba en el centro de cada carril
        horse.position.set(-trackLength / 2, 0, (i - numHorses / 2) * 4 + laneOffset);
        horses.push(horse);
        scene.add(horse);

        // Crear escena y renderizador para la selección
        let selectionScene = new THREE.Scene();
        let selectionCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        selectionCamera.position.z = 1;
        let selectionRenderer = new THREE.WebGLRenderer({ antialias: true });
        selectionRenderer.setSize(100, 100);

        // Añadir modelo de gamba a la escena de selección
        let selectionHorse = prawnModel.clone();
        selectionScene.add(selectionHorse);

        // Crear div para la selección
        let prawnDiv = document.createElement('div');
        prawnDiv.style.width = '120px';
        prawnDiv.style.height = '150px';
        prawnDiv.style.margin = '10px';
        prawnDiv.style.cursor = 'pointer';
        prawnDiv.style.display = 'flex';
        prawnDiv.style.flexDirection = 'column';
        prawnDiv.style.alignItems = 'center';
        prawnDiv.style.backgroundColor = 'white';
        prawnDiv.dataset.index = i;
        prawnDiv.appendChild(selectionRenderer.domElement);

        // Añadir número de gamba
        let prawnNumber = document.createElement('div');
        prawnNumber.style.color = 'black';
        prawnNumber.style.fontSize = '18px';
        prawnNumber.style.marginTop = '10px';
        prawnNumber.innerText = `Gamba ${i + 1}`;
        prawnDiv.appendChild(prawnNumber);

        prawnDiv.addEventListener('click', function() {
            selectedPrawn = parseInt(this.dataset.index);
            bettingScreen.style.display = 'none';
            startRace();
        });

        bettingScreen.appendChild(prawnDiv);

        // Animar modelo de gamba en la selección
        function animateSelection() {
            requestAnimationFrame(animateSelection);
            selectionHorse.rotation.y += 0.01;
            selectionRenderer.render(selectionScene, selectionCamera);
        }
        animateSelection();
    }

    // Posición inicial de la cámara
    camera.position.set(0, 5, numHorses * 2.5);
    camera.lookAt(0, 1, 0);

    // Animar la carrera
    let raceInProgress = false;
    const animations = horses.map(() => ({
        oscillate: true,
        bounce: true,
        spin: true,
        gallop: true,
        speed: true
    }));

    function startRace() {
        raceInProgress = true;
        horses.forEach((horse, index) => {
            horse.position.x = -trackLength / 2; // Reiniciar posiciones
        });
        velocidadesAleatorias();
    }

    function animate() {
        requestAnimationFrame(animate);
        if (raceInProgress) {
            let leaderIndex = 0; // Índice de la gamba líder
            horses.forEach((horse, index) => {
                horse.position.x += speeds[index];

                // Animaciones aleatorias
                if (speeds[index] > velocidadWalk[0] && speeds[index] < velocidadWalk[1]) {
                    horse.rotation.z = Math.sin(Date.now() * 0.01 * animations[index].speed) * 0.1;
                    horse.rotation.y = -Math.PI / 2; // Mirar al frente
                } else if (speeds[index] >= velocidadGallop[0] && speeds[index] < velocidadGallop[1]) {
                    horse.position.y = Math.sin(Date.now() * 0.01 * animations[index].speed) * 0.1;
                    horse.position.y = Math.abs(Math.sin(Date.now() * 0.01 * animations[index].speed)) * 0.5;
                    horse.rotation.z = Math.sin(Date.now() * 0.01 * animations[index].speed) * 0.1;
                    horse.rotation.y = -Math.PI / 2;// Mirar al frente
                } else if (speeds[index] <= velocidadSpin) {
                    horse.rotation.y += 0.1 * animations[index].speed;
                } else if (speeds[index] >= velocidadFast) {
                    horse.position.y = Math.sin(Date.now() * 0.01 * animations[index].speed) * 0.3;
                    horse.position.y = Math.abs(Math.sin(Date.now() * 0.01 * animations[index].speed)) * 0.8;
                    horse.rotation.z = Math.sin(Date.now() * 0.01 * animations[index].speed) * 0.3;
                    horse.rotation.y = -Math.PI / 2;// Mirar al frente
                } else {
                    horse.rotation.y = -Math.PI / 2; // Mirar al frente
                }

                // Cambiar velocidades aleatoriamente
                if (Math.random() < 0.01) {
                    speeds[index] = Math.random() * 0.1;
                    console.log(speeds[index]);
                }

                // Actualizar líder
                if (horse.position.x > horses[leaderIndex].position.x) {
                    leaderIndex = index;
                }

                // Detectar ganador
                if (horse.position.x >= trackLength / 2 - 2) {
                    raceInProgress = false;
                    if (leaderIndex === selectedPrawn) {
                        alert(`¡Gamba ${leaderIndex + 1} ha ganado! ¡Has ganado la apuesta!`);
                    } else {
                        alert(`¡Gamba ${leaderIndex + 1} ha ganado! ¡Has perdido la apuesta!`);
                    }
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

    // Ajustar tamaño del renderizador al cambiar el tamaño de la ventana
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});


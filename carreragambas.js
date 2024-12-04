const speeds = [0.01,0.02,0.05,0.07,0.1]; // Velocidades iniciales

const velocidadSpin=0.01;
const velocidadWalk=[0.01,0.04];
const velocidadGallop=[0.04,0.08];
const velocidadFast=0.08;

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
    //const speeds = horses.map(() => Math.random() * 0.1 + 0.02); // Velocidades iniciales
    const animations = horses.map(() => ({
        oscillate: true,
        bounce: true,
        spin: true,
        gallop: true,
        speed: true
    }));

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


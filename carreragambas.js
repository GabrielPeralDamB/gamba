

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
    const animations = horses.map(() => ({
        oscillate: Math.random() > 0.5,
        bounce: Math.random() > 0.5,
        spin: Math.random() > 0.5,
        gallop: Math.random() > 0.5,
        speed: Math.random() * 0.05 + 0.01
    }));

    function animate() {
        requestAnimationFrame(animate);
        if (raceInProgress) {
            let leaderIndex = 0; // Índice de la gamba líder
            horses.forEach((horse, index) => {
                horse.position.x += speeds[index];

                // Animaciones aleatorias
                if (animations[index].oscillate) {
                    horse.rotation.z = Math.sin(Date.now() * 0.01 * animations[index].speed) * 0.1;
                }
                if (animations[index].bounce) {
                    horse.position.y = Math.abs(Math.sin(Date.now() * 0.01 * animations[index].speed)) * 0.5;
                }
                if (animations[index].spin) {
                    horse.rotation.y += 0.1 * animations[index].speed;
                }
                if (animations[index].gallop) {
                    horse.position.y = Math.abs(Math.sin(Date.now() * 0.02 * animations[index].speed)) * 0.2;
                }

                // Cambiar velocidades aleatoriamente
                if (Math.random() < 0.01) {
                    speeds[index] = Math.random() * 0.1 + 0.02;
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


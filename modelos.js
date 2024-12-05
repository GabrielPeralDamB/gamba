let prawnModel = null;
let marioModel = null;
let bigchungus = null;
let shrekModel = null;
let mcqueenModel = null;
let linuxModel = null;
let mewTwoModel = null;

function cargarModelos() {
    return new Promise((resolve, reject) => {
        const loader = new THREE.GLTFLoader();
        const models = [
            { name: "bigchungus", path: "bigchungus/scene.gltf", scale: 5 },
            { name: "mario", path: "mario/scene.gltf", scale: 0.5 },
            { name: "prawn", path: "prawn/scene.gltf", scale: 0.0005 },
            { name: "mcqueen", path: "McQueen/scene.gltf", scale: 0.8 },
            { name: "shrek", path: "shrek/scene.gltf", scale: 4 },
            { name: "linux", path: "linux/scene.gltf", scale: 4 },
            { name: "mewtwo", path: "css/scene.gltf", scale: 0.06}
        ];

        const shuffledModels = models.sort(() => Math.random() - 0.5).slice(0, 5);

        const loadModel = (index) => {
            if (index >= shuffledModels.length) {
                const loadedModels = [prawnModel, marioModel, bigchungus, shrekModel, mcqueenModel, linuxModel, mewTwoModel].filter(m => m);
                if (loadedModels.length < 5) {
                    reject(new Error("No se han cargado suficientes modelos."));
                } else {
                    resolve(true);
                }
                return;
            }

            const model = shuffledModels[index];
            loader.load(model.path, function (gltf) {
                switch (model.name) {
                    case "prawn":
                        prawnModel = gltf.scene;
                        break;
                    case "mario":
                        marioModel = gltf.scene;
                        break;
                    case "bigchungus":
                        bigchungus = gltf.scene;
                        break;
                    case "shrek":
                        shrekModel = gltf.scene;
                        break;
                    case "mcqueen":
                        mcqueenModel = gltf.scene;
                        break;
                    case "linux":
                        linuxModel = gltf.scene;
                        break;
                    case "mewtwo":
                        mewTwoModel = gltf.scene;
                        break;
                }
                gltf.scene.scale.set(model.scale, model.scale, model.scale);
                loadModel(index + 1);
            }, undefined, function (error) {
                console.error(error);
                loadModel(index + 1);
            });
        };

        loadModel(0);
    });
}

export { prawnModel, marioModel, bigchungus, shrekModel, mcqueenModel, linuxModel, mewTwoModel, cargarModelos };

let prawnModel = null;
let marioModel = null;
let bigchungus = null;
let shrekModel = null;

function cargarModelos() {
    return new Promise((resolve, reject) => {
        const loader = new THREE.GLTFLoader();
        loader.load("bigchungus/scene.gltf", function (gltf) {
            bigchungus = gltf.scene;
            bigchungus.scale.set(5, 5, 5);

            loader.load("mario/scene.gltf", function (gltf) {
                marioModel = gltf.scene;
                marioModel.scale.set(0.5, 0.5, 0.5);

                loader.load("prawn/scene.gltf", function (gltf) {
                    prawnModel = gltf.scene;
                    prawnModel.scale.set(0.0005, 0.0005, 0.0005);
                    loader.load("shrek/scene.gltf", function (gltf) {
                        shrekModel = gltf.scene;
                        shrekModel.scale.set(4, 4, 4);
                        resolve(true);
                    }, undefined, function (error) {
                        console.error(error);
                        reject(false);
                    });
                }, undefined, function (error) {
                    console.error(error);
                    reject(false);
                });
            }, undefined, function (error) {
                console.error(error);
                reject(false);
            });
        }, undefined, function (error) {
            console.error(error);
            reject(false);
        });
    });
}

export { prawnModel, marioModel, bigchungus, shrekModel, cargarModelos };

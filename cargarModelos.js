import { cargarModelos, prawnModel, marioModel, bigchungus } from './modelos.js';

let prawnModel=null;
let marioModel=null;
let bigchungus=null;

async function main() {
    try {
        const modelosCargados = await cargarModelos();
        if (modelosCargados) {
            console.log("Todos los modelos se han cargado correctamente.");
            console.log(prawnModel);
            console.log(marioModel);
            console.log(bigchungus);
            // ...existing code...
        }
    } catch (error) {
        console.error("Error al cargar los modelos:", error);
    }
}

main();
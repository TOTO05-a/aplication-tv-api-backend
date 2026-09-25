"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const connection_1 = require("./database/connection");
const collections_1 = require("./database/collections");
async function main() {
    await (0, connection_1.connectDatabase)();
    await (0, collections_1.ensureIndexes)();
    const app = (0, app_1.createApp)();
    app.listen(env_1.env.port, () => {
        console.log(`Servidor escuchando en http://localhost:${env_1.env.port}`);
        console.log(`Swagger disponible en http://localhost:${env_1.env.port}/api-docs`);
    });
}
main().catch((error) => {
    console.error("Error al iniciar el servidor", error);
    process.exit(1);
});

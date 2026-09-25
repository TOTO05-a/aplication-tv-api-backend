"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
exports.getDb = getDb;
exports.getClient = getClient;
exports.closeDatabase = closeDatabase;
const mongodb_1 = require("mongodb");
const env_1 = require("../config/env");
let client = null;
let db = null;
async function connectDatabase() {
    if (db)
        return db;
    client = new mongodb_1.MongoClient(env_1.env.mongoUri);
    await client.connect();
    db = client.db(env_1.env.mongoDbName);
    console.log(`MongoDB conectado a la base de datos ${env_1.env.mongoDbName}`);
    return db;
}
function getDb() {
    if (!db) {
        throw new Error("La base de datos no esta conectada, llama a connectDatabase primero");
    }
    return db;
}
function getClient() {
    if (!client) {
        throw new Error("El cliente de MongoDB no esta conectado");
    }
    return client;
}
async function closeDatabase() {
    if (client) {
        await client.close();
        client = null;
        db = null;
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listActors = listActors;
exports.getActorById = getActorById;
exports.createActor = createActor;
exports.updateActor = updateActor;
exports.deleteActor = deleteActor;
const mongodb_1 = require("mongodb");
const collections_1 = require("../database/collections");
const AppError_1 = require("../utils/AppError");
async function listActors() {
    return collections_1.collections.actors().find().sort({ name: 1 }).toArray();
}
async function getActorById(id) {
    const actor = await collections_1.collections.actors().findOne({ _id: new mongodb_1.ObjectId(id) });
    if (!actor) {
        throw new AppError_1.AppError("Actor no encontrado", 404, "ACTOR_NOT_FOUND");
    }
    return actor;
}
async function createActor(data) {
    const result = await collections_1.collections.actors().insertOne(data);
    return getActorById(result.insertedId.toString());
}
async function updateActor(id, data) {
    await getActorById(id);
    await collections_1.collections.actors().updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: data });
    return getActorById(id);
}
async function deleteActor(id) {
    await getActorById(id);
    const charactersUsingActor = await collections_1.collections.characters().countDocuments({ actorId: new mongodb_1.ObjectId(id) });
    if (charactersUsingActor > 0) {
        throw new AppError_1.AppError("No se puede eliminar el actor porque interpreta personajes existentes", 409, "ACTOR_IN_USE");
    }
    await collections_1.collections.actors().deleteOne({ _id: new mongodb_1.ObjectId(id) });
}

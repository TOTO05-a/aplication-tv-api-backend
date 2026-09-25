"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCharacters = listCharacters;
exports.getCharacterById = getCharacterById;
exports.createCharacter = createCharacter;
exports.updateCharacter = updateCharacter;
exports.deleteCharacter = deleteCharacter;
const mongodb_1 = require("mongodb");
const collections_1 = require("../database/collections");
const AppError_1 = require("../utils/AppError");
async function listCharacters(programId) {
    const filter = programId ? { programId: new mongodb_1.ObjectId(programId) } : {};
    return collections_1.collections.characters().find(filter).toArray();
}
async function getCharacterById(id) {
    const character = await collections_1.collections.characters().findOne({ _id: new mongodb_1.ObjectId(id) });
    if (!character) {
        throw new AppError_1.AppError("Personaje no encontrado", 404, "CHARACTER_NOT_FOUND");
    }
    return character;
}
async function createCharacter(data) {
    const program = await collections_1.collections.programs().findOne({ _id: new mongodb_1.ObjectId(data.programId) });
    if (!program) {
        throw new AppError_1.AppError("El programa indicado no existe", 400, "PROGRAM_NOT_FOUND");
    }
    const actor = await collections_1.collections.actors().findOne({ _id: new mongodb_1.ObjectId(data.actorId) });
    if (!actor) {
        throw new AppError_1.AppError("El actor indicado no existe", 400, "ACTOR_NOT_FOUND");
    }
    const result = await collections_1.collections.characters().insertOne({
        name: data.name,
        description: data.description,
        programId: new mongodb_1.ObjectId(data.programId),
        actorId: new mongodb_1.ObjectId(data.actorId)
    });
    return getCharacterById(result.insertedId.toString());
}
async function updateCharacter(id, data) {
    await getCharacterById(id);
    const update = { ...data };
    if (data.programId) {
        const program = await collections_1.collections.programs().findOne({ _id: new mongodb_1.ObjectId(data.programId) });
        if (!program)
            throw new AppError_1.AppError("El programa indicado no existe", 400, "PROGRAM_NOT_FOUND");
        update.programId = new mongodb_1.ObjectId(data.programId);
    }
    if (data.actorId) {
        const actor = await collections_1.collections.actors().findOne({ _id: new mongodb_1.ObjectId(data.actorId) });
        if (!actor)
            throw new AppError_1.AppError("El actor indicado no existe", 400, "ACTOR_NOT_FOUND");
        update.actorId = new mongodb_1.ObjectId(data.actorId);
    }
    await collections_1.collections.characters().updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: update });
    return getCharacterById(id);
}
async function deleteCharacter(id) {
    await getCharacterById(id);
    await collections_1.collections.characters().deleteOne({ _id: new mongodb_1.ObjectId(id) });
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEpisodes = listEpisodes;
exports.getEpisodeById = getEpisodeById;
exports.createEpisode = createEpisode;
exports.updateEpisode = updateEpisode;
exports.deleteEpisode = deleteEpisode;
const mongodb_1 = require("mongodb");
const collections_1 = require("../database/collections");
const AppError_1 = require("../utils/AppError");
async function listEpisodes(programId) {
    const filter = programId ? { programId: new mongodb_1.ObjectId(programId) } : {};
    return collections_1.collections.episodes().find(filter).sort({ number: 1 }).toArray();
}
async function getEpisodeById(id) {
    const episode = await collections_1.collections.episodes().findOne({ _id: new mongodb_1.ObjectId(id) });
    if (!episode) {
        throw new AppError_1.AppError("Episodio no encontrado", 404, "EPISODE_NOT_FOUND");
    }
    return episode;
}
async function createEpisode(data) {
    const program = await collections_1.collections.programs().findOne({ _id: new mongodb_1.ObjectId(data.programId) });
    if (!program) {
        throw new AppError_1.AppError("El programa indicado no existe", 400, "PROGRAM_NOT_FOUND");
    }
    const duplicate = await collections_1.collections.episodes().findOne({
        programId: new mongodb_1.ObjectId(data.programId),
        number: data.number
    });
    if (duplicate) {
        throw new AppError_1.AppError("Ya existe un episodio con ese numero para este programa", 409, "EPISODE_NUMBER_TAKEN");
    }
    const result = await collections_1.collections.episodes().insertOne({
        programId: new mongodb_1.ObjectId(data.programId),
        number: data.number,
        title: data.title,
        synopsis: data.synopsis,
        duration: data.duration,
        releaseDate: new Date(data.releaseDate)
    });
    return getEpisodeById(result.insertedId.toString());
}
async function updateEpisode(id, data) {
    await getEpisodeById(id);
    const update = { ...data };
    if (data.programId)
        update.programId = new mongodb_1.ObjectId(data.programId);
    if (data.releaseDate)
        update.releaseDate = new Date(data.releaseDate);
    await collections_1.collections.episodes().updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: update });
    return getEpisodeById(id);
}
async function deleteEpisode(id) {
    await getEpisodeById(id);
    await collections_1.collections.episodes().deleteOne({ _id: new mongodb_1.ObjectId(id) });
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProgramRatings = getProgramRatings;
exports.rateProgram = rateProgram;
exports.updateRating = updateRating;
const mongodb_1 = require("mongodb");
const collections_1 = require("../database/collections");
const AppError_1 = require("../utils/AppError");
async function getProgramRatings(programId) {
    const ratings = await collections_1.collections.ratings().find({ programId: new mongodb_1.ObjectId(programId) }).toArray();
    const average = ratings.length
        ? Number((ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length).toFixed(2))
        : 0;
    return { average, total: ratings.length, ratings };
}
async function rateProgram(userId, programId, score) {
    const program = await collections_1.collections.programs().findOne({ _id: new mongodb_1.ObjectId(programId) });
    if (!program) {
        throw new AppError_1.AppError("Programa no encontrado", 404, "PROGRAM_NOT_FOUND");
    }
    const existing = await collections_1.collections.ratings().findOne({
        userId: new mongodb_1.ObjectId(userId),
        programId: new mongodb_1.ObjectId(programId)
    });
    if (existing) {
        throw new AppError_1.AppError("Ya calificaste este programa, usa PATCH para actualizar", 409, "RATING_ALREADY_EXISTS");
    }
    await collections_1.collections.ratings().insertOne({
        userId: new mongodb_1.ObjectId(userId),
        programId: new mongodb_1.ObjectId(programId),
        score,
        createdAt: new Date(),
        updatedAt: new Date()
    });
}
async function updateRating(userId, programId, score) {
    const existing = await collections_1.collections.ratings().findOne({
        userId: new mongodb_1.ObjectId(userId),
        programId: new mongodb_1.ObjectId(programId)
    });
    if (!existing) {
        throw new AppError_1.AppError("Todavia no has calificado este programa", 404, "RATING_NOT_FOUND");
    }
    await collections_1.collections.ratings().updateOne({ _id: existing._id }, { $set: { score, updatedAt: new Date() } });
}

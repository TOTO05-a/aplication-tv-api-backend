"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFavorites = listFavorites;
exports.addFavorite = addFavorite;
exports.removeFavorite = removeFavorite;
const mongodb_1 = require("mongodb");
const collections_1 = require("../database/collections");
const AppError_1 = require("../utils/AppError");
async function listFavorites(userId) {
    const favorites = await collections_1.collections.favorites().find({ userId: new mongodb_1.ObjectId(userId) }).toArray();
    const programIds = favorites.map((favorite) => favorite.programId);
    return collections_1.collections.programs().find({ _id: { $in: programIds } }).toArray();
}
async function addFavorite(userId, programId) {
    const program = await collections_1.collections.programs().findOne({ _id: new mongodb_1.ObjectId(programId) });
    if (!program) {
        throw new AppError_1.AppError("Programa no encontrado", 404, "PROGRAM_NOT_FOUND");
    }
    const existing = await collections_1.collections.favorites().findOne({
        userId: new mongodb_1.ObjectId(userId),
        programId: new mongodb_1.ObjectId(programId)
    });
    if (existing) {
        throw new AppError_1.AppError("El programa ya esta en favoritos", 409, "FAVORITE_ALREADY_EXISTS");
    }
    await collections_1.collections.favorites().insertOne({
        userId: new mongodb_1.ObjectId(userId),
        programId: new mongodb_1.ObjectId(programId),
        createdAt: new Date()
    });
}
async function removeFavorite(userId, programId) {
    const result = await collections_1.collections.favorites().deleteOne({
        userId: new mongodb_1.ObjectId(userId),
        programId: new mongodb_1.ObjectId(programId)
    });
    if (result.deletedCount === 0) {
        throw new AppError_1.AppError("El favorito no existe", 404, "FAVORITE_NOT_FOUND");
    }
}

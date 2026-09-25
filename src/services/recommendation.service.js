"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendations = getRecommendations;
const mongodb_1 = require("mongodb");
const collections_1 = require("../database/collections");
// recomendaciones simples basadas en categorias favoritas y mejor calificadas del usuario
// sin uso de ia o ml, solo consultas y conteos
async function getRecommendations(userId) {
    const favorites = await collections_1.collections.favorites().find({ userId: new mongodb_1.ObjectId(userId) }).toArray();
    const favoriteProgramIds = favorites.map((f) => f.programId);
    const favoritePrograms = await collections_1.collections.programs().find({ _id: { $in: favoriteProgramIds } }).toArray();
    const preferredCategoryIds = [...new Set(favoritePrograms.map((p) => p.categoryId.toString()))];
    if (preferredCategoryIds.length === 0) {
        // sin favoritos, se recomiendan los programas mejor calificados
        const topRated = await collections_1.collections.ratings().aggregate([
            { $group: { _id: "$programId", average: { $avg: "$score" }, total: { $sum: 1 } } },
            { $sort: { average: -1, total: -1 } },
            { $limit: 10 }
        ]).toArray();
        const programIds = topRated.map((r) => r._id);
        return collections_1.collections.programs().find({ _id: { $in: programIds } }).toArray();
    }
    return collections_1.collections.programs()
        .find({
        categoryId: { $in: preferredCategoryIds.map((id) => new mongodb_1.ObjectId(id)) },
        _id: { $nin: favoriteProgramIds }
    })
        .limit(10)
        .toArray();
}

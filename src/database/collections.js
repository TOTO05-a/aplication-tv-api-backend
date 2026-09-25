"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collections = void 0;
exports.ensureIndexes = ensureIndexes;
const connection_1 = require("./connection");
exports.collections = {
    users: () => (0, connection_1.getDb)().collection("users"),
    categories: () => (0, connection_1.getDb)().collection("categories"),
    programs: () => (0, connection_1.getDb)().collection("programs"),
    episodes: () => (0, connection_1.getDb)().collection("episodes"),
    actors: () => (0, connection_1.getDb)().collection("actors"),
    characters: () => (0, connection_1.getDb)().collection("characters"),
    producers: () => (0, connection_1.getDb)().collection("producers"),
    favorites: () => (0, connection_1.getDb)().collection("favorites"),
    ratings: () => (0, connection_1.getDb)().collection("ratings"),
    comments: () => (0, connection_1.getDb)().collection("comments")
};
async function ensureIndexes() {
    await exports.collections.users().createIndex({ email: 1 }, { unique: true });
    await exports.collections.categories().createIndex({ name: 1 }, { unique: true });
    await exports.collections.programs().createIndex({ title: "text", synopsis: "text" });
    await exports.collections.programs().createIndex({ categoryId: 1 });
    await exports.collections.programs().createIndex({ status: 1 });
    await exports.collections.episodes().createIndex({ programId: 1, number: 1 }, { unique: true });
    await exports.collections.characters().createIndex({ programId: 1 });
    await exports.collections.favorites().createIndex({ userId: 1, programId: 1 }, { unique: true });
    await exports.collections.ratings().createIndex({ userId: 1, programId: 1 }, { unique: true });
    await exports.collections.comments().createIndex({ programId: 1 });
}

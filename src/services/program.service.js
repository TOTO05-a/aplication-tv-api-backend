"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPrograms = listPrograms;
exports.getProgramById = getProgramById;
exports.createProgram = createProgram;
exports.updateProgram = updateProgram;
exports.deleteProgramWithRelations = deleteProgramWithRelations;
const mongodb_1 = require("mongodb");
const collections_1 = require("../database/collections");
const connection_1 = require("../database/connection");
const AppError_1 = require("../utils/AppError");
async function listPrograms(filters) {
    const query = {};
    if (filters.search) {
        query.$or = [
            { title: { $regex: filters.search, $options: "i" } },
            { synopsis: { $regex: filters.search, $options: "i" } }
        ];
    }
    if (filters.status) {
        query.status = filters.status;
    }
    if (filters.category) {
        const category = await collections_1.collections.categories().findOne({
            $or: [
                { name: { $regex: `^${filters.category}$`, $options: "i" } },
                ...(mongodb_1.ObjectId.isValid(filters.category) ? [{ _id: new mongodb_1.ObjectId(filters.category) }] : [])
            ]
        });
        if (!category)
            return [];
        query.categoryId = category._id;
    }
    return collections_1.collections.programs().find(query).sort({ createdAt: -1 }).toArray();
}
async function getProgramById(id) {
    if (!mongodb_1.ObjectId.isValid(id)) {
        throw new AppError_1.AppError("Programa no encontrado", 404, "PROGRAM_NOT_FOUND");
    }
    const program = await collections_1.collections.programs().findOne({ _id: new mongodb_1.ObjectId(id) });
    if (!program) {
        throw new AppError_1.AppError("Programa no encontrado", 404, "PROGRAM_NOT_FOUND");
    }
    return program;
}
async function assertRelationsExist(categoryId, producerId) {
    const category = await collections_1.collections.categories().findOne({ _id: new mongodb_1.ObjectId(categoryId) });
    if (!category) {
        throw new AppError_1.AppError("La categoria indicada no existe", 400, "CATEGORY_NOT_FOUND");
    }
    const producer = await collections_1.collections.producers().findOne({ _id: new mongodb_1.ObjectId(producerId) });
    if (!producer) {
        throw new AppError_1.AppError("La productora indicada no existe", 400, "PRODUCER_NOT_FOUND");
    }
}
async function createProgram(data) {
    await assertRelationsExist(data.categoryId, data.producerId);
    const now = new Date();
    const result = await collections_1.collections.programs().insertOne({
        title: data.title,
        synopsis: data.synopsis,
        poster: data.poster,
        trailer: data.trailer,
        status: data.status,
        categoryId: new mongodb_1.ObjectId(data.categoryId),
        producerId: new mongodb_1.ObjectId(data.producerId),
        createdAt: now,
        updatedAt: now
    });
    return getProgramById(result.insertedId.toString());
}
async function updateProgram(id, data) {
    await getProgramById(id);
    if (data.categoryId || data.producerId) {
        const current = await getProgramById(id);
        await assertRelationsExist(data.categoryId ?? current.categoryId.toString(), data.producerId ?? current.producerId.toString());
    }
    const update = { ...data, updatedAt: new Date() };
    if (data.categoryId)
        update.categoryId = new mongodb_1.ObjectId(data.categoryId);
    if (data.producerId)
        update.producerId = new mongodb_1.ObjectId(data.producerId);
    await collections_1.collections.programs().updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: update });
    return getProgramById(id);
}
// elimina el programa y toda su informacion relacionada en una sola transaccion
// si algo falla se revierte todo el borrado
async function deleteProgramWithRelations(id) {
    await getProgramById(id);
    const programId = new mongodb_1.ObjectId(id);
    const client = (0, connection_1.getClient)();
    const session = client.startSession();
    try {
        await session.withTransaction(async () => {
            await collections_1.collections.episodes().deleteMany({ programId }, { session });
            await collections_1.collections.characters().deleteMany({ programId }, { session });
            await collections_1.collections.favorites().deleteMany({ programId }, { session });
            await collections_1.collections.ratings().deleteMany({ programId }, { session });
            await collections_1.collections.comments().deleteMany({ programId }, { session });
            const deleted = await collections_1.collections.programs().deleteOne({ _id: programId }, { session });
            if (deleted.deletedCount === 0) {
                throw new AppError_1.AppError("No se pudo eliminar el programa", 500, "PROGRAM_DELETE_FAILED");
            }
        });
    }
    finally {
        await session.endSession();
    }
}

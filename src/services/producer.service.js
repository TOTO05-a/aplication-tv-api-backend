"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProducers = listProducers;
exports.getProducerById = getProducerById;
exports.createProducer = createProducer;
exports.updateProducer = updateProducer;
exports.deleteProducer = deleteProducer;
const mongodb_1 = require("mongodb");
const collections_1 = require("../database/collections");
const AppError_1 = require("../utils/AppError");
async function listProducers() {
    return collections_1.collections.producers().find().sort({ name: 1 }).toArray();
}
async function getProducerById(id) {
    const producer = await collections_1.collections.producers().findOne({ _id: new mongodb_1.ObjectId(id) });
    if (!producer) {
        throw new AppError_1.AppError("Productora no encontrada", 404, "PRODUCER_NOT_FOUND");
    }
    return producer;
}
async function createProducer(data) {
    const result = await collections_1.collections.producers().insertOne(data);
    return getProducerById(result.insertedId.toString());
}
async function updateProducer(id, data) {
    await getProducerById(id);
    await collections_1.collections.producers().updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: data });
    return getProducerById(id);
}
async function deleteProducer(id) {
    await getProducerById(id);
    const programsUsingProducer = await collections_1.collections.programs().countDocuments({ producerId: new mongodb_1.ObjectId(id) });
    if (programsUsingProducer > 0) {
        throw new AppError_1.AppError("No se puede eliminar la productora porque tiene programas asociados", 409, "PRODUCER_IN_USE");
    }
    await collections_1.collections.producers().deleteOne({ _id: new mongodb_1.ObjectId(id) });
}

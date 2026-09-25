"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategories = listCategories;
exports.getCategoryById = getCategoryById;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
const mongodb_1 = require("mongodb");
const collections_1 = require("../database/collections");
const AppError_1 = require("../utils/AppError");
async function listCategories() {
    return collections_1.collections.categories().find().sort({ name: 1 }).toArray();
}
async function getCategoryById(id) {
    const category = await collections_1.collections.categories().findOne({ _id: new mongodb_1.ObjectId(id) });
    if (!category) {
        throw new AppError_1.AppError("Categoria no encontrada", 404, "CATEGORY_NOT_FOUND");
    }
    return category;
}
async function createCategory(data) {
    const existing = await collections_1.collections.categories().findOne({ name: data.name });
    if (existing) {
        throw new AppError_1.AppError("Ya existe una categoria con ese nombre", 409, "CATEGORY_ALREADY_EXISTS");
    }
    const result = await collections_1.collections.categories().insertOne({
        name: data.name,
        description: data.description,
        createdAt: new Date()
    });
    return getCategoryById(result.insertedId.toString());
}
async function updateCategory(id, data) {
    await getCategoryById(id);
    if (data.name) {
        const existing = await collections_1.collections.categories().findOne({ name: data.name, _id: { $ne: new mongodb_1.ObjectId(id) } });
        if (existing) {
            throw new AppError_1.AppError("Ya existe una categoria con ese nombre", 409, "CATEGORY_ALREADY_EXISTS");
        }
    }
    await collections_1.collections.categories().updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: data });
    return getCategoryById(id);
}
async function deleteCategory(id) {
    await getCategoryById(id);
    const programsUsingCategory = await collections_1.collections.programs().countDocuments({ categoryId: new mongodb_1.ObjectId(id) });
    if (programsUsingCategory > 0) {
        throw new AppError_1.AppError("No se puede eliminar la categoria porque tiene programas asociados", 409, "CATEGORY_IN_USE");
    }
    await collections_1.collections.categories().deleteOne({ _id: new mongodb_1.ObjectId(id) });
}

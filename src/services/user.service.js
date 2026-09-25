"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.changeUserRole = changeUserRole;
exports.deleteUser = deleteUser;
const mongodb_1 = require("mongodb");
const collections_1 = require("../database/collections");
const AppError_1 = require("../utils/AppError");
const user_model_1 = require("../models/user.model");
async function listUsers() {
    const users = await collections_1.collections.users().find().sort({ createdAt: -1 }).toArray();
    return users.map(user_model_1.toPublicUser);
}
async function changeUserRole(id, role) {
    const user = await collections_1.collections.users().findOne({ _id: new mongodb_1.ObjectId(id) });
    if (!user) {
        throw new AppError_1.AppError("Usuario no encontrado", 404, "USER_NOT_FOUND");
    }
    if (user.role === "admin" && role === "user") {
        await assertNotLastAdmin(id);
    }
    await collections_1.collections.users().updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { role } });
    const updated = await collections_1.collections.users().findOne({ _id: new mongodb_1.ObjectId(id) });
    return (0, user_model_1.toPublicUser)(updated);
}
async function deleteUser(id) {
    const user = await collections_1.collections.users().findOne({ _id: new mongodb_1.ObjectId(id) });
    if (!user) {
        throw new AppError_1.AppError("Usuario no encontrado", 404, "USER_NOT_FOUND");
    }
    if (user.role === "admin") {
        await assertNotLastAdmin(id);
    }
    await collections_1.collections.users().deleteOne({ _id: new mongodb_1.ObjectId(id) });
}
async function assertNotLastAdmin(currentAdminId) {
    const adminCount = await collections_1.collections.users().countDocuments({ role: "admin" });
    if (adminCount <= 1) {
        throw new AppError_1.AppError("No se puede eliminar o degradar al ultimo administrador", 409, "LAST_ADMIN");
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listComments = listComments;
exports.createComment = createComment;
exports.deleteComment = deleteComment;
const mongodb_1 = require("mongodb");
const collections_1 = require("../database/collections");
const AppError_1 = require("../utils/AppError");
async function listComments(programId) {
    return collections_1.collections.comments().find({ programId: new mongodb_1.ObjectId(programId) }).sort({ createdAt: -1 }).toArray();
}
async function createComment(userId, programId, text) {
    const program = await collections_1.collections.programs().findOne({ _id: new mongodb_1.ObjectId(programId) });
    if (!program) {
        throw new AppError_1.AppError("Programa no encontrado", 404, "PROGRAM_NOT_FOUND");
    }
    const result = await collections_1.collections.comments().insertOne({
        userId: new mongodb_1.ObjectId(userId),
        programId: new mongodb_1.ObjectId(programId),
        text,
        createdAt: new Date()
    });
    return collections_1.collections.comments().findOne({ _id: result.insertedId });
}
async function deleteComment(userId, userRole, commentId) {
    const comment = await collections_1.collections.comments().findOne({ _id: new mongodb_1.ObjectId(commentId) });
    if (!comment) {
        throw new AppError_1.AppError("Comentario no encontrado", 404, "COMMENT_NOT_FOUND");
    }
    const isOwner = comment.userId.toString() === userId;
    if (!isOwner && userRole !== "admin") {
        throw new AppError_1.AppError("No puedes eliminar este comentario", 403, "FORBIDDEN");
    }
    await collections_1.collections.comments().deleteOne({ _id: new mongodb_1.ObjectId(commentId) });
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const AppError_1 = require("../utils/AppError");
const apiResponse_1 = require("../utils/apiResponse");
function notFoundHandler(req, res) {
    (0, apiResponse_1.sendError)(res, 404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`, "ROUTE_NOT_FOUND");
}
function errorHandler(err, req, res, next) {
    if (err instanceof AppError_1.AppError) {
        return (0, apiResponse_1.sendError)(res, err.statusCode, err.message, err.errorCode);
    }
    if (err instanceof Error && err.name === "MongoServerError" && err.code === 11000) {
        return (0, apiResponse_1.sendError)(res, 409, "El recurso ya existe", "DUPLICATE_RESOURCE");
    }
    console.error(err);
    return (0, apiResponse_1.sendError)(res, 500, "Error interno del servidor", "INTERNAL_ERROR");
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
const apiResponse_1 = require("../utils/apiResponse");
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return (0, apiResponse_1.sendError)(res, 401, "No autenticado", "UNAUTHORIZED");
        }
        if (!roles.includes(req.user.role)) {
            return (0, apiResponse_1.sendError)(res, 403, "No tienes permisos para esta accion", "FORBIDDEN");
        }
        next();
    };
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, statusCode, message, data = {}) {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
}
function sendError(res, statusCode, message, errorCode) {
    return res.status(statusCode).json({
        success: false,
        message,
        error: errorCode
    });
}

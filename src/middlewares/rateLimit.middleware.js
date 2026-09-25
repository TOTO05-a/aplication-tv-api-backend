"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("../config/env");
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: env_1.env.rateLimitWindowMs,
    max: env_1.env.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Demasiadas solicitudes, intenta de nuevo mas tarde",
        error: "RATE_LIMIT_EXCEEDED"
    }
});
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: env_1.env.authRateLimitWindowMs,
    max: env_1.env.authRateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Demasiados intentos, intenta de nuevo mas tarde",
        error: "AUTH_RATE_LIMIT_EXCEEDED"
    }
});

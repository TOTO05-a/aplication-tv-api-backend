"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function required(name, fallback) {
    const value = process.env[name] ?? fallback;
    if (value === undefined) {
        throw new Error(`Falta la variable de entorno ${name}`);
    }
    return value;
}
exports.env = {
    port: Number(process.env.PORT ?? 3000),
    nodeEnv: process.env.NODE_ENV ?? "development",
    apiVersion: process.env.API_VERSION ?? "1.0.0",
    mongoUri: required("MONGO_URI", "mongodb://localhost:27017/?replicaSet=rs0"),
    mongoDbName: required("MONGO_DB_NAME", "campuslands_tv"),
    jwtSecret: required("JWT_SECRET", "dev_secret_change_me"),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
    cookieName: process.env.COOKIE_NAME ?? "token",
    cookieSecure: (process.env.COOKIE_SECURE ?? "false") === "true",
    cookieSameSite: (process.env.COOKIE_SAME_SITE ?? "lax"),
    frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://127.0.0.1:5500",
    adminName: process.env.ADMIN_NAME ?? "Administrador Principal",
    adminEmail: required("ADMIN_EMAIL", "admin@campuslands.edu.co"),
    adminPassword: required("ADMIN_PASSWORD", "Admin12345"),
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 900000),
    rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? 200),
    authRateLimitWindowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS ?? 900000),
    authRateLimitMax: Number(process.env.AUTH_RATE_LIMIT_MAX ?? 10)
};

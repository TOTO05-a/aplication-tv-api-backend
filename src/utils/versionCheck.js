"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVersionSupported = isVersionSupported;
exports.getApiVersion = getApiVersion;
exports.isNewerVersion = isNewerVersion;
const semver_1 = __importDefault(require("semver"));
const env_1 = require("../config/env");
// utilidad real que usa semver para validar la version de la api
// permite que un cliente envie el header x-api-version y valida compatibilidad
function isVersionSupported(clientVersion) {
    if (!clientVersion)
        return true;
    if (!semver_1.default.valid(semver_1.default.coerce(clientVersion)))
        return false;
    const current = semver_1.default.coerce(env_1.env.apiVersion);
    const requested = semver_1.default.coerce(clientVersion);
    if (!current || !requested)
        return false;
    // se acepta si el cliente pide la misma version mayor o una menor
    return semver_1.default.major(requested) <= semver_1.default.major(current);
}
function getApiVersion() {
    return env_1.env.apiVersion;
}
function isNewerVersion(a, b) {
    return semver_1.default.gt(semver_1.default.coerce(a) ?? "0.0.0", semver_1.default.coerce(b) ?? "0.0.0");
}

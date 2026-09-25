"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.me = me;
const auth_service_1 = require("../services/auth.service");
const apiResponse_1 = require("../utils/apiResponse");
const env_1 = require("../config/env");
const user_model_1 = require("../models/user.model");
function setAuthCookie(res, token) {
    res.cookie(env_1.env.cookieName, token, {
        httpOnly: true,
        secure: env_1.env.cookieSecure,
        sameSite: env_1.env.cookieSameSite,
        maxAge: 24 * 60 * 60 * 1000
    });
}
async function register(req, res, next) {
    try {
        const { user, token } = await (0, auth_service_1.registerUser)(req.body);
        setAuthCookie(res, token);
        (0, apiResponse_1.sendSuccess)(res, 201, "Usuario registrado correctamente", { user });
    }
    catch (error) {
        next(error);
    }
}
async function login(req, res, next) {
    try {
        const { user, token } = await (0, auth_service_1.loginUser)(req.body);
        setAuthCookie(res, token);
        (0, apiResponse_1.sendSuccess)(res, 200, "Sesion iniciada correctamente", { user });
    }
    catch (error) {
        next(error);
    }
}
async function logout(_req, res) {
    res.clearCookie(env_1.env.cookieName, {
        httpOnly: true,
        secure: env_1.env.cookieSecure,
        sameSite: env_1.env.cookieSameSite
    });
    (0, apiResponse_1.sendSuccess)(res, 200, "Sesion cerrada correctamente");
}
async function me(req, res) {
    (0, apiResponse_1.sendSuccess)(res, 200, "Usuario actual", { user: (0, user_model_1.toPublicUser)(req.user) });
}

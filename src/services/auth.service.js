"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const bcrypt_1 = __importDefault(require("bcrypt"));
const collections_1 = require("../database/collections");
const AppError_1 = require("../utils/AppError");
const jwt_1 = require("../utils/jwt");
const user_model_1 = require("../models/user.model");
const SALT_ROUNDS = 10;
async function registerUser(input) {
    const existing = await collections_1.collections.users().findOne({ email: input.email });
    if (existing) {
        throw new AppError_1.AppError("Ya existe una cuenta con ese email", 409, "EMAIL_ALREADY_EXISTS");
    }
    const hashedPassword = await bcrypt_1.default.hash(input.password, SALT_ROUNDS);
    const result = await collections_1.collections.users().insertOne({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: "user",
        createdAt: new Date()
    });
    const user = await collections_1.collections.users().findOne({ _id: result.insertedId });
    if (!user) {
        throw new AppError_1.AppError("No se pudo crear el usuario", 500, "USER_CREATION_FAILED");
    }
    const token = (0, jwt_1.signToken)({ userId: user._id.toString(), role: user.role });
    return { user: (0, user_model_1.toPublicUser)(user), token };
}
async function loginUser(input) {
    const user = await collections_1.collections.users().findOne({ email: input.email });
    if (!user) {
        throw new AppError_1.AppError("Credenciales invalidas", 401, "INVALID_CREDENTIALS");
    }
    const passwordMatches = await bcrypt_1.default.compare(input.password, user.password);
    if (!passwordMatches) {
        throw new AppError_1.AppError("Credenciales invalidas", 401, "INVALID_CREDENTIALS");
    }
    const token = (0, jwt_1.signToken)({ userId: user._id.toString(), role: user.role });
    return { user: (0, user_model_1.toPublicUser)(user), token };
}

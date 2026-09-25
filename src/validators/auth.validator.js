"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidator = [
    (0, express_validator_1.body)("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
    (0, express_validator_1.body)("email").trim().isEmail().withMessage("El email no es valido").normalizeEmail(),
    (0, express_validator_1.body)("password").isLength({ min: 8 }).withMessage("La password debe tener minimo 8 caracteres"),
    (0, express_validator_1.body)("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Las passwords no coinciden");
        }
        return true;
    })
];
exports.loginValidator = [
    (0, express_validator_1.body)("email").trim().isEmail().withMessage("El email no es valido").normalizeEmail(),
    (0, express_validator_1.body)("password").notEmpty().withMessage("La password es obligatoria")
];

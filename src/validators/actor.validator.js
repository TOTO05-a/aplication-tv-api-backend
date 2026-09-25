"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateActorValidator = exports.createActorValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createActorValidator = [
    (0, express_validator_1.body)("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
    (0, express_validator_1.body)("photo").optional({ checkFalsy: true }).trim().isURL().withMessage("La foto debe ser una URL valida"),
    (0, express_validator_1.body)("biography").optional().trim()
];
exports.updateActorValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Id de actor invalido"),
    (0, express_validator_1.body)("name").optional().trim().notEmpty().withMessage("El nombre no puede estar vacio"),
    (0, express_validator_1.body)("photo").optional({ checkFalsy: true }).trim().isURL().withMessage("La foto debe ser una URL valida"),
    (0, express_validator_1.body)("biography").optional().trim()
];

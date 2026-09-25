"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProducerValidator = exports.createProducerValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createProducerValidator = [
    (0, express_validator_1.body)("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
    (0, express_validator_1.body)("description").optional().trim(),
    (0, express_validator_1.body)("logo").optional({ checkFalsy: true }).trim().isURL().withMessage("El logo debe ser una URL valida"),
    (0, express_validator_1.body)("website").optional({ checkFalsy: true }).trim().isURL().withMessage("El website debe ser una URL valida")
];
exports.updateProducerValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Id de productora invalido"),
    (0, express_validator_1.body)("name").optional().trim().notEmpty().withMessage("El nombre no puede estar vacio"),
    (0, express_validator_1.body)("description").optional().trim(),
    (0, express_validator_1.body)("logo").optional({ checkFalsy: true }).trim().isURL().withMessage("El logo debe ser una URL valida"),
    (0, express_validator_1.body)("website").optional({ checkFalsy: true }).trim().isURL().withMessage("El website debe ser una URL valida")
];

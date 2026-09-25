"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProgramsValidator = exports.updateProgramValidator = exports.createProgramValidator = void 0;
const express_validator_1 = require("express-validator");
const statusValues = ["ongoing", "finished"];
exports.createProgramValidator = [
    (0, express_validator_1.body)("title").trim().notEmpty().withMessage("El titulo es obligatorio"),
    (0, express_validator_1.body)("synopsis").trim().notEmpty().withMessage("La sinopsis es obligatoria"),
    (0, express_validator_1.body)("poster").trim().isURL().withMessage("El poster debe ser una URL valida"),
    (0, express_validator_1.body)("trailer").trim().isURL().withMessage("El trailer debe ser una URL valida"),
    (0, express_validator_1.body)("status").isIn(statusValues).withMessage("El status debe ser ongoing o finished"),
    (0, express_validator_1.body)("categoryId").isMongoId().withMessage("categoryId invalido"),
    (0, express_validator_1.body)("producerId").isMongoId().withMessage("producerId invalido")
];
exports.updateProgramValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Id de programa invalido"),
    (0, express_validator_1.body)("title").optional().trim().notEmpty().withMessage("El titulo no puede estar vacio"),
    (0, express_validator_1.body)("synopsis").optional().trim().notEmpty().withMessage("La sinopsis no puede estar vacia"),
    (0, express_validator_1.body)("poster").optional().trim().isURL().withMessage("El poster debe ser una URL valida"),
    (0, express_validator_1.body)("trailer").optional().trim().isURL().withMessage("El trailer debe ser una URL valida"),
    (0, express_validator_1.body)("status").optional().isIn(statusValues).withMessage("El status debe ser ongoing o finished"),
    (0, express_validator_1.body)("categoryId").optional().isMongoId().withMessage("categoryId invalido"),
    (0, express_validator_1.body)("producerId").optional().isMongoId().withMessage("producerId invalido")
];
exports.listProgramsValidator = [
    (0, express_validator_1.query)("search").optional().trim(),
    (0, express_validator_1.query)("category").optional().trim(),
    (0, express_validator_1.query)("status").optional().isIn(statusValues).withMessage("status invalido")
];

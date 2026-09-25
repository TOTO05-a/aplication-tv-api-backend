"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCharacterValidator = exports.createCharacterValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createCharacterValidator = [
    (0, express_validator_1.body)("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
    (0, express_validator_1.body)("description").optional().trim(),
    (0, express_validator_1.body)("programId").isMongoId().withMessage("programId invalido"),
    (0, express_validator_1.body)("actorId").isMongoId().withMessage("actorId invalido")
];
exports.updateCharacterValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Id de personaje invalido"),
    (0, express_validator_1.body)("name").optional().trim().notEmpty().withMessage("El nombre no puede estar vacio"),
    (0, express_validator_1.body)("description").optional().trim(),
    (0, express_validator_1.body)("programId").optional().isMongoId().withMessage("programId invalido"),
    (0, express_validator_1.body)("actorId").optional().isMongoId().withMessage("actorId invalido")
];

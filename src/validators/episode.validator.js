"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEpisodeValidator = exports.createEpisodeValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createEpisodeValidator = [
    (0, express_validator_1.body)("programId").isMongoId().withMessage("programId invalido"),
    (0, express_validator_1.body)("number").isInt({ min: 1 }).withMessage("El numero de episodio debe ser un entero positivo"),
    (0, express_validator_1.body)("title").trim().notEmpty().withMessage("El titulo es obligatorio"),
    (0, express_validator_1.body)("synopsis").trim().notEmpty().withMessage("La sinopsis es obligatoria"),
    (0, express_validator_1.body)("duration").isInt({ min: 1 }).withMessage("La duracion debe ser un entero positivo"),
    (0, express_validator_1.body)("releaseDate").isISO8601().withMessage("La fecha de estreno no es valida")
];
exports.updateEpisodeValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Id de episodio invalido"),
    (0, express_validator_1.body)("programId").optional().isMongoId().withMessage("programId invalido"),
    (0, express_validator_1.body)("number").optional().isInt({ min: 1 }).withMessage("El numero de episodio debe ser un entero positivo"),
    (0, express_validator_1.body)("title").optional().trim().notEmpty().withMessage("El titulo no puede estar vacio"),
    (0, express_validator_1.body)("synopsis").optional().trim().notEmpty().withMessage("La sinopsis no puede estar vacia"),
    (0, express_validator_1.body)("duration").optional().isInt({ min: 1 }).withMessage("La duracion debe ser un entero positivo"),
    (0, express_validator_1.body)("releaseDate").optional().isISO8601().withMessage("La fecha de estreno no es valida")
];

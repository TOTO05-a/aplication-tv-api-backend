"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamValidator = exports.updateCategoryValidator = exports.createCategoryValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createCategoryValidator = [
    (0, express_validator_1.body)("name").trim().notEmpty().withMessage("El nombre de la categoria es obligatorio"),
    (0, express_validator_1.body)("description").trim().notEmpty().withMessage("La descripcion es obligatoria")
];
exports.updateCategoryValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Id de categoria invalido"),
    (0, express_validator_1.body)("name").optional().trim().notEmpty().withMessage("El nombre no puede estar vacio"),
    (0, express_validator_1.body)("description").optional().trim().notEmpty().withMessage("La descripcion no puede estar vacia")
];
exports.idParamValidator = [(0, express_validator_1.param)("id").isMongoId().withMessage("Id invalido")];

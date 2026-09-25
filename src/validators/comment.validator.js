"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createCommentValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Id de programa invalido"),
    (0, express_validator_1.body)("text").trim().notEmpty().withMessage("El comentario no puede estar vacio")
];

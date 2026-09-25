"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingValidator = void 0;
const express_validator_1 = require("express-validator");
exports.ratingValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Id de programa invalido"),
    (0, express_validator_1.body)("score").isInt({ min: 1, max: 5 }).withMessage("El rating debe estar entre 1 y 5")
];

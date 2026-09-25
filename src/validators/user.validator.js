"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleValidator = void 0;
const express_validator_1 = require("express-validator");
exports.updateUserRoleValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Id de usuario invalido"),
    (0, express_validator_1.body)("role").isIn(["user", "admin"]).withMessage("El rol debe ser user o admin")
];

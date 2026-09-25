"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const express_validator_1 = require("express-validator");
const apiResponse_1 = require("../utils/apiResponse");
function validate(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const first = errors.array()[0];
        return (0, apiResponse_1.sendError)(res, 400, first.msg, "VALIDATION_ERROR");
    }
    next();
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const passport_1 = __importDefault(require("../config/passport"));
const apiResponse_1 = require("../utils/apiResponse");
function authenticate(req, res, next) {
    passport_1.default.authenticate("jwt", { session: false }, (err, user) => {
        if (err)
            return next(err);
        if (!user) {
            return (0, apiResponse_1.sendError)(res, 401, "No autenticado", "UNAUTHORIZED");
        }
        ;
        req.user = user;
        next();
    })(req, res, next);
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const mongodb_1 = require("mongodb");
const env_1 = require("./env");
const collections_1 = require("../database/collections");
function cookieExtractor(req) {
    if (req && req.cookies) {
        return req.cookies[env_1.env.cookieName] ?? null;
    }
    return null;
}
const options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: env_1.env.jwtSecret,
    passReqToCallback: true
};
passport_1.default.use(new passport_jwt_1.Strategy(options, async (_req, payload, done) => {
    try {
        if (!mongodb_1.ObjectId.isValid(payload.userId)) {
            return done(null, false);
        }
        const user = await collections_1.collections.users().findOne({ _id: new mongodb_1.ObjectId(payload.userId) });
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    }
    catch (error) {
        return done(error, false);
    }
}));
exports.default = passport_1.default;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const passport_1 = __importDefault(require("./config/passport"));
const env_1 = require("./config/env");
const swagger_1 = require("./config/swagger");
const routes_1 = __importDefault(require("./routes"));
const rateLimit_middleware_1 = require("./middlewares/rateLimit.middleware");
const error_middleware_1 = require("./middlewares/error.middleware");
const versionCheck_1 = require("./utils/versionCheck");
const apiResponse_1 = require("./utils/apiResponse");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: env_1.env.frontendOrigin,
        credentials: true
    }));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.use(passport_1.default.initialize());
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
    app.get("/", (_req, res) => {
        res.json({
            success: true,
            message: "Campuslands TV API",
            data: { version: (0, versionCheck_1.getApiVersion)(), docs: "/api-docs" }
        });
    });
    // valida la version del cliente contra la version actual de la api usando semver
    app.use("/api/v1", (req, res, next) => {
        const clientVersion = req.header("x-api-version");
        if (!(0, versionCheck_1.isVersionSupported)(clientVersion)) {
            return (0, apiResponse_1.sendError)(res, 400, "Version de API del cliente no soportada", "UNSUPPORTED_API_VERSION");
        }
        next();
    });
    app.use("/api/v1", rateLimit_middleware_1.generalLimiter, routes_1.default);
    app.use(error_middleware_1.notFoundHandler);
    app.use(error_middleware_1.errorHandler);
    return app;
}

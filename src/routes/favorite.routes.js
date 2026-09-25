"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller = __importStar(require("../controllers/favorite.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const programIdValidator = [(0, express_validator_1.param)("programId").isMongoId().withMessage("Id de programa invalido")];
/**
 * @openapi
 * /favorites:
 *   get:
 *     tags: [Favorites]
 *     summary: Listar los programas favoritos del usuario autenticado
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de programas favoritos
 */
router.get("/", auth_middleware_1.authenticate, controller.list);
/**
 * @openapi
 * /favorites/{programId}:
 *   post:
 *     tags: [Favorites]
 *     summary: Agregar un programa a favoritos
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: programId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Agregado a favoritos
 *       409:
 *         description: Ya esta en favoritos
 *   delete:
 *     tags: [Favorites]
 *     summary: Quitar un programa de favoritos
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: programId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Eliminado de favoritos
 */
router.post("/:programId", auth_middleware_1.authenticate, programIdValidator, validate_middleware_1.validate, controller.add);
router.delete("/:programId", auth_middleware_1.authenticate, programIdValidator, validate_middleware_1.validate, controller.remove);
exports.default = router;

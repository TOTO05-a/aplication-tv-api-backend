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
const controller = __importStar(require("../controllers/episode.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const episode_validator_1 = require("../validators/episode.validator");
const category_validator_1 = require("../validators/category.validator");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /episodes:
 *   get:
 *     tags: [Episodes]
 *     summary: Listar episodios, opcionalmente filtrados por programId
 *     parameters:
 *       - in: query
 *         name: programId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de episodios
 *   post:
 *     tags: [Episodes]
 *     summary: Crear episodio (solo admin)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: Episodio creado
 *       409:
 *         description: Ya existe un episodio con ese numero para el programa
 */
router.get("/", controller.list);
router.post("/", auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)("admin"), episode_validator_1.createEpisodeValidator, validate_middleware_1.validate, controller.create);
/**
 * @openapi
 * /episodes/{id}:
 *   get:
 *     tags: [Episodes]
 *     summary: Obtener episodio por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Episodio encontrado
 *   patch:
 *     tags: [Episodes]
 *     summary: Actualizar episodio (solo admin)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Episodio actualizado
 *   delete:
 *     tags: [Episodes]
 *     summary: Eliminar episodio (solo admin)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Episodio eliminado
 */
router.get("/:id", category_validator_1.idParamValidator, validate_middleware_1.validate, controller.getOne);
router.patch("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)("admin"), episode_validator_1.updateEpisodeValidator, validate_middleware_1.validate, controller.update);
router.delete("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)("admin"), category_validator_1.idParamValidator, validate_middleware_1.validate, controller.remove);
exports.default = router;

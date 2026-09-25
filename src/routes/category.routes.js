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
const controller = __importStar(require("../controllers/category.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const category_validator_1 = require("../validators/category.validator");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Listar todas las categorias
 *     responses:
 *       200:
 *         description: Lista de categorias
 *   post:
 *     tags: [Categories]
 *     summary: Crear una categoria (solo admin)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Categoria creada
 *       409:
 *         description: Ya existe una categoria con ese nombre
 */
router.get("/", controller.list);
router.post("/", auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)("admin"), category_validator_1.createCategoryValidator, validate_middleware_1.validate, controller.create);
/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Obtener una categoria por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: No encontrada
 *   patch:
 *     tags: [Categories]
 *     summary: Actualizar una categoria (solo admin)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Categoria actualizada
 *   delete:
 *     tags: [Categories]
 *     summary: Eliminar una categoria (solo admin)
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
 *         description: Categoria eliminada
 *       409:
 *         description: La categoria tiene programas asociados
 */
router.get("/:id", category_validator_1.idParamValidator, validate_middleware_1.validate, controller.getOne);
router.patch("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)("admin"), category_validator_1.updateCategoryValidator, validate_middleware_1.validate, controller.update);
router.delete("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)("admin"), category_validator_1.idParamValidator, validate_middleware_1.validate, controller.remove);
exports.default = router;

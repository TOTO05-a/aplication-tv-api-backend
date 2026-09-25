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
const controller = __importStar(require("../controllers/program.controller"));
const ratingController = __importStar(require("../controllers/rating.controller"));
const commentController = __importStar(require("../controllers/comment.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const program_validator_1 = require("../validators/program.validator");
const category_validator_1 = require("../validators/category.validator");
const rating_validator_1 = require("../validators/rating.validator");
const comment_validator_1 = require("../validators/comment.validator");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /programs:
 *   get:
 *     tags: [Programs]
 *     summary: Listar programas con busqueda y filtros combinables
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Busca en titulo y sinopsis
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Nombre o id de categoria
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ongoing, finished]
 *     responses:
 *       200:
 *         description: Lista de programas
 *   post:
 *     tags: [Programs]
 *     summary: Crear programa (solo admin)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProgramInput'
 *     responses:
 *       201:
 *         description: Programa creado
 *       400:
 *         description: Categoria o productora inexistente
 */
router.get("/", program_validator_1.listProgramsValidator, validate_middleware_1.validate, controller.list);
router.post("/", auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)("admin"), program_validator_1.createProgramValidator, validate_middleware_1.validate, controller.create);
/**
 * @openapi
 * /programs/{id}:
 *   get:
 *     tags: [Programs]
 *     summary: Obtener programa por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Programa encontrado
 *       404:
 *         description: No encontrado
 *   patch:
 *     tags: [Programs]
 *     summary: Actualizar programa (solo admin)
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
 *             $ref: '#/components/schemas/ProgramInput'
 *     responses:
 *       200:
 *         description: Programa actualizado
 *   delete:
 *     tags: [Programs]
 *     summary: Eliminar programa (solo admin). Usa una transaccion de MongoDB para borrar el programa junto con sus episodios, personajes, favoritos, ratings y comentarios. Si algo falla se revierte todo.
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
 *         description: Programa y datos relacionados eliminados
 */
router.get("/:id", category_validator_1.idParamValidator, validate_middleware_1.validate, controller.getOne);
router.patch("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)("admin"), program_validator_1.updateProgramValidator, validate_middleware_1.validate, controller.update);
router.delete("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)("admin"), category_validator_1.idParamValidator, validate_middleware_1.validate, controller.remove);
/**
 * @openapi
 * /programs/{id}/ratings:
 *   get:
 *     tags: [Ratings]
 *     summary: Obtener promedio y lista de ratings de un programa
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
 *         description: Ratings del programa
 *   post:
 *     tags: [Ratings]
 *     summary: Calificar un programa (1 a 5, un rating por usuario)
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
 *             type: object
 *             properties:
 *               score:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Rating registrado
 *       409:
 *         description: El usuario ya califico este programa
 *   patch:
 *     tags: [Ratings]
 *     summary: Actualizar el rating propio de un programa
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
 *             type: object
 *             properties:
 *               score:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Rating actualizado
 */
router.get("/:id/ratings", auth_middleware_1.authenticate, category_validator_1.idParamValidator, validate_middleware_1.validate, ratingController.list);
router.post("/:id/ratings", auth_middleware_1.authenticate, rating_validator_1.ratingValidator, validate_middleware_1.validate, ratingController.create);
router.patch("/:id/ratings", auth_middleware_1.authenticate, rating_validator_1.ratingValidator, validate_middleware_1.validate, ratingController.update);
/**
 * @openapi
 * /programs/{id}/comments:
 *   get:
 *     tags: [Comments]
 *     summary: Listar comentarios de un programa
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
 *         description: Lista de comentarios
 *   post:
 *     tags: [Comments]
 *     summary: Crear un comentario en un programa
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
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentario creado
 */
router.get("/:id/comments", auth_middleware_1.authenticate, category_validator_1.idParamValidator, validate_middleware_1.validate, commentController.list);
router.post("/:id/comments", auth_middleware_1.authenticate, comment_validator_1.createCommentValidator, validate_middleware_1.validate, commentController.create);
exports.default = router;

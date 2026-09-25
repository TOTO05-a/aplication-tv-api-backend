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
exports.list = list;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.remove = remove;
const categoryService = __importStar(require("../services/category.service"));
const apiResponse_1 = require("../utils/apiResponse");
async function list(_req, res, next) {
    try {
        const categories = await categoryService.listCategories();
        (0, apiResponse_1.sendSuccess)(res, 200, "Categorias obtenidas", { categories });
    }
    catch (error) {
        next(error);
    }
}
async function getOne(req, res, next) {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        (0, apiResponse_1.sendSuccess)(res, 200, "Categoria obtenida", { category });
    }
    catch (error) {
        next(error);
    }
}
async function create(req, res, next) {
    try {
        const category = await categoryService.createCategory(req.body);
        (0, apiResponse_1.sendSuccess)(res, 201, "Categoria creada", { category });
    }
    catch (error) {
        next(error);
    }
}
async function update(req, res, next) {
    try {
        const category = await categoryService.updateCategory(req.params.id, req.body);
        (0, apiResponse_1.sendSuccess)(res, 200, "Categoria actualizada", { category });
    }
    catch (error) {
        next(error);
    }
}
async function remove(req, res, next) {
    try {
        await categoryService.deleteCategory(req.params.id);
        (0, apiResponse_1.sendSuccess)(res, 200, "Categoria eliminada");
    }
    catch (error) {
        next(error);
    }
}

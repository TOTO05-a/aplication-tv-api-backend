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
exports.create = create;
exports.remove = remove;
const commentService = __importStar(require("../services/comment.service"));
const apiResponse_1 = require("../utils/apiResponse");
async function list(req, res, next) {
    try {
        const comments = await commentService.listComments(req.params.id);
        (0, apiResponse_1.sendSuccess)(res, 200, "Comentarios obtenidos", { comments });
    }
    catch (error) {
        next(error);
    }
}
async function create(req, res, next) {
    try {
        const comment = await commentService.createComment(req.user._id.toString(), req.params.id, req.body.text);
        (0, apiResponse_1.sendSuccess)(res, 201, "Comentario creado", { comment });
    }
    catch (error) {
        next(error);
    }
}
async function remove(req, res, next) {
    try {
        await commentService.deleteComment(req.user._id.toString(), req.user.role, req.params.id);
        (0, apiResponse_1.sendSuccess)(res, 200, "Comentario eliminado");
    }
    catch (error) {
        next(error);
    }
}

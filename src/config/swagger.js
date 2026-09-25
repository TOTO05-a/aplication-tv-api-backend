"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./env");
const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Campuslands TV API",
            version: env_1.env.apiVersion,
            description: "API para gestionar programas de television, episodios, actores, personajes, productoras, favoritos, ratings, comentarios y recomendaciones. Proyecto academico Campuslands."
        },
        servers: [{ url: `http://localhost:${env_1.env.port}/api/v1` }],
        tags: [
            { name: "Auth", description: "Registro, login, logout y sesion actual" },
            { name: "Categories", description: "CRUD de categorias" },
            { name: "Programs", description: "CRUD de programas, busqueda y filtros" },
            { name: "Episodes", description: "CRUD de episodios" },
            { name: "Actors", description: "CRUD de actores" },
            { name: "Characters", description: "CRUD de personajes" },
            { name: "Producers", description: "CRUD de productoras" },
            { name: "Favorites", description: "Favoritos del usuario autenticado" },
            { name: "Ratings", description: "Calificaciones de programas" },
            { name: "Comments", description: "Comentarios de programas" },
            { name: "Recommendations", description: "Recomendaciones simples" },
            { name: "Users", description: "Administracion de usuarios (solo admin)" }
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: env_1.env.cookieName
                }
            },
            schemas: {
                SuccessResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string" },
                        data: { type: "object" }
                    }
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string" },
                        error: { type: "string" }
                    }
                },
                User: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        role: { type: "string", enum: ["user", "admin"] },
                        createdAt: { type: "string", format: "date-time" }
                    }
                },
                RegisterInput: {
                    type: "object",
                    required: ["name", "email", "password", "confirmPassword"],
                    properties: {
                        name: { type: "string", example: "Ana Torres" },
                        email: { type: "string", example: "ana@correo.com" },
                        password: { type: "string", example: "password123" },
                        confirmPassword: { type: "string", example: "password123" }
                    }
                },
                LoginInput: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", example: "ana@correo.com" },
                        password: { type: "string", example: "password123" }
                    }
                },
                Category: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string" },
                        description: { type: "string" },
                        createdAt: { type: "string", format: "date-time" }
                    }
                },
                CategoryInput: {
                    type: "object",
                    required: ["name", "description"],
                    properties: {
                        name: { type: "string", example: "Anime" },
                        description: { type: "string", example: "Animacion japonesa" }
                    }
                },
                Producer: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string" },
                        description: { type: "string" },
                        logo: { type: "string" },
                        website: { type: "string" }
                    }
                },
                Actor: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string" },
                        photo: { type: "string" },
                        biography: { type: "string" }
                    }
                },
                Character: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string" },
                        description: { type: "string" },
                        programId: { type: "string" },
                        actorId: { type: "string" }
                    }
                },
                Program: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        title: { type: "string" },
                        synopsis: { type: "string" },
                        poster: { type: "string" },
                        trailer: { type: "string" },
                        status: { type: "string", enum: ["ongoing", "finished"] },
                        categoryId: { type: "string" },
                        producerId: { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                },
                ProgramInput: {
                    type: "object",
                    required: ["title", "synopsis", "poster", "trailer", "status", "categoryId", "producerId"],
                    properties: {
                        title: { type: "string", example: "Dragon Ball" },
                        synopsis: { type: "string", example: "Las aventuras de Goku" },
                        poster: { type: "string", example: "https://ejemplo.com/poster.jpg" },
                        trailer: { type: "string", example: "https://youtube.com/watch?v=xxxx" },
                        status: { type: "string", enum: ["ongoing", "finished"] },
                        categoryId: { type: "string" },
                        producerId: { type: "string" }
                    }
                },
                Episode: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        programId: { type: "string" },
                        number: { type: "integer" },
                        title: { type: "string" },
                        synopsis: { type: "string" },
                        duration: { type: "integer" },
                        releaseDate: { type: "string", format: "date-time" }
                    }
                },
                Comment: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        userId: { type: "string" },
                        programId: { type: "string" },
                        text: { type: "string" },
                        createdAt: { type: "string", format: "date-time" }
                    }
                },
                Rating: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        userId: { type: "string" },
                        programId: { type: "string" },
                        score: { type: "integer", minimum: 1, maximum: 5 }
                    }
                }
            }
        },
        security: [{ cookieAuth: [] }]
    },
    apis: [path_1.default.join(__dirname, "..", "routes", "*.js")]
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);

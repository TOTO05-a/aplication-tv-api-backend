"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_memory_server_1 = require("mongodb-memory-server");
const supertest_1 = __importDefault(require("supertest"));
jest.setTimeout(60000);
let replSet;
let app;
let closeDatabase;
let collections;
const userAgent = supertest_1.default.agent;
let adminCookie;
let userCookie;
let categoryId;
let producerId;
let programId;
beforeAll(async () => {
    replSet = await mongodb_memory_server_1.MongoMemoryReplSet.create({ replSet: { count: 1 } });
    const uri = replSet.getUri();
    process.env.MONGO_URI = uri;
    process.env.MONGO_DB_NAME = "campuslands_test";
    process.env.JWT_SECRET = "test_secret_key";
    process.env.ADMIN_EMAIL = "admin@test.com";
    process.env.ADMIN_PASSWORD = "Admin12345";
    process.env.FRONTEND_ORIGIN = "http://127.0.0.1:5500";
    process.env.COOKIE_SECURE = "false";
    process.env.RATE_LIMIT_MAX = "10000";
    process.env.AUTH_RATE_LIMIT_MAX = "10000";
    // los modulos se importan de forma dinamica para que lean las variables de entorno de prueba
    const { connectDatabase, closeDatabase: close } = require("../database/connection");
    const { ensureIndexes } = require("../database/collections");
    closeDatabase = close;
    collections = require("../database/collections").collections;
    await connectDatabase();
    await ensureIndexes();
    const { createApp } = require("../app");
    app = createApp();
});
afterAll(async () => {
    await closeDatabase();
    await replSet.stop();
});
describe("Autenticacion", () => {
    it("registra un usuario nuevo y no devuelve la password", async () => {
        const res = await (0, supertest_1.default)(app).post("/api/v1/auth/register").send({
            name: "Usuario Uno",
            email: "usuario1@test.com",
            password: "password123",
            confirmPassword: "password123"
        });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.email).toBe("usuario1@test.com");
        expect(res.body.data.user.password).toBeUndefined();
        userCookie = res.headers["set-cookie"];
    });
    it("rechaza el registro con un email ya existente", async () => {
        const res = await (0, supertest_1.default)(app).post("/api/v1/auth/register").send({
            name: "Usuario Uno",
            email: "usuario1@test.com",
            password: "password123",
            confirmPassword: "password123"
        });
        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe("EMAIL_ALREADY_EXISTS");
    });
    it("rechaza el registro si las passwords no coinciden", async () => {
        const res = await (0, supertest_1.default)(app).post("/api/v1/auth/register").send({
            name: "Usuario Dos",
            email: "usuario2@test.com",
            password: "password123",
            confirmPassword: "otraPassword"
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("VALIDATION_ERROR");
    });
    it("permite iniciar sesion con credenciales validas", async () => {
        const res = await (0, supertest_1.default)(app).post("/api/v1/auth/login").send({
            email: "usuario1@test.com",
            password: "password123"
        });
        expect(res.status).toBe(200);
        expect(res.headers["set-cookie"]).toBeDefined();
        userCookie = res.headers["set-cookie"];
    });
    it("rechaza login con password incorrecta", async () => {
        const res = await (0, supertest_1.default)(app).post("/api/v1/auth/login").send({
            email: "usuario1@test.com",
            password: "incorrecta"
        });
        expect(res.status).toBe(401);
        expect(res.body.error).toBe("INVALID_CREDENTIALS");
    });
    it("devuelve el usuario autenticado con la cookie de sesion", async () => {
        const res = await (0, supertest_1.default)(app).get("/api/v1/auth/me").set("Cookie", userCookie);
        expect(res.status).toBe(200);
        expect(res.body.data.user.email).toBe("usuario1@test.com");
    });
    it("rechaza rutas protegidas sin cookie", async () => {
        const res = await (0, supertest_1.default)(app).get("/api/v1/auth/me");
        expect(res.status).toBe(401);
    });
});
describe("Roles y permisos", () => {
    it("un usuario normal no puede crear categorias", async () => {
        const res = await (0, supertest_1.default)(app)
            .post("/api/v1/categories")
            .set("Cookie", userCookie)
            .send({ name: "Anime", description: "Animacion japonesa" });
        expect(res.status).toBe(403);
        expect(res.body.error).toBe("FORBIDDEN");
    });
    it("promueve al usuario de prueba a admin directamente en la base de datos y vuelve a iniciar sesion", async () => {
        await collections.users().updateOne({ email: "usuario1@test.com" }, { $set: { role: "admin" } });
        const res = await (0, supertest_1.default)(app).post("/api/v1/auth/login").send({
            email: "usuario1@test.com",
            password: "password123"
        });
        expect(res.status).toBe(200);
        adminCookie = res.headers["set-cookie"];
        const userRes = await (0, supertest_1.default)(app).post("/api/v1/auth/register").send({
            name: "Usuario Normal",
            email: "usuario-normal@test.com",
            password: "password123",
            confirmPassword: "password123"
        });
        expect(userRes.status).toBe(201);
        userCookie = userRes.headers["set-cookie"];
    });
});
describe("Categorias y productoras", () => {
    it("un admin puede crear una categoria", async () => {
        const res = await (0, supertest_1.default)(app)
            .post("/api/v1/categories")
            .set("Cookie", adminCookie)
            .send({ name: "Anime", description: "Animacion japonesa" });
        expect(res.status).toBe(201);
        categoryId = res.body.data.category._id;
    });
    it("un admin puede crear una productora", async () => {
        const res = await (0, supertest_1.default)(app)
            .post("/api/v1/producers")
            .set("Cookie", adminCookie)
            .send({ name: "Toei Animation", description: "Estudio japones", website: "https://toei-anim.co.jp" });
        expect(res.status).toBe(201);
        producerId = res.body.data.producer._id;
    });
});
describe("CRUD de programas", () => {
    it("rechaza crear un programa sin titulo", async () => {
        const res = await (0, supertest_1.default)(app)
            .post("/api/v1/programs")
            .set("Cookie", adminCookie)
            .send({
            synopsis: "Sinopsis de prueba",
            poster: "https://ejemplo.com/poster.jpg",
            trailer: "https://ejemplo.com/trailer",
            status: "ongoing",
            categoryId,
            producerId
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("VALIDATION_ERROR");
    });
    it("un admin puede crear un programa valido", async () => {
        const res = await (0, supertest_1.default)(app)
            .post("/api/v1/programs")
            .set("Cookie", adminCookie)
            .send({
            title: "Dragon Ball",
            synopsis: "Las aventuras de Goku",
            poster: "https://ejemplo.com/poster.jpg",
            trailer: "https://ejemplo.com/trailer",
            status: "ongoing",
            categoryId,
            producerId
        });
        expect(res.status).toBe(201);
        programId = res.body.data.program._id;
    });
    it("lista programas con busqueda por texto", async () => {
        const res = await (0, supertest_1.default)(app).get("/api/v1/programs?search=dragon");
        expect(res.status).toBe(200);
        expect(res.body.data.programs.length).toBeGreaterThan(0);
    });
    it("lista programas filtrando por status", async () => {
        const res = await (0, supertest_1.default)(app).get("/api/v1/programs?status=ongoing");
        expect(res.status).toBe(200);
        expect(res.body.data.programs.every((p) => p.status === "ongoing")).toBe(true);
    });
    it("un usuario normal no puede actualizar un programa", async () => {
        const res = await (0, supertest_1.default)(app)
            .patch(`/api/v1/programs/${programId}`)
            .set("Cookie", userCookie)
            .send({ title: "Otro titulo" });
        expect(res.status).toBe(403);
    });
    it("un admin puede actualizar un programa", async () => {
        const res = await (0, supertest_1.default)(app)
            .patch(`/api/v1/programs/${programId}`)
            .set("Cookie", adminCookie)
            .send({ title: "Dragon Ball Actualizado" });
        expect(res.status).toBe(200);
        expect(res.body.data.program.title).toBe("Dragon Ball Actualizado");
    });
});
describe("Favoritos, ratings y comentarios", () => {
    it("un usuario puede agregar un programa a favoritos", async () => {
        const res = await (0, supertest_1.default)(app).post(`/api/v1/favorites/${programId}`).set("Cookie", userCookie);
        expect(res.status).toBe(201);
    });
    it("no permite agregar el mismo favorito dos veces", async () => {
        const res = await (0, supertest_1.default)(app).post(`/api/v1/favorites/${programId}`).set("Cookie", userCookie);
        expect(res.status).toBe(409);
    });
    it("lista los favoritos del usuario", async () => {
        const res = await (0, supertest_1.default)(app).get("/api/v1/favorites").set("Cookie", userCookie);
        expect(res.status).toBe(200);
        expect(res.body.data.favorites.length).toBe(1);
    });
    it("un usuario puede calificar un programa entre 1 y 5", async () => {
        const res = await (0, supertest_1.default)(app)
            .post(`/api/v1/programs/${programId}/ratings`)
            .set("Cookie", userCookie)
            .send({ score: 5 });
        expect(res.status).toBe(201);
    });
    it("rechaza un rating fuera de rango", async () => {
        const res = await (0, supertest_1.default)(app)
            .post(`/api/v1/programs/${programId}/ratings`)
            .set("Cookie", adminCookie)
            .send({ score: 8 });
        expect(res.status).toBe(400);
    });
    it("no permite calificar el mismo programa dos veces con POST", async () => {
        const res = await (0, supertest_1.default)(app)
            .post(`/api/v1/programs/${programId}/ratings`)
            .set("Cookie", userCookie)
            .send({ score: 4 });
        expect(res.status).toBe(409);
    });
    it("un usuario puede comentar un programa", async () => {
        const res = await (0, supertest_1.default)(app)
            .post(`/api/v1/programs/${programId}/comments`)
            .set("Cookie", userCookie)
            .send({ text: "Excelente serie" });
        expect(res.status).toBe(201);
    });
    it("rechaza comentarios vacios", async () => {
        const res = await (0, supertest_1.default)(app)
            .post(`/api/v1/programs/${programId}/comments`)
            .set("Cookie", userCookie)
            .send({ text: "" });
        expect(res.status).toBe(400);
    });
});
describe("Eliminacion de programas con transaccion", () => {
    it("elimina el programa y su informacion relacionada sin dejar datos huerfanos", async () => {
        const res = await (0, supertest_1.default)(app).delete(`/api/v1/programs/${programId}`).set("Cookie", adminCookie);
        expect(res.status).toBe(200);
        const remainingFavorites = await collections.favorites().countDocuments({});
        const remainingRatings = await collections.ratings().countDocuments({});
        const remainingComments = await collections.comments().countDocuments({});
        expect(remainingFavorites).toBe(0);
        expect(remainingRatings).toBe(0);
        expect(remainingComments).toBe(0);
    });
    it("no permite eliminar una categoria con programas asociados", async () => {
        const createRes = await (0, supertest_1.default)(app)
            .post("/api/v1/programs")
            .set("Cookie", adminCookie)
            .send({
            title: "Programa temporal",
            synopsis: "Sinopsis",
            poster: "https://ejemplo.com/poster.jpg",
            trailer: "https://ejemplo.com/trailer",
            status: "finished",
            categoryId,
            producerId
        });
        const deleteRes = await (0, supertest_1.default)(app).delete(`/api/v1/categories/${categoryId}`).set("Cookie", adminCookie);
        expect(deleteRes.status).toBe(409);
        expect(deleteRes.body.error).toBe("CATEGORY_IN_USE");
        await (0, supertest_1.default)(app).delete(`/api/v1/programs/${createRes.body.data.program._id}`).set("Cookie", adminCookie);
    });
});

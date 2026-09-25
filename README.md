# Campuslands TV - Backend

API REST para gestionar programas de television, episodios, actores, personajes, productoras, favoritos, calificaciones, comentarios, recomendaciones y usuarios.

link para repositorio frontend: https://github.com/TOTO05-a/aplication-tv-api-frontend.git

## Tecnologias

- Node.js y JavaScript
- Express
- MongoDB con el driver oficial `mongodb`
- Passport JWT y cookies HttpOnly
- bcrypt, express-validator, express-rate-limit y dotenv
- Swagger UI para documentacion interactiva
- Jest, Supertest y `mongodb-memory-server` para pruebas

## Requisitos

- Node.js 18 o superior
- MongoDB 6 o superior
- MongoDB configurado como replica set de un solo nodo. Las transacciones usadas al eliminar programas requieren replica set.

## Instalacion

Desde la carpeta `backend`:

```bash
npm install
copy .env.example .env
```

En macOS o Linux, usa `cp .env.example .env`.

Edita `.env` si necesitas cambiar el puerto, MongoDB, CORS, JWT o las credenciales del administrador inicial.

## Configuracion de MongoDB

Ejemplo de arranque en Windows, macOS o Linux:

```bash
mongod --replSet rs0 --dbpath /ruta/a/tu/data/db --port 27017
mongosh
> rs.initiate()
```

La cadena predeterminada es:

```text
mongodb://localhost:27017/?replicaSet=rs0
```

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `PORT` | Puerto HTTP, por defecto `3000`. |
| `API_VERSION` | Version publicada de la API. |
| `MONGO_URI` | Conexion a MongoDB, incluyendo `replicaSet=rs0`. |
| `MONGO_DB_NAME` | Nombre de la base de datos. |
| `JWT_SECRET` | Secreto usado para firmar tokens. |
| `JWT_EXPIRES_IN` | Duracion del token, por ejemplo `1d`. |
| `COOKIE_NAME`, `COOKIE_SECURE`, `COOKIE_SAME_SITE` | Configuracion de la cookie JWT. |
| `FRONTEND_ORIGIN` | Origen permitido por CORS, por defecto `http://127.0.0.1:5500`. |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Administrador creado por el seed. |
| `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX` | Limite general de peticiones. |
| `AUTH_RATE_LIMIT_WINDOW_MS`, `AUTH_RATE_LIMIT_MAX` | Limite para login y registro. |

## Scripts

```bash
npm run dev
npm run build
npm start
npm run seed
npm test
```

- `npm run dev`: inicia el servidor con Nodemon.
- `npm run build`: comprueba la sintaxis de JavaScript.
- `npm start`: inicia el servidor en modo normal.
- `npm run seed`: limpia y carga datos de ejemplo.
- `npm test`: ejecuta la suite completa con MongoDB en memoria.

El servidor queda disponible en `http://localhost:3000`.

## Seed

Con MongoDB activo y `.env` configurado:

```bash
npm run seed
```

El seed crea categorias, productoras, actores, programas, episodios, personajes, el administrador definido en `.env` y un usuario de prueba:

```text
usuario@campuslands.edu.co / Usuario1234
```

## Documentacion y API

Swagger UI:

```text
http://localhost:3000/api-docs
```

Base de rutas:

```text
http://localhost:3000/api/v1
```

Endpoints principales:

- Auth: `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`.
- Catalogo: `/programs`, `/categories`, `/episodes`, `/actors`, `/characters`, `/producers`.
- Favoritos: `/favorites`.
- Calificaciones: `/programs/:id/ratings`.
- Comentarios: `/programs/:id/comments` y `/comments/:id`.
- Recomendaciones: `GET /recommendations`.
- Usuarios: `/users`, solo para administradores.

Las rutas protegidas usan la cookie JWT. Las operaciones de creacion, actualizacion y eliminacion del catalogo requieren rol `admin`.

## Arquitectura

```text
Route -> Middleware -> Validator -> Controller -> Service -> MongoDB
```

- `routes`: endpoints y documentacion Swagger.
- `middlewares`: autenticacion, roles, validacion, rate limit y errores.
- `controllers`: entrada HTTP y respuestas.
- `services`: logica de negocio y acceso a datos.
- `database`: conexion, colecciones, indices y seed.
- `validators`: validacion de datos de entrada.
- `utils`: JWT, respuestas, errores y versionado.

## Pruebas

```bash
npm test
```

La suite cubre autenticacion, cookies, permisos, CRUD, busquedas, favoritos, ratings, comentarios y borrado transaccional de programas. La primera ejecucion puede descargar el binario de MongoDB en memoria y requiere conexion a internet si no esta en cache.

# Especificación de Requisitos de Software (SRS)

## 1. Propósito
Documento SRS que describe el comportamiento, requisitos funcionales y no funcionales, y las interfaces del sistema backend y su integración con el frontend existente (React + Vite). Basado en los casos de uso provistos por el cliente.

## 2. Alcance
El sistema permite a ciudadanos y organizaciones propuestas, comentarios, respaldos y gestión básica de propuestas. Incluye autenticación, gestión de propuestas con adjuntos (links/archivos), comentarios privados, y mecanismo de apoyos.

Componentes:
- Frontend: aplicación React (ya existente).
- Backend: API REST en Node.js/Express con PostgreSQL.
- Despliegue: Docker Compose (DB, backend, frontend).

## 3. Actores
- Ciudadano: inicia sesión, crea propuestas, comenta y apoya propuestas.

## 4. Casos de uso resumidos
- Login: autenticación por `dni` y `signature` (firma digital). Al autenticar devuelve token (`token-<dni>`).
- Ver propuestas: listado público paginado/filtrable por palabra clave.
- Ver propuesta: ver detalle, comentarios, revisiones, documentos y adjuntos.
- Crear propuesta: usuario autenticado crea propuesta con título, resumen y adjuntos (link/file meta) y se guarda con `author_dni`.
- Mis propuestas: listar únicamente propuestas creadas por el usuario en sesión.
- Comentar: usuario autenticado agrega comentario (campo `private` por defecto true).
- Apoyar/retirar apoyo: togglear apoyo por propuesta (tabla `supports`, único por par `(proposal_id, supporter_dni)`).

## 5. Requisitos funcionales
RF1 - Autenticación
- RF1.1: El sistema debe permitir login POST `/api/auth/login` con `dni` y `signature`.
- RF1.2: Responder con token y datos de usuario (dni, name, role).
- RF1.3: Todas las rutas de modificación deben validar token en `Authorization: Bearer <token>`.

RF2 - Propuestas
- RF2.1: GET `/api/proposals` devuelve lista de propuestas públicas.
- RF2.2: GET `/api/proposals/:id` devuelve detalle, comentarios y si el usuario actual apoya la propuesta.
- RF2.3: POST `/api/proposals` crea propuesta autenticada con `title`, `summary`, `attachments: []`.
- RF2.4: GET `/api/proposals/mine` devuelve propuestas del usuario autenticado.

RF3 - Comentarios
- RF3.1: POST `/api/proposals/:id/comments` guarda comentario con `author_dni` del token.
- RF3.2: Los comentarios deben contener `message` no vacío.

RF4 - Apoyos
- RF4.1: POST `/api/proposals/:id/support` agrega o quita apoyo del usuario autenticado.
- RF4.2: Un usuario solo puede apoyar una vez por propuesta.

RF5 - Adjuntos
- RF5.1: `attachments` es un arreglo de objetos `{ type: 'link'|'file', label, url }` guardado en `proposals.attachments` (JSONB).

## 6. Requisitos no funcionales
RNF1 - Persistencia
- Usar PostgreSQL con tablas `users`, `proposals`, `comments`, `supports`.

RNF2 - Seguridad
- Validar entrada (sanitizar strings) en backend.
- No exponer firmas digitales; solo validar contra la tabla `users.signature`.

RNF3 - Rendimiento
- Listados paginados si crece el volumen (implementar LIMIT/OFFSET o cursor).

RNF4 - Disponibilidad y despliegue
- Contenerizar con Docker Compose.
- Migraciones simples: `init.sql` y verificación al arranque para columnas nuevas (p.ej. `attachments`).

RNF5 - Extensibilidad
- Código separado en capas: `services`, `crud`, `core/factories`, `core/adapters`.

## 7. Modelo de datos (resumen)
- users: `(id, dni, name, signature, role)`
- proposals: `(id, title, summary, status, votes, author_dni, attachments JSONB, created_at)`
- comments: `(id, proposal_id, author_dni, message, private, created_at)`
- supports: `(id, proposal_id, supporter_dni, created_at)`

## 8. Endpoints API (resumen)
- POST `/api/auth/login` → { dni, signature } -> { token, user }
- GET `/api/proposals` → listado público
- GET `/api/proposals/mine` → listado del usuario (token requerido)
- GET `/api/proposals/:id` → detalle propuesta (token opcional)
- POST `/api/proposals` → crear propuesta (token requerido)
- POST `/api/proposals/:id/comments` → crear comentario (token requerido)
- POST `/api/proposals/:id/support` → togglear apoyo (token requerido)

## 9. Criterios de aceptación
- Login con `dni='12345678'` y `signature='firma123'` devuelve token y permite acceder a `/api/proposals/mine`.
- Crear propuesta con adjuntos persiste `attachments` en la base.
- Comentarios se muestran en GET `/api/proposals/:id`.
- `GET /api/proposals/mine` devuelve solo las propuestas cuyo `author_dni` coincide con el token.



# Contrato de autenticación — Request API v5

Documenta ANTES de implementar. Para cada endpoint: método, ruta, ¿público o
protegido?, body permitido, respuesta de éxito (código + forma) y CADA error
(código HTTP + `error.code`).

## POST /auth/register

Método: `POST`
Ruta: `/auth/register`
Visibilidad: público
Body permitido: `email`, `password`

Éxito: `201 Created`

Forma:

```json
{ "id": "<uuid>", "email": "ana@example.com", "role": "requester", "createdAt": "2026-09-08T10:00:00.000Z" }
```

Errores:

`400 INVALID_EMAIL` — email ausente, vacío o con formato inválido.
`400 INVALID_PASSWORD` — contraseña fuera de 15-128 caracteres o no es string.
`400 SERVER_CONTROLLED_FIELD` — el cliente intenta enviar campos del servidor.
`409 ACCOUNT_CANNOT_BE_CREATED` — el email ya existe o la cuenta no puede crearse.

## POST /auth/login

Método: `POST`
Ruta: `/auth/login`
Visibilidad: público
Body permitido: `email`, `password`

Éxito: `200 OK`

Forma:

```json
{ "accessToken": "<jwt>", "tokenType": "Bearer", "expiresIn": 3600 }
```

Errores:`401 INVALID_CREDENTIALS` — igual para email inexistente, password incorrecta o cuenta no disponible. El mensaje no revela qué dato falló.
`400 INVALID_EMAIL` — si el email no tiene formato válido o falta.
`400 INVALID_PASSWORD` — si la contraseña no cumple la regla del contrato.

## GET /auth/me

Método: `GET`
Ruta: `/auth/me`
Visibilidad: protegido
Body: sin body

Éxito: `200 OK`

Forma:

```json
{ "id": "<uuid>", "email": "ana@example.com", "role": "requester" }
```

Errores:

`401 AUTHENTICATION_REQUIRED` — falta cabecera `Authorization`.

`401 INVALID_TOKEN` — firma inválida, algoritmo incorrecto, emisor/audiencia no válidos o token expirado.

`500 INTERNAL_ERROR` — si ocurre un error inesperado del servidor.

## Semántica de errores

`401` cuando no hay identidad confiable: no hay token, el esquema es inválido, la firma es falsa o el JWT está vencido o mal emitido. El problema es la autenticación, no la autorización.

`403` cuando la identidad existe pero esa operación está prohibida para ese actor. Ejemplo: un `agent` intenta crear una solicitud, o un usuario intenta acceder a una solicitud ajena.

`404` cuando la API no quiere revelar si el recurso existe o no. En recursos de solicitudes, `404 REQUEST_NOT_FOUND` se usa tanto para un ID inexistente como para uno ajeno, para evitar confirmar la existencia del recurso.

`409` cuando hay un conflicto de estado o de negocio: duplicado de cuenta, transición inválida de estado, intento de usar un estado terminal sin permiso, etc.

`400` para violaciones del contrato de entrada o campos controlados por el servidor; el cliente envió algo no permitido o mal formado.

`500` para errores inesperados, con el detalle interno oculto y sin filtrar secretos.

`503` cuando la base de datos o el servicio dependiente no está disponible.

Criterio resumido:

`401` = no puedo confiar en quién eres.
`403` = sé quién eres, pero no tienes permiso.
`404` = no revelo si existe o si es ajeno.
`409` = hay conflicto en el estado o en la operación.

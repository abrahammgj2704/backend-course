# Casos adversariales — Request API v5

Describe al menos ocho ataques que tu implementación deberá resistir, con el
resultado exacto esperado (código HTTP + `error.code`). Piensa como quien NO
respeta tu frontend: registro con `role`, `createdBy` inventado, IDs ajenos,
tokens editados o vencidos, bodies mixtos, headers extraños…

1. Registro con campos controlados por el servidor
   - Ataque: `POST /auth/register` con `{ "email": "ana@example.com", "password": "123456789012345", "role": "agent" }`
   - Esperado: `400 SERVER_CONTROLLED_FIELD`
   - Por qué: el cliente no puede inventar permisos ni metadatos del servidor.

2. Registro con `id` o `passwordHash` ficticio
   - Ataque: `POST /auth/register` con campos extra como `id`, `createdAt`, `passwordHash`.
   - Esperado: `400 SERVER_CONTROLLED_FIELD`
   - Por qué: esos campos se generan en el backend y nunca deben ser aceptados del cliente.

3. Duplicado de cuenta
   - Ataque: intentar registrar el mismo email dos veces con credenciales válidas.
   - Esperado: `409 ACCOUNT_CANNOT_BE_CREATED`
   - Por qué: la API no revela si el usuario ya existe y rechaza el registro duplicado como conflicto de negocio.

4. Login con credenciales incorrectas o email inexistente
   - Ataque: `POST /auth/login` con email o contraseña erróneos.
   - Esperado: `401 INVALID_CREDENTIALS`
   - Por qué: la respuesta debe ser genérica y no revelar qué valor falló.

5. Cabecera de autenticación faltante o mal formada
   - Ataque: llamar a un endpoint protegido sin `Authorization`, o con `Authorization: Token abc`.
   - Esperado: `401 AUTHENTICATION_REQUIRED`
   - Por qué: sin un esquema Bearer válido, no hay identidad confiable.

6. JWT editado, con firma inválida o firma correcta pero datos alterados
   - Ataque: cambiar el payload del token, usar otra secret, o manipular `sub`, `role`, `exp`, `iss` o `aud`.
   - Esperado: `401 INVALID_TOKEN`
   - Por qué: la API debe verificar firma, algoritmo, emisor, audiencia y expiración antes de confiar en el token.

7. Acceso a un recurso ajeno por ID
   - Ataque: `GET /requests/:id` con un UUID de otra persona or un ID inexistente, usando un requester autenticado.
   - Esperado: `404 REQUEST_NOT_FOUND`
   - Por qué: la API no revela si el recurso existe ni si es ajeno; responde igual para no filtrar información.

8. Agent intentando crear una solicitud
   - Ataque: `POST /requests` con token de `agent` y cuerpo válido.
   - Esperado: `403 FORBIDDEN`
   - Por qué: el rol `agent` no puede crear solicitudes, solo atenderlas.

9. Body mixto en una actualización autorizada parcialmente
   - Ataque: hacer `PATCH /requests/:id` con un body que mezcla una propiedad permitida para el dueño y otra prohibida para ese mismo actor, por ejemplo `title` + `status`.
   - Esperado: `403 FORBIDDEN`
   - Por qué: la política es todo-o-nada; no se aplica una parte del cambio si el conjunto no está autorizado.

10. Transición de estado inválida
   - Ataque: intentar pasar una solicitud desde `open` a un estado no permitido por la regla de negocio, por ejemplo una transición imposible o reabrir una terminada.
   - Esperado: `409 INVALID_STATUS_TRANSITION` o `409 REQUEST_IN_TERMINAL_STATUS`
   - Por qué: el conflicto está en el estado del recurso, no en la autenticación ni en la autorización.

11. Intento de falsificar el actor del historial o del dueño
   - Ataque: `POST /requests` o `PATCH /requests/:id` con `createdBy`, `changedBy`, `updatedAt` o campos equivalentes en el cuerpo.
   - Esperado: `400 SERVER_CONTROLLED_FIELD`
   - Por qué: el propietario y el actor responsable se toman del token autenticado, nunca del cliente.

12. Token vencido
   - Ataque: usar un JWT con `exp` en el pasado.
   - Esperado: `401 INVALID_TOKEN`
   - Por qué: la expiración forma parte de la verificación de seguridad del token.

# Registro de trabajo de la Clase 6

## Entorno

Configuré el entorno del proyecto para que el backend pudiera arrancar correctamente: instalé las dependencias con `npm install` y dejé definidos los valores de entorno necesarios en `.env`, especialmente `DATABASE_URL` y `JWT_SECRET`.

La confirmación de que funcionaba se hizo ejecutando la validación real del curso:

- `npm run class-06:doctor`
- `npm test`
- `node scripts/validate-class-06.js`

La verificación final fue exitosa y el resultado fue: `FINAL RESULT: PASSED`.

## Flujo de la solicitud

La petición entra por la aplicación Express en [src/app.js](../../src/app.js). Primero se aplican los middlewares de CORS y `express.json()`, y luego se montan las rutas `/auth` y `/requests`.

La autenticación se valida en [src/middleware/authenticate.js](../../src/middleware/authenticate.js), donde se verifica el token Bearer y se rellena `req.auth`.

La autorización se revisa en la capa de servicio y política de requests, principalmente en [src/modules/requests/request.policy.js](../../src/modules/requests/request.policy.js) y [src/modules/requests/requests.service.js](../../src/modules/requests/requests.service.js). Ahí se decide si un usuario puede ver, crear, editar o cambiar prioridad/estado.

La conexión a PostgreSQL se hace a través del pool definido en [src/database/pool.js](../../src/database/pool.js), y las consultas de requests/history se ejecutan en [src/modules/requests/requests.store.js](../../src/modules/requests/requests.store.js).

## Error corregido

Lo que estaba ocurriendo era que la colección de requests tiraba un error de recurso cuando la consulta no devolvía filas. En otras palabras, si el filtro era válido pero no tenía coincidencias, el sistema respondía 404 en vez de devolver un array vacío.

Lo que debería suceder es exactamente lo que exige la clase: un filtro válido con cero resultados debe responder `200` y un cuerpo `[]`.

Modifiqué la lógica principal en [src/modules/requests/requests.service.js](../../src/modules/requests/requests.service.js), donde la lista ya no lanza `REQUEST_NOT_FOUND` si el array resultante está vacío.

La prueba que protege este comportamiento está en [scripts/validate-class-06.js](../../scripts/validate-class-06.js), en el bloque de “Regression” llamado “Valid empty collection returns 200” y “Empty collection returns []”.

## Funcionalidad implementada

`GET /requests/:id/history` devuelve el historial completo de una request: cada evento de cambio queda representado con su tipo, valores antiguos y nuevos, y la fecha de creación.

Puede usarlo:

- un requester solo para sus propias requests
- un agent para cualquier request
- un usuario ajeno recibe la misma respuesta 404 que si la request no existe, sin revelar si la entidad existe o no

El resultado se ordena de más antiguo a más reciente usando la fecha de creación del evento y, como criterio estable, el `id` cuando dos eventos comparten el mismo timestamp. Esto asegura un orden cronológico consistente.

## Prueba explicada

Elijo la prueba “Owner can read history” de [scripts/validate-class-06.js](../../scripts/validate-class-06.js).

¿Qué prepara?
- crea dos usuarios, uno propietario y otro agente
- crea una request del propietario
- hace dos cambios reales: un cambio de estado y un cambio de prioridad

¿Qué acción realiza?
- realiza un `GET /requests/:id/history` con el token del propietario

¿Qué comprueba?
- que la respuesta sea `200`
- que el cuerpo sea un array
- que haya al menos 3 eventos en la historia

¿Qué regla protege?
- un requester puede leer el historial de sus propias requests
- el historial debe reflejar los cambios reales y ordenados
- no debe exponer información sensible más allá de los campos del evento

## Ayuda de IA

La IA me ayudó a comprender mejor el problema real: no era solo un problema de entorno, sino también una regresión funcional en la ruta de requests y en la ausencia del endpoint de historial.

El código que ayudó a producir incluye la implementación del servicio y la ruta para `GET /requests/:id/history`, además de la corrección del caso de colección vacía en [src/modules/requests/requests.service.js](../../src/modules/requests/requests.service.js) y [src/modules/requests/requests.routes.js](../../src/modules/requests/requests.routes.js).

Lo que verifiqué yo mismo fue la ejecución real de las pruebas y de la validación final del curso. Eso demostró que la solución no era solo teórica: quedó comprobada con salida real del programa.

Una sugerencia que no era suficiente por sí sola fue la primera diagnosis del entorno (`dotenv` faltante): sí era necesaria para arrancar, pero el fallo funcional real estaba en la lógica de colección y en la ruta de historial, que no se había implementado aún.

## Duda restante

La parte que todavía me interesa profundizar es la separación clara entre política de autorización, reglas del dominio y la capa HTTP. En este proyecto quedó muy bien definida: la política decide quién puede hacer algo, el servicio mantiene las reglas del caso de uso, y la ruta solo traduce la operación a respuesta HTTP. Ese diseño me parece clave para no mezclar responsabilidades.

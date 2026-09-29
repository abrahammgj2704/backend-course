# Informe de incidentes de la Clase 07

Completa cada sección MIENTRAS investigas. Separa los hechos de
las interpretaciones: un "creo que" pertenece a Hipótesis, no a Evidencia.

## Estado inicial

¿Qué comando confirmó el estado inicial?

npm run class-07:doctor

## Incidente 701


### Reporte

> Un integrador está construyendo enlaces hacia solicitudes y algunos de sus
> enlaces devuelven error 500. Dice que 'a veces funciona y a veces no'.

### Reproducción

[INC-701] Invalid request id
Request:  GET /requests/not-a-number  (as ana)
Expected: 400 INVALID_REQUEST_ID
Actual:   500 INTERNAL_ERROR
[INC-701] REPRODUCED

### Resultado esperado

```400 INVALID_REQUEST_ID
```

### Resultado real

```
500 Internal Server Error
```

### Hipótesis

1. Como id es BIGINT, PostgreSQL no puede convertir NaN a entero y genera un error técnico
2. Los numeros 1.5, 0, -3 y 12abc: formato inválido, respuesta 400 INVALID_REQUEST_ID.


### Evidencia

En requests.routes.js, req.params.id se convierte con Number().
Number("not-a-number") produce NaN.

El servicio getRequest() llama a findById(id) sin validar previamente
el formato del identificador.

findById() ejecuta SELECT ... WHERE id = $1.

La columna requests.id está definida como BIGINT.

La reproducción después de la corrección mostró:

Expected: 400 INVALID_REQUEST_ID
Actual:   400 INVALID_REQUEST_ID
Resultado: [INC-701] RESOLVED.

### Causa confirmada

La ruta convierte un identificador no numérico en NaN y lo envía al
servicio sin validarlo. El servicio ejecuta la consulta SQL con ese valor.
PostgreSQL no puede convertir NaN al tipo BIGINT de requests.id y genera
un error técnico. Ese error termina como respuesta 500.

### Corrección

En src/modules/requests/requests.routes.js se eliminó la conversión
prematura con Number() y se pasó el ID original al servicio.

En src/modules/requests/requests.service.js se agregó una validación que
acepta solamente enteros positivos dentro del rango BIGINT y rechaza texto,
decimales, cero, negativos y valores como 12abc mediante
AppError('contract', 'INVALID_REQUEST_ID', ...).

El ID validado debe enviarse al store sin usar parseInt ni una conversión
numérica que pueda perder precisión.

### Prueba de regresión

La prueba "rejects malformed request ids before looking up a request" en
test/requests.test.js comprueba que not-a-number, 1.5, 0, -3 y 12abc
responden 400 INVALID_REQUEST_ID.

También debe comprobar que 999999999, cuyo formato sí es válido pero no
existe, continúa respondiendo 404 REQUEST_NOT_FOUND.

La prueba "keeps a well-formed missing request id as 404" confirma que un
ID con formato válido pero inexistente conserva 404 REQUEST_NOT_FOUND.

## Incidente 702

### Reporte

Un agente informó que al cambiar una prioridad a "critical" recibe
un error 500 sin una explicación útil.

### Reproducción

[INC-702] Invalid priority
Request:  PATCH /requests/36 { "priority": "critical" }  (as maria)
Expected: 400 INVALID_PRIORITY
Actual:   500 INTERNAL_ERROR
[INC-702] REPRODUCED

### Resultado esperado

400 INVALID_PRIORITY
Priority must be low, medium or high.

### Resultado real

500 Internal Server Error
El terminal muestra que una restricción CHECK de PostgreSQL rechazó
la prioridad "critical".

### Hipótesis

1. El servicio no valida priority antes de iniciar la transacción.
Se comprueba revisando patchRequest().

2. La base de datos rechaza "critical" mediante una restricción CHECK.
Se comprueba revisando la migración y observando el error de PostgreSQL.

3. La prioridad puede estar siendo modificada antes de comprobar los
permisos. Se comprueba siguiendo el orden de validaciones en patchRequest().

### Evidencia

patchRequest() valida title y status, pero no valida priority.

Después se ejecuta updateRequest(), que envía la prioridad a PostgreSQL.

La base de datos conserva una restricción CHECK que solo permite low,
medium y high.

La reproducción devuelve 500 en lugar de 400 INVALID_PRIORITY.

### Causa confirmada

La aplicación no valida priority antes de ejecutar SQL. El valor
"critical" llega a PostgreSQL, la restricción CHECK lo rechaza y el error
de base de datos termina como error interno 500.

### Corrección

Agregar en patchRequest() y en la creación de solicitudes una validación
de priority que acepte únicamente low, medium y high y lance
AppError('contract', 'INVALID_PRIORITY', ...).

La restricción CHECK de PostgreSQL debe mantenerse como segunda defensa.

### Prueba de regresión

PATCH con priority: "critical" debe responder 400 INVALID_PRIORITY.

POST y PATCH con una prioridad inválida deben responder 400.

Un cambio válido, por ejemplo de low a high, debe continuar respondiendo
200 y devolver priority: "high".

## Flujo del error

¿Dónde se crea el error?

El error se crea en la capa de servicio, no en la base de datos. En este caso, el problema estaba en `patchRequest()` y en la creación de solicitudes: la aplicación validaba `title` y `status`, pero no validaba `priority` antes de ejecutar `updateRequest()`. Cuando se enviaba `"critical"`, la consulta llegaba a PostgreSQL y la restricción `CHECK` de la tabla lo rechazaba. Eso es el punto donde el problema se materializa como un error técnico de infraestructura.

¿Cómo llega al middleware de errores?

La ruta llama al servicio, este lanza la excepción o retorna un error que se propaga por la cadena de Express. Cuando la promesa se rechaza o se lanza una excepción, Express 5 redirige el flujo al middleware central de errores, que es el lugar indicado para transformar esa excepción en una respuesta HTTP. En el caso del contrato, la excepción es `AppError('contract', 'INVALID_PRIORITY', ...)`; en el caso de una base de datos caida o inesperada, el middleware debe registrar los detalles internos y responder de forma genérica.

¿Qué se devuelve al cliente?

Se devuelve una respuesta HTTP con el código de contrato correcto: `400 Bad Request`, y un cuerpo normalizado del estilo:

```json
{
  "error": {
    "code": "INVALID_PRIORITY",
    "message": "Priority must be low, medium or high."
  },
  "requestId": "req_..."
}
```

La respuesta no debe revelar el detalle técnico del `CHECK` ni el stack trace del motor de base de datos.

¿Qué permanece únicamente en el registro del servidor?

Queda en el registro del servidor la información técnica sensible o interna: el stack, el mensaje original de PostgreSQL, el nombre de la restricción, los SQL generados, nombres de tablas, rutas del proyecto y cualquier detalle que no forma parte del contrato público. Eso es exactamente lo que no debe salir al cliente.

## ID de solicitud

¿Cómo demostré que la respuesta y el registro pertenecen a la misma solicitud?

Se usa un `requestId` generado por petición y propagado a través de la request y la respuesta. El mismo identificador se guarda en el contexto de la solicitud, se incluye en el encabezado `X-Request-Id`, se devuelve dentro del cuerpo de error y también se registra en la línea del logger. Al verificar la respuesta y el log de la misma operación, se observa que coinciden exactamente, lo que permite correlacionar la traza de la petición con la respuesta del cliente.

En otras palabras: la respuesta y el registro describen la misma operación porque comparten el mismo `requestId`.

## Asistencia de IA

¿Qué me ayudó a entender la IA?

La IA ayudó a enfocar la causa raíz: no era un problema de PostgreSQL por sí mismo, sino la falta de validación previa de la aplicación. También sugirió que la restricción `CHECK` debe permanecer como defensa adicional y que la app debe rechazar el valor antes de tocar SQL.

¿Qué hipótesis propuso?

Propuso dos hipótesis clave:

1. `priority` no estaba validado antes de la actualización.
2. PostgreSQL estaba rechazando el valor por la restricción `CHECK`, y eso se estaba convirtiendo en un 500.

¿Cómo la verifiqué?

La verifiqué reproduciendo el caso con `PATCH /requests/:id` usando `priority: "critical"`, revisando el flujo del servicio y comprobando el error de PostgreSQL en el terminal. También confirmé la corrección con pruebas de regresión y con la ejecución completa de `npm test`.

¿Qué sugerencia estaba incompleta o era incorrecta?

La primera idea de "resolverlo quitando la restricción de PostgreSQL" era incorrecta, porque la restricción es una defensa de integridad y debe mantenerse. Lo correcto era validar en la aplicación y seguir dejando la base de datos como segunda barrera.

## Duda pendiente

¿Qué parte todavía no entiendo?

En esta corrección, la parte que ya quedó clara es que la validación debe ser explícita y centralizada para cada contrato de entrada; no queda ninguna duda funcional sobre la prioridad inválida. Lo único pendiente, como mejora de mantenimiento, sería decidir si esa validación se reutiliza en un helper único para todos los campos con enumeraciones, para evitar duplicar la misma regla en create y patch.

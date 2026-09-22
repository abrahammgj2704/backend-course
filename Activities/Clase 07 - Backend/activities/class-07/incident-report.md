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
¿Cómo llega al middleware de errores?
¿Qué se devuelve al cliente?
¿Qué permanece únicamente en el registro del servidor?

## ID de solicitud

¿Cómo demostré que la respuesta y el registro pertenecen a la misma solicitud?

## Asistencia de IA

¿Qué me ayudó a entender la IA?
¿Qué hipótesis propuso?
¿Cómo la verifiqué?
¿Qué sugerencia estaba incompleta o era incorrecta?

## Duda pendiente

¿Qué parte todavía no entiendo?

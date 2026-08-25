# Registro de uso de IA

## Consultas realizadas

Se utilizó IA para analizar la estructura del proyecto, revisar el flujo entre `server.js`,
`app.js`, el router y el almacenamiento en memoria, y proponer una implementación mínima
para los tres endpoints indicados en el README.

## Decisiones revisadas

- Se mantuvo la lógica de negocio en `src/routes/requests.routes.js`, como exige la actividad.
- Se validó que `title` sea texto y no esté vacío o compuesto solo por espacios.
- El servidor asigna `id` y fuerza `status` a `open`; no acepta esos campos desde el cliente.
- Se añadió una respuesta JSON `404` para rutas inexistentes, coherente con el contrato HTTP.
- No se añadieron base de datos, autenticación, controladores, servicios ni dependencias extra.

## Verificación humana

La implementación se comprobó mediante revisión de sintaxis y pruebas HTTP con los casos de
`casos-de-prueba.md`. Las decisiones finales y el resultado observado deben revisarse en la
terminal antes de entregar.

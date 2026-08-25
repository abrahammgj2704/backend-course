# Casos de prueba — Request API Full

Ejecuta el servidor con `npm start` desde esta carpeta antes de probar.

| Caso | Comando | Resultado esperado |
| ---- | ------- | ------------------ |
| Listar solicitudes | `curl -i http://localhost:3000/requests` | `200` y un arreglo JSON con las solicitudes iniciales. |
| Consultar existente | `curl -i http://localhost:3000/requests/1` | `200` y la solicitud con ID `1`. |
| Consultar inexistente | `curl -i http://localhost:3000/requests/999` | `404` y `{ "error": "Request not found" }`. |
| Crear solicitud válida | `curl -i -X POST http://localhost:3000/requests -H "Content-Type: application/json" -d "{\"title\":\"Leaking faucet\",\"description\":\"The faucet leaks.\",\"priority\":\"medium\"}"` | `201`, un nuevo ID y `status: "open"`. |
| Crear sin título | `curl -i -X POST http://localhost:3000/requests -H "Content-Type: application/json" -d "{\"description\":\"Missing title\"}"` | `400` y `{ "error": "Title is required" }`. |
| Crear con título en blanco | `curl -i -X POST http://localhost:3000/requests -H "Content-Type: application/json" -d "{\"title\":\"   \"}"` | `400` y `{ "error": "Title is required" }`. |
| Ruta inexistente | `curl -i http://localhost:3000/unknown` | `404` y `{ "error": "Route not found" }`. |

La lista debe conservar el mismo número de elementos después de los casos de validación
fallidos. Una solicitud válida sí debe aparecer después en `GET /requests`.

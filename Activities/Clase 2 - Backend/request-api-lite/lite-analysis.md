## Tabla de Análisis

| ENDPOINT | INTENCIÓN | ENTRADA | RESPUESTA ACTUAL | PROBLEMA | PROPUESTA |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET /getRequests` | Obtener la lista completa de solicitudes. | Ninguna | Status 200 OK con un arreglo JSON. | La ruta usa un verbo (`getRequests`) en lugar de representar un recurso (sustantivo). Rompe el estándar REST. | Cambiar la ruta a `GET /requests`. |
| `GET /requests/:id` | Obtener una solicitud específica por su identificador. | `id` en la URL (ej. `/requests/1`) | Si existe: Status 200 OK con el objeto JSON. Si no existe: Status 200 OK con `{ error: 'Request not found' }`. | Devuelve un estado `200 OK` incluso cuando no encuentra el recurso. | Mantener la ruta, pero devolver un estado `404 Not Found` cuando el ID no exista. |
| `POST /requests` | Crear una nueva solicitud de mantenimiento. | JSON Body con `title`, `description` y `priority` | Status 200 OK con el objeto JSON de la nueva solicitud. | Devuelve un estado `200 OK` al crear un recurso, en lugar del código estándar para creación. | Devolver un estado `201 Created` al crear exitosamente el recurso. |

## Contrato Propuesto

1. **Listar Solicitudes:** 
   - **Método y Ruta:** `GET /requests`
   - **Respuesta Esperada:** `200 OK` con el arreglo de todas las solicitudes.
2. **Obtener Solicitud Específica:**
   - **Método y Ruta:** `GET /requests/:id`
   - **Respuesta Esperada:** `200 OK` con el objeto si existe, o `404 Not Found` con un mensaje de error si no existe.
3. **Crear Solicitud:**
   - **Método y Ruta:** `POST /requests`
   - **Entrada:** Body en formato JSON con `title`, `description` y `priority`.
   - **Respuesta Esperada:** `201 Created` con el objeto recién creado.
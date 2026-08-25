# Comparación y Correcciones

## ¿Qué cambió entre la versión recibida y la corregida?

1. **Refactorización de ruta `GET` (RESTful Design):**
   - **Antes:** `app.get('/getRequests', ...)`
   - **Después:** `app.get('/requests', ...)`
   - **Por qué:** En las APIs REST, las rutas deben identificar recursos mediante sustantivos plurales (`/requests`), mientras que la acción ya viene definida por el método HTTP (`GET`).

2. **Manejo de estado HTTP para recursos no encontrados (404):**
   - **Antes:** Si no se encontraba el `id`, el servidor respondía `res.json({ error: 'Request not found' })`, lo cual por defecto envía un estado `200 OK`.
   - **Después:** Se agregó `.status(404)` a la respuesta de error: `return res.status(404).json({ error: 'Request not found' });`.
   - **Por qué:** El ciclo de vida de la petición exige informar correctamente al cliente sobre el resultado. Un código `404` indica explícitamente que el recurso solicitado no existe en el servidor.

3. **Manejo de estado HTTP para creación de recursos (201):**
   - **Antes:** Al crear una solicitud exitosamente, la API respondía con `res.status(200).json(newRequest);`.
   - **Después:** Se cambió a `res.status(201).json(newRequest);`.
   - **Por qué:** El estándar HTTP dicta que el código `201 Created` es la respuesta adecuada tras una petición `POST` que resulta en la creación exitosa de un nuevo recurso.

## Código Corregido (`server.js`)

```javascript
import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

const requests = [
  {
    id: 1,
    title: 'Projector does not turn on',
    description: 'The projector in room 204 shows no image during class.',
    status: 'open',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Broken chair in the lab',
    description: 'One chair in the computer lab has a loose back rest.',
    status: 'in-progress',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Wi-Fi drops in the library',
    description: 'The connection drops every few minutes on the second floor.',
    status: 'open',
    priority: 'low'
  }
];

let nextId = 4;

// CORRECCIÓN: Cambiado de /getRequests a /requests
app.get('/requests', (req, res) => {
  res.json(requests);
});

app.get('/requests/:id', (req, res) => {
  const id = Number(req.params.id);
  const request = requests.find((item) => item.id === id);

  if (!request) {
    // CORRECCIÓN: Se agregó el status 404 Not Found
    return res.status(404).json({ error: 'Request not found' });
  }

  res.json(request);
});

app.post('/requests', (req, res) => {
  const newRequest = {
    id: nextId,
    title: req.body.title,
    description: req.body.description,
    status: 'open',
    priority: req.body.priority
  };

  nextId = nextId + 1;
  requests.push(newRequest);

  // CORRECCIÓN: Se cambió el status 200 a 201 Created
  res.status(201).json(newRequest);
});

app.listen(PORT, () => {
  console.log(`Request API Lite is running on http://localhost:${PORT}`);
});
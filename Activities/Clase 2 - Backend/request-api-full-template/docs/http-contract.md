# Contrato HTTP — Request API Full

> **Plantilla para completar.** Escribe este documento **antes** de implementar los
> manejadores. El contrato es la promesa que hace tu API; el código es la manera de cumplirla.
> Si primero escribes el código y después el contrato, estarás documentando lo que salió, no
> lo que decidiste.

## Recurso

Describe en dos o tres líneas qué representa una **solicitud** (`request`) en este sistema.

Una solicitud representa un aviso de mantenimiento para informar de un problema en una
instalación. Incluye la descripción, prioridad y estado actual de atención.

### Forma del recurso

| Campo         | Tipo   | Obligatorio | Quién lo asigna | Notas |
| ------------- | ------ | ----------- | --------------- | ----- |
| `id`          | number | sí          | servidor        | Identificador único. |
| `title`       | string | sí          | cliente         | No puede faltar ni estar en blanco. |
| `description` | string | no          | cliente         | Descripción del problema. |
| `status`      | string | sí          | servidor        | Al crear siempre es `open`. |
| `priority`    | string | no          | cliente         | Prioridad indicada por el cliente. |

---

## Endpoint 1 — Listar solicitudes

| Elemento              | Valor |
| --------------------- | ----- |
| Método                | `GET` |
| Ruta                  | `/requests` |
| Entrada               | Sin body ni parámetros obligatorios. |
| Respuesta de éxito    | `200` con un arreglo JSON. |
| Respuestas de error   | No previstas para esta ruta. |

**Ejemplo de respuesta**

```json
[
	{
		"id": 1,
		"title": "Projector does not turn on",
		"description": "The projector in room 204 shows no image during class.",
		"status": "open",
		"priority": "high"
	}
]
```

---

## Endpoint 2 — Consultar una solicitud

| Elemento              | Valor |
| --------------------- | ----- |
| Método                | `GET` |
| Ruta                  | `/requests/:id` |
| Entrada               | `id` numérico en la ruta. |
| Respuesta de éxito    | `200` con el objeto solicitado. |
| Respuestas de error   | `404` con `{ "error": "Request not found" }`. |

**Ejemplo de respuesta (éxito)**

```json
{
	"id": 1,
	"title": "Projector does not turn on",
	"description": "The projector in room 204 shows no image during class.",
	"status": "open",
	"priority": "high"
}
```

**Ejemplo de respuesta (error)**

```json
{
	"error": "Request not found"
}
```

---

## Endpoint 3 — Crear una solicitud

| Elemento              | Valor |
| --------------------- | ----- |
| Método                | `POST` |
| Ruta                  | `/requests` |
| Entrada               | Body JSON con `title` obligatorio; `description` y `priority` opcionales. |
| Respuesta de éxito    | `201` con la solicitud creada. |
| Respuestas de error   | `400` si `title` falta, no es texto o está en blanco. |

**Ejemplo de body de la petición**

```json
{
	"title": "Leaking faucet",
	"description": "The faucet in the third floor bathroom leaks.",
	"priority": "medium"
}
```

**Ejemplo de respuesta (éxito)**

```json
{
	"id": 4,
	"title": "Leaking faucet",
	"description": "The faucet in the third floor bathroom leaks.",
	"status": "open",
	"priority": "medium"
}
```

**Ejemplo de respuesta (error de validación)**

```json
{
	"error": "Title is required"
}
```

---

## Reglas transversales

Responde en una línea cada una:

1. Todas las respuestas de la API devuelven `Content-Type: application/json`.
2. Una ruta que no existe devuelve `404`.
3. El cuerpo de error siempre es un objeto JSON con la propiedad `error`.
4. El servidor ignora `id` y `status` enviados en el body; los asigna internamente.

## Decisiones que tomaste y por qué

Anota aquí cualquier decisión que no sea obvia leyendo las tablas (por ejemplo: por qué
elegiste un estado y no otro, o qué hiciste con los campos opcionales ausentes).

El servidor asigna siempre el `id` para evitar que el cliente elija identificadores repetidos.
También fuerza `status` a `open` al crear. Los campos opcionales ausentes se conservan como
`undefined`, sin inventar valores que el contrato no exige.

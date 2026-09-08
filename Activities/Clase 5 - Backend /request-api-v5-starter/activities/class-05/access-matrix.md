# Matriz de acceso — Request API v5

Dos roles exactos: `requester` y `agent`. Sin `admin`.

Completa cada celda con `Sí`, `No`, `Propias` o `Propia y abierta`.
La matriz puede discutirse, pero la implementación converge en la baseline
del taller (lámina Contrato fijo).

| Operación | Anónimo | Requester | Agent |
| --------- | ------: | --------: | ----: |
| `POST /auth/register` | `Sí` | `Sí`| `Sí` |
| `POST /auth/login` | `Sí` | `Sí` | `Sí` |
| `GET /auth/me` | `No` | `Sí` | `Sí` |
| `GET /requests` | `No` | `Propias` | `Si` |
| `GET /requests/:id` | `No` | `Propias` | `Si` |
| `GET /requests/:id/history` | `No` | `Propias` | `Si` |
| `POST /requests` | `No` | `Si` | `No` |
| Editar título/descripción | `No` | `Propia y abierta` | `No` |
| Cambiar prioridad | `No` | `No` | `Si` |
| Cambiar estado | `No` | `No` | `Si` |

## Campos controlados por el servidor

Lista aquí los campos que el cliente JAMÁS puede enviar, en el registro y en
las solicitudes, y qué respuesta exacta produce intentarlo.

Registro: "role" "id" "createdAt" "passwordHash" = 400 SERVER_CONTROLLED_FIELD 

Crear Solicitud: "createdBy" "status" "id" = 400 SERVER_CONTROLLED_FIELD

Actualizar Solicitud: "updatedAt" "changedBy" 

## Solicitudes heredadas

¿Quién ve las solicitudes sin propietario (`created_by IS NULL`)? ¿Por qué?

Solo las ven los agentes porque son los que tienen permiso y los usuarios no.

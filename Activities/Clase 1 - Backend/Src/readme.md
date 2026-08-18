# Proyecto Src - Servidor HTTP básico con Node.js

## 1. README.md

### Descripción general
Este proyecto consiste en un servidor HTTP mínimo desarrollado con Node.js usando el módulo nativo `http`. Su objetivo es demostrar, de forma práctica y didáctica, cómo un servidor recibe solicitudes del cliente, evalúa rutas, ejecuta lógica simple y devuelve respuestas HTTP con encabezados y cuerpos adecuados.

La aplicación expone tres rutas principales:

- `/`: devuelve un mensaje de bienvenida con las rutas disponibles.
- `/health`: responde con un estado de salud del servicio.
- `/api/info`: devuelve un objeto JSON con metadatos del servidor.

El objetivo pedagógico del ejercicio es comprender el flujo básico de una petición HTTP, identificar errores comunes en la creación de servidores, y aplicar correcciones sobre fallas reales de laboratorio.

### Tecnologías utilizadas
- Node.js
- Módulo nativo `http` de Node.js
- JavaScript (CommonJS)
- HTTP/1.1 para manejo de solicitudes y respuestas
- Navegador web para pruebas manuales


### Alcance funcional
El servicio es un ejemplo de backend mínimo, y su valor principal se encuentra en la comprensión de los principios fundamentales:

- escucha de conexiones TCP en un puerto definido;
- manejo de rutas mediante `request.url`;
- envío de códigos HTTP (`200`, `404`);
- cabeceras de respuesta (`Content-Type`);
- cierre de la respuesta con `response.end()`.

---

## 2. Instrucciones para ejecutar

### Requisitos previos
Antes de levantar el servidor, asegúrate de contar con lo siguiente:

1. Node.js instalado en la máquina.
2. Un terminal con acceso a la línea de comandos.
3. Un navegador para realizar pruebas HTTP.
4. Acceso al directorio del proyecto `Activities/Clase 1 - Backend/Src`.

Para verificar que Node.js está instalado:

```bash
node -v
```

Si la salida muestra una versión de Node.js, el entorno está listo.

### Paso 1: ubicarse en el proyecto
```bash
cd "/home/sitiouno/Escritorio/backend-course/Activities/Clase 1 - Backend/Src"
```

### Paso 2: revisar la estructura
```bash
ls -la
```

Deberías ver archivos como `server.js`, `hello.js` e `index.html`.

### Paso 3: instalación de dependencias
Este proyecto no requiere librerías externas ni dependencias adicionales para ejecutarse con Node.js. La ejecución se realiza directamente con el runtime del sistema. Si se desea mantener un proyecto más formal, se puede ejecutar:

```bash
npm init -y
```

No obstante, para este ejercicio específico, no es obligatorio instalar paquetes adicionales.

### Paso 4: configuración de variables de entorno
El servidor está pensado para ejecutarse en el puerto `3000` por defecto. Si se desea externalizar la configuración, se recomienda usar una variable de entorno como la siguiente:

```bash
export PORT=3000
```

En la versión actual del proyecto, la constante del puerto se define directamente en el archivo `server.js`, por lo que la ejecución más simple es:

```bash
node server.js
```

### Paso 5: ejecutar el servidor
```bash
node server.js
```

Deberías ver una salida similar a esta:

```bash
Server listening on http://localhost:3000
```

### Paso 6: probar rutas en el navegador
Una vez levantado el servicio, abre estas URLs en el navegador:

- `http://localhost:3000/`
- `http://localhost:3000/health`
- `http://localhost:3000/api/info`

### Paso 7: cerrar el servidor
Para detener el proceso, presiona:

```bash
Ctrl + C
```

### Recomendación práctica
Para validar que el servidor responde correctamente, conviene probar ambas rutas mediante el navegador y observar la salida en consola del terminal. En cada request se imprime la ruta exacta y el método usado, por ejemplo:

```bash
GET /
GET /health
GET /api/info
```

---

## 3. Diagrama del recorrido de una petición

### Flujo conceptual de una solicitud HTTP

```text
ORIGEN: Navegador o cliente HTTP
        ↓
   1. El usuario escribe una URL en el navegador
      Ejemplo: http://localhost:3000/health
        ↓
   2. El navegador crea una petición HTTP
      Método: GET
      Ruta: /health
      Destino: localhost:3000
        ↓
   3. La petición viaja por la red hacia el socket TCP del servidor
      Destino final: proceso Node.js escuchando en el puerto 3000
        ↓
   4. El servidor recibe la solicitud en la función callback de http.createServer()
      Parámetros: request, response
        ↓
   5. Se procesa la ruta solicitada
      if (request.url === '/')
      if (request.url === '/health')
      if (request.url === '/api/info')
      else => 404 Not Found
        ↓
   6. Se valida la lógica de negocio y se construye la respuesta
      - Estado HTTP
      - Encabezados (Content-Type)
      - Cuerpo (texto o JSON)
        ↓
   7. Se envía la respuesta al cliente con response.end()
      Ejemplo: "Health check: OK" o JSON serializado
        ↓
   8. El navegador interpreta la respuesta y la renderiza o la procesa
        ↓
DESTINO FINAL: Cliente recibe la respuesta HTTP
```

### Descripción por pasos
- Dirección del flujo: el flujo va del cliente hacia el servidor y luego retorna al cliente con la respuesta.
- Recepción: el servidor recibe la solicitud a través del socket del puerto configurado.
- Validación: el código verifica la URL y el método solicitado.
- Lógica de negocio: se determina qué respuesta corresponde a cada ruta.
- Consulta a base de datos: en este caso no aplica, porque el proyecto es un ejemplo local sin persistencia.
- Respuesta: se envía un código HTTP y un cuerpo comprensible para el cliente.

> En una implementación real, el flujo incluiría además validaciones, middlewares, autenticación, consulta a base de datos, servicio de negocio y serialización de datos antes de responder.

---

## 4. Explicación de una falla diagnosticada

A continuación, se documenta una falla realista abordada en el laboratorio:

- **Comportamiento observado:** Al abrir `http://localhost:3000/health`, la pestaña queda cargando indefinidamente. El servidor imprime la petición en consola, pero nunca llega la respuesta al cliente.
- **Hipótesis inicial:** Si la terminal registra la solicitud pero la conexión no finaliza, probablemente el código entra al bloque correcto pero omite el cierre de la respuesta.
- **Evidencia revisada:** En el análisis del archivo `server.js`, el bloque de `/health` define el estado y los encabezados, pero no incluye ninguna instrucción finalizadora. La comparación con `/` y `/api/info` muestra que estas rutas sí hacen uso de `response.end()`.
- **Causa encontrada:** El problema real era la ausencia de `response.end()` dentro del bloque que atiende la ruta `/health`. Como la respuesta nunca se cerraba, la conexión TCP quedaba abierta y el navegador mantenía la petición en estado de espera.
- **Modificación realizada:** Se corrigió el bloque agregando la instrucción `response.end('Health check: OK');` dentro del caso `/health`.
- **Resultado y explicación final:** Tras reiniciar el servidor y volver a probar la ruta, la respuesta llega de inmediato con código `200` y texto `Health check: OK`. La corrección funcionó porque la conexión queda cerrada explícitamente y el cliente recibe el cuerpo esperado, terminando el ciclo completo de la solicitud.

---

## 5. Respuestas al ticket de salida

### 1. ¿Qué diferencia esencial existe entre frontend y backend?
El frontend es la capa visible para el usuario y se encarga de la interfaz y la interacción; el backend es la lógica y procesamiento que ocurre en el servidor, donde se reciben solicitudes, se evalúan reglas y se generan respuestas.

### 2. ¿Por qué el proceso de Node.js continúa activo después de ejecutar el archivo?
Porque el servidor queda escuchando en el puerto configurado mediante `server.listen()`. Mientras el proceso siga activo, el programa permanece en ejecución esperando nuevas conexiones y peticiones.

### 3. Si el navegador queda esperando indefinidamente, ¿qué revisarías primero?
Revisaría el bloque de la ruta solicitada para confirmar si se está cerrando la respuesta con `response.end()`. Si falta ese cierre, la conexión queda abierta y el cliente sigue esperando sin recibir datos.

### 4. Describe con tus propias palabras el recorrido de una petición.
Una petición comienza cuando el usuario escribe una URL o interactúa con la aplicación. El navegador genera una solicitud HTTP, la envía al puerto del servidor, el backend la recibe, valida la ruta y genera una respuesta adecuada, y finalmente el navegador muestra esa respuesta al usuario.

### 5. ¿Qué evidencia usarías para saber si el problema está en el navegador o en el servidor?
Usaría evidencia del servidor, como mensajes en consola, códigos HTTP, cabeceras, rutas solicitadas y la respuesta emitida. Si el servidor responde correctamente y la petición llega a la aplicación, el problema puede estar en el cliente o en la URL; si no llega respuesta o la conexión queda abierta, el problema es del backend.

---

## 6. Sección de profundización

### Concepto elegido: middlewares avanzados

- **¿Qué concepto nuevo encontraste?**
  El concepto de middlewares avanzados, entendidos como funciones intermedias que interceptan la solicitud antes de llegar a la lógica final. En frameworks como Express, estos middlewares pueden encargarse de autenticación, validación, logging, compresión, manejo de errores y control de CORS.

- **¿Cómo se relaciona con el servidor que construiste?**
  El servidor que desarrollamos ya tiene una forma básica de validación por ruta y respuesta, pero no incorpora una capa de funciones intermedias. Un middleware avanzado permitiría separar responsabilidades: validar el método HTTP, registrar la petición, verificar autorización, y luego ejecutar la ruta correspondiente. En otras palabras, llevaría la lógica de control a una etapa previa y más organizada.

- **¿Qué parte todavía no comprendes del todo?**
  Todavía me interesa entender con precisión cómo se estructuran los middlewares en un servidor real para que interactúen entre sí sin interferir en la solicitud o la respuesta, especialmente en casos con errores y con lógica de autenticación y caché.

- **¿Qué evidencia o experimento podrías utilizar para investigarla?**
  Una buena evidencia sería crear un servidor sencillo con un middleware de logging, otro de validación y uno de manejo de errores, y probar distintos casos como `/`, `/health` y rutas inexistentes para observar el orden de ejecución y el efecto sobre la respuesta final.

---

## 7. Sección AI usage

- **Si se utilizó IA (sí/no):** Sí.
- **Para qué se utilizó:** Para estructurar la documentación.
- **Qué sugerencia de la IA se aceptó:** La sugerencia de organizar el contenido en secciones claras, mantener un tono profesional y relacionar cada fallo con la evidencia real del código.
- **Cómo se comprobó el resultado final:** Se revisó el contenido del servidor real en `server.js`, se contrastó con los diagnósticos del laboratorio y se validó que la documentación refleja las rutas y correcciones observadas en la práctica.

---

## Conclusión
El proyecto `Src` es una base fundamental para comprender cómo funciona un servidor HTTP en Node.js sin dependencias externas. Más allá de la simple respuesta a rutas, enseña conceptos clave del backend: manejo de tráfico, validación de peticiones, respuesta HTTP y diagnóstico de fallas de tiempo de ejecución. Es un punto de partida útil para avanzar hacia aplicaciones más complejas con APIs, autenticación, persistencia y servicios distribuidos.

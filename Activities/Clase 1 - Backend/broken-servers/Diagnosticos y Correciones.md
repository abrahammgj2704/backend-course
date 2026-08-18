Laboratorio de fallas - Broken Servers

Servidor fault - 1 

 1. Comportamiento observado: Al abrir http://localhost:3000/health, la pestaña se queda cargando indefinidamente. Las demás rutas funcionan normal y la terminal imprime GET /health sin arrojar errores.

 2. Hipótesis: Si la terminal registra la petición pero la respuesta nunca llega al cliente, el código entra al bloque de /health pero la conexión se queda abierta porque falta enviar datos y cerrar la respuesta.

 3. Evidencia: Al comparar el bloque de código de /health con el de / o /api/info, se observa que a /health le falta invocar el método que finaliza el envío de la respuesta.

 4. Causa: En el bloque condicional de if (request.url === '/health'), se establecen el código de estado y los encabezados, pero falta la llamada a response.end('OK'), dejando la conexión abierta de manera indefinida.

 5. Corrección: Añadir la instrucción response.end('Health check: OK'); dentro del bloque de /health.

 6. Resultado: Al reiniciar el servidor y probar /health, responde de inmediato con el estado 200 y el texto OK.


Servidor fault - 2

 1. Comportamiento observado: Al consultar http://localhost:3000/health, el servidor devuelve un error 404 Not found.
 
 2. Hipótesis: Si la ruta devuelve 404, significa que ninguna de las condiciones anteriores coincidió con la URL solicitada.
 
 3. Evidencia: Al revisar el código donde se evalúa la ruta, la ruta escrita en el código difiere de la que se está solicitando en el navegador.
 
 4. Causa: El condicional está escrito como if (request.url === '/helth') (le falta la letra 'a'), por lo que la URL real /health no hace match y cae en el bloque final de 404.
 
 5. Corrección: Corregir el string a if (request.url === '/health').
 
 6. Resultado: Al reejecutar, /health responde correctamente con código 200 y cuerpo OK.


Servidor fault - 3

 1. Comportamiento observado: Al intentar abrir cualquier ruta en el navegador usando el puerto 3000, la conexión es rechazada de inmediato ( ERR_CONNECTION_REFUSED).

 2. Hipótesis: Si el navegador no logra establecer la conexión en el puerto esperado, es muy probable que el servidor se encuentre escuchando en un puerto distinto al configurado o esperado.

 3. Evidencia: Al revisar la constante del puerto definida al inicio del archivo, se observa un valor diferente al puerto estándar 3000.

 4. Causa: La constante PORT está configurada con el valor 3001 (const PORT = 3001;), por lo que el servidor arranca en un puerto distinto al que el usuario intenta consumir.
 
 5. Corrección: Cambiar la variable del puerto a const PORT = 3000;.

 6. Resultado: El servidor inicia en el puerto correcto y permite la conexión en el navegador (http://localhost:3000) con el puerto 3000.


Servidor fault - 4

 1. Comportamiento observado: Al consultar /api/info, el navegador o cliente recibe el encabezado indicando que es contenido JSON, pero falla al intentar procesarlo o parsearlo.
 
 2. Hipótesis: Si el encabezado declara application/json, pero el contenido enviado es un string malformado que no cumple con el estándar JSON (por ejemplo, claves sin comillas dobles), el parser del cliente fallará.
 
 3. Evidencia: En el endpoint /api/info, la respuesta se envía utilizando un string literal de JavaScript con formato inválido para JSON ({ name: 'support-server', version: 1.0.0 } con comillas simples y claves sin comillas dobles) en lugar de utilizar JSON.stringify().

 4. Causa: Se envía un objeto plano en texto plano con comillas simples ("{ name: 'support-server', version: 1.0.0 }") en lugar de generar una cadena JSON válida, lo que rompe el analizador del consumidor.

 5. Corrección: Cambiar la línea de respuesta por el uso correcto de serialización: response.end(JSON.stringify({ name: 'support-server', version: '1.0.0', routes: ['/', '/health', '/api/info'] }));.

 6. Resultado: El endpoint devuelve un JSON estrictamente válido que el navegador y los clientes pueden interpretar sin errores.


Servidor fault - 5

 1. Comportamiento observado: Al navegar por cualquier ruta (ya sea /health, /api/info o un NotFound), el servidor siempre responde exactamente con el mismo contenido de la ruta principal.
 
 2. Hipótesis: Si todas las rutas devuelven el mismo resultado, es probable que la primera condición de la estructura de control siempre se evalúe como verdadera o que esté alterando la variable de ruta de forma incorrecta.
 
 3. Evidencia: Al examinar el primer bloque condicional, se está utilizando un operador de asignación (=) en lugar de un operador de comparación estricta (===).  
 
 4. Causa: La condición está escrita como if (request.url = '/'), lo cual asigna el string '/' a request.url y devuelve siempre un valor truthy, haciendo que la ejecución entre siempre en este bloque sin importar qué URL haya solicitado el cliente.  

 5. Corrección: Reemplazar el operador de asignación por el de comparación estricta: if (request.url === '/').  

 6. Resultado: Cada ruta evalúa su propio bloque de manera aislada y responde de acuerdo con la lógica esperada.


Servidor fault - 6

1. Comportamiento observado: Al ejecutar node fault-6.js, el script en la terminal se ejecuta y finaliza de forma instantánea sin mantener el servidor activo a la escucha.

2. Hipótesis: Si el proceso termina de inmediato sin arrojar errores de lógica web, es porque ocurre una excepción de tipo ReferenceError al intentar inicializar el método de escucha debido a una variable mal escrita o no declarada.

3. Evidencia: En la última sección del archivo donde se levanta el servidor, la función server.listen() hace referencia a una variable de puerto que no coincide con la declarada arriba.

4. Causa: Se utiliza la variable SERVER_PORT dentro de server.listen(SERVER_PORT, ...) la cual no fue declarada en el ámbito del script, provocando un fallo de referencia que detiene la ejecución del proceso de Node.js.

5. Corrección: Reemplazar SERVER_PORT por la variable correcta previamente definida: PORT (server.listen(PORT, ...)).

6. Resultado: El proceso arranca correctamente, se mantiene escuchando en el puerto e imprime el mensaje en consola Server listening on http://localhost:3000.



 

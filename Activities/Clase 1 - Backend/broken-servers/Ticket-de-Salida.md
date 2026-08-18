Ticket de Salida

 1. ¿Qué diferencia esencial existe entre frontend y backend?

     El frontend es lo que ve y con lo que el usuario interactua, el backend es donde se procesa la informacion lo que sucede en el servidor. 

2. ¿Por qué el proceso de Node.js continúa activo después de ejecutar el archivo?

    Si no cancela el proceso Node.Js, el servidor queda activo en el puerto que fue configurado.

3. Si el navegador queda esperando indefinidamente, ¿qué revisarías primero?

    Revisaria el bloque de codigo donde esta configurado el servidor y vericaria si no falta un response.end que finalice la solicitud.

4. Describe con tus propias palabras el recorrido de una petición.

    Escribes un texto en el URL del navegador, se crea la petición, viaja hacia el puerto, llega a Node.js, se prepara la respuesta y luego se muestra en el navegador.

5. ¿Qué evidencia usarías para saber si el problema está en el navegador o en el servidor?

    Si el servidor se levanta con exito y no se cae, si el problema esta en las solicitudes vericaria los bloques de URL.

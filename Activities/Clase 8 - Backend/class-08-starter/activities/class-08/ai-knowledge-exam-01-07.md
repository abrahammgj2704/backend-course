# Examen de conocimiento asistido por IA — clases 1-7

Guarda aquí el TRANSCRIPT COMPLETO de tu examen conversacional
(ITSU-KNOWLEDGE-01-07-1.0): todas las preguntas, todas tus respuestas,
todas las repreguntas y los cuatro bloques del cierre. Sin editar.

> Este examen complementa la evaluación de evidencia: mide lo que puedes
> explicar SIN el repositorio delante. El docente cruza ambos resultados
> y puede verificar cualquier respuesta oralmente.

## Metadata de mi examen

* studentId: [Abrahammachado.itsu@gmail.com]
* Modelo utilizado: [Geminis]
* Fecha: [29/09/2026]
* ¿Formato inválido y reparado una vez?: [no]

## TRANSCRIPT COMPLETO (desde COMENZAR hasta el BLOQUE 4)

```Preparación para Examen Conversacional
https://gemini.google.com/app/a341d04d6b3f2956

User prompt: Comenzar
Response: Entendido. Para dar inicio al examen conversacional, por favor indícame tu studentId (tu identificador o nombre de estudiante).
Ten en cuenta la dinámica del examen:
Realizaremos siete preguntas en total (una por clase), cada una acompañada de una repregunta obligatoria para profundizar.
El examen es estrictamente de memoria y sin material de apoyo ni consultas externas.
Los niveles de conocimiento asignados a cada clase y el reporte final se presentarán al concluir las siete preguntas.
Una vez que me proporciones tu studentId, escribe la palabra COMENZAR para formularte la primera pregunta.

User prompt: Abrahammachado.itsu@gmail.com
Response: Registrado el studentId: Abrahammachado.itsu@gmail.com.
Cuando estés listo, escribe COMENZAR para iniciar el examen con la primera pregunta (Clase 1 — Fundamentos de backend).

User prompt: comenzar
Response: Registrado. Comenzamos con la primera pregunta.
Pregunta 1 (Clase 1 — Fundamentos de backend): Imagina que un usuario abre su navegador e ingresa a nuestra API de solicitudes. Describe el viaje completo que realiza esa petición desde que el usuario presiona Enter en el navegador hasta que ve la información en su pantalla.

User prompt: Se ingresa y se analiza la solicitud URL, se traduce el DNS y el método http, viaja al backend y le backend o servidor devuelve la información si esta alojada en el backend
Response: Registrado.
Repregunta 1: Mencionas que la petición viaja al backend y este devuelve la información si está alojada allí. ¿Qué ocurre exactamente en el servidor si la información solicitada no existe o la lógica de negocio determina que no debe procesarse, y qué diferencia hay entre ese escenario y cuando el servidor está completamente apagado?

User prompt: Si la información no existe el servidor enviara un codigo 404 not found y terminara con la solicitud, la diferencia es que el servidor esta activo y recibio la solicitud y respondio mientras que con el servidor apagado la solicitud se cae antes y responde un codigo 503
Response: Registrado. Continuemos.
Pregunta 2 (Clase 2 — HTTP y contratos): En nuestra API de solicitudes, necesitamos que un usuario cree una nueva solicitud indicando el título y la descripción. ¿Qué método HTTP se debería utilizar para esta acción, en qué parte de la petición HTTP deben viajar esos datos (título y descripción) y por qué se deben enviar en esa sección en lugar de hacerlo en la URL?

User prompt: Se debe utilizar el metodo POST y los datos deben ir en el body, No pueden ir en la URL porque ese espacio es solo para el metodo, filtros y rutas
Response: Registrado.
Repregunta 2: Explicas que van en el body porque la URL es solo para método, filtros y rutas. Si un desarrollador intentara enviar datos sensibles o extensos de la solicitud a través de la URL (por ejemplo, en el path o en el query string), ¿cuáles serían los problemas técnicos o de seguridad específicos que eso generaría?

User prompt: Violaria la sematica Rest, fuga de datos, fallas de seguridad y limites
Response: Registrado. Continuemos.
Pregunta 3 (Clase 3 — Recursos, estado y reglas): En nuestra API, una solicitud tiene un estado interno (por ejemplo, PENDIENTE, APROBADA, RECHAZADA). Si un cliente envía una petición para modificar el estado de una solicitud que ya está RECHAZADA intentando pasarla a APROBADA, ¿qué código de estado HTTP debería responder la API, por qué ese código y no un 400 o 404, y cuál es la diferencia entre recurso y representación pública en este contexto?

User prompt: Codigo 404 es not ofund Codigo 400 es bad request Seria el codigo 422 que
Response: Registrado.
Repregunta 3: Mencionas que sería un código 422. Sin embargo, en el diseño de APIs REST para reglas de negocio y transiciones de estado inválidas (como cambiar una solicitud de RECHAZADA a APROBADA), ¿por qué suele considerarse el código 409 (Conflict) como la opción más precisa frente a un 400 o un 422, y qué diferencia a la entidad interna (recurso) de la representación pública que se envía en el JSON?

User prompt: Porque si bien esta estructurado correctamente, no puede cambiarse
Response: Registrado. Continuemos.
Pregunta 4 (Clase 4 — PostgreSQL y persistencia): En el backend de nuestra API utilizamos PostgreSQL para almacenar las solicitudes. Explica cuál es la función de una migración frente a un seed y frente a una transacción en la base de datos, y por qué una consulta en el código debe parametrizarse obligatoriamente en lugar de concatenar/interpolar strings con las variables de la petición.

User prompt: Su funciones es migrar las tablas creadas en el codigo al base de datos y la consulta debe ser con los parametros de las tablas ya creadas ya que fueron migradas directamente desde el codigo a la base de datos
Response: Registrado.
Repregunta 4: Mencionas la migración, pero para completar el concepto: ¿qué rol cumple un seed en la base de datos y qué garantiza el uso de una transacción (commit/rollback)? Además, respecto a parametrizar consultas, ¿cuál es el riesgo específico de seguridad o de sintaxis si interpolamos variables directamente en la cadena SQL?

User prompt: El seed vendria siendo la informacion exacta que se incluira en las tablas de la base de datos, el riesgo seria fugas de informacion o fallas en el intento de actualizar informacion
Response: Registrado. Continuemos.
Pregunta 5 (Clase 5 — Autenticación y autorización): En nuestra API, cuando un usuario inicia sesión recibe un token JWT para autenticar sus siguientes peticiones. ¿Por qué las contraseñas en la base de datos se almacenan siempre hasheadas y nunca en texto plano, y por qué en cada petición el servidor debe verificar el JWT y derivar la identidad del usuario a partir del token en lugar de confiar en el ID enviado en el body?

User prompt: Deben ser hasheadas para que no se puedan ver a simple vista en el codigo, por autenticacion y saber que parametros puede modificar o que autorizacion tiene el usuari
Response: Registrado.
Repregunta 5: Mencionas que la contraseña se hashea para no verse en el código y que el token sirve para autenticación. Si un usuario requester común modifica el userId en el body de una petición enviando el ID de un usuario administrador, pero su JWT es de requester, ¿cómo reacciona la API si deriva la identidad del JWT frente a si la toma del body, y qué código de estado (401 o 403) corresponde en este caso?

User prompt: Responde el codigo 401, no autorizado
Response: Registrado. Continuemos.
Pregunta 6 (Clase 6 — Onboarding y pruebas): Al trabajar en nuestra API backend, la lógica del código está dividida en distintas capas (por ejemplo: routes, service, store, policy, mapper). Describe brevemente qué responsabilidad principal tiene la capa service frente a la capa store, y cuáles son las tres partes estructuradas en las que se divide una prueba unitaria o de integración.

User prompt: La capa service viene siendo el cerebro de la aplicacion y store la capa de datos
Response: Registrado.
Repregunta 6: Explicas adecuadamente la responsabilidad de service y store. Respecto a la segunda parte de la pregunta: ¿cuáles son las tres partes estructuradas (las tres fases tradicionales) que componen una prueba (testing), y por qué cuando descubrimos un fallo en producción es fundamental escribir una prueba que falle ANTES de corregir el código?

User prompt: no se
Response: Registrado. Continuemos.
Pregunta 7 (Clase 7 — Diagnóstico y errores): En un entorno de producción, cuando ocurre un error inesperado al procesar una solicitud, ¿por qué es crítico registrar los detalles del error en los logs del servidor (usando un request ID) pero enviarle al cliente únicamente una respuesta genérica como un 500 o 503 sin dar detalles internos, y cuál es la diferencia clave entre el endpoint /health y el endpoint /ready?

User prompt: Es fundamental llevar un registro con el request ID para asi saber en donde esta fallando el requerimiento sin dejarle saber al cliente que hay un error de servicio, la diferencia clave entre los endpoint /health sirve para saber el proceso esta vivo y /ready es para verificar que el proceso esta listo
Response: Registrado.
Repregunta 7: Mencionas acertadamente la diferencia entre /health (proceso vivo) y /ready (listo para recibir tráfico). Si la base de datos de nuestra API se cae temporalmente, ¿qué código de estado HTTP debería responder /health y cuál /ready, y qué riesgo de seguridad correríamos si en el log registramos todo el cuerpo de las peticiones sin aplicar una lista de campos permitidos (allowlist)?

User prompt: El endpoint /health debe responder codigo 200 ok y el /ready debe responder codigo 503, correriamos el riesgo de mostrar todo la informacion proporcianda
Response: BLOQUE 1 — RESULT_CODE
ITSU-KNOWLEDGE|V=1.0|R=BACKEND-01-07-K1|C01=2|C02=2|C03=1|C04=1|C05=1|C06=1|C07=3|ACTION=SUPPORT
BLOQUE 2 — JSON
{
  "resultCode": "ITSU-KNOWLEDGE|V=1.0|R=BACKEND-01-07-K1|C01=2|C02=2|C03=1|C04=1|C05=1|C06=1|C07=3|ACTION=SUPPORT",
  "studentId": "Abrahammachado.itsu@gmail.com",
  "action": "SUPPORT",
  "signals": ["NONE"],
  "classes": [
    {
      "classId": "01",
      "level": 2,
      "question": "Describe el viaje completo que realiza esa petición desde que el usuario presiona Enter en el navegador hasta que ve la información en su pantalla.",
      "evidence": "menciona DNS, método HTTP y servidor, pero confunde el error cuando está apagado asignando un 503."
    },
    {
      "classId": "02",
      "level": 2,
      "question": "¿Qué método HTTP se debería utilizar para esta acción, en qué parte de la petición HTTP deben viajar esos datos y por qué?",
      "evidence": "asigna correctamente POST y body, pero justifica no usar la URL señalando erróneamente que ahí va el método."
    },
    {
      "classId": "03",
      "level": 1,
      "question": "¿Qué código de estado HTTP debería responder la API si se intenta pasar de RECHAZADA a APROBADA y por qué?",
      "evidence": "propone un código 422 y no logra explicar ni la distinción frente a 409 ni el concepto de recurso vs representación."
    },
    {
      "classId": "04",
      "level": 1,
      "question": "Explica la función de una migración frente a un seed y frente a una transacción, y por qué se parametrizan las consultas SQL.",
      "evidence": "menciona migración y seed pero no aborda la transacción ni la prevención de inyección SQL mediante parametrización."
    },
    {
      "classId": "05",
      "level": 1,
      "question": "¿Por qué las contraseñas se almacenan hasheadas y por qué se deriva la identidad desde el token y no del body?",
      "evidence": "menciona que el hash es para no verlas en código y confunde el estado de autorización (403) respondiendo 401."
    },
    {
      "classId": "06",
      "level": 1,
      "question": "Describe la responsabilidad de service vs store y las tres partes de una prueba.",
      "evidence": "identifica bien service y store ('cerebro' vs 'capa de datos'), pero declara no saber las partes de una prueba (AAA)."
    },
    {
      "classId": "07",
      "level": 3,
      "question": "¿Por qué se ocultan detalles de errores inesperados y cuál es la diferencia entre /health y /ready?",
      "evidence": "distingue con precisión /health de /ready y responde correctamente sobre los códigos 200 y 503 ante la caída de la base de datos."
    }
  ],
  "reviewTopics": [
    "Diseño de API REST: Códigos de estado (401 vs 403, 409 vs 422) y regla del body vs JWT",
    "Seguridad en Base de Datos: Inyección SQL, consultas parametrizadas y transacciones",
    "Estructura de Pruebas Unitarias: Patrón AAA (Arrange, Act, Assert) y desarrollo guiado por pruebas"
  ],
  "teacherDigest": "Comprensión conceptual clara en observabilidad (/health y /ready) y separación por capas básica. Muestra vacíos importantes en seguridad de persistencia (SQL injection), manejo de autenticación/autorización con JWT y metodología de testing."
}


BLOQUE 3 — REPORTE DEL ESTUDIANTE
Explicaste de forma precisa la diferencia entre los endpoints de diagnóstico /health (que evalúa si el proceso sigue activo con 200) y /ready (que evalúa la capacidad de servir tráfico devolviendo 503 si la base de datos cae), además de distinguir correctamente el rol de service como lógica de negocio y store como persistencia.
Sin embargo, las repreguntas mostraron dudas en puntos clave de arquitectura y seguridad:
Inyección SQL y Persistencia: No identificaste el riesgo de inyección de código SQL al interpolar cadenas ni el papel de las transacciones ACID.
Autenticación vs Autorización: Confundiste un error de permisos (403 Forbidden) con uno de identidad no validada (401 Unauthorized), y no explicaste el almacenamiento seguro de contraseñas mediante funciones hash unidireccionales con sal.
Estructura de Testing: Quedó sin responder el esquema fundamental de pruebas (Preparación, Acción, Comprobación / AAA).
Temas prioritarios de repaso en el proyecto:
Seguridad y Persistencia: Revisa las consultas en la capa store para identificar el uso de parámetros ($1, $2) y la ejecución de transacciones (BEGIN/COMMIT/ROLLBACK).
Autorización y Middleware: Observa cómo las capas policy y los middlewares verifican los roles del JWT retornando 403 Forbidden si la identidad no posee permisos.
Estructura de Testing: Revisa la suite de pruebas del proyecto para identificar la estructura Arrange, Act, Assert.
BLOQUE 4 — FEEDBACK DOCENTE
Prioridades transversales: Reforzar las implicaciones de seguridad en backend (inyección SQL y manejo de contraseñas) y profundizar en el estándar de diseño REST (códigos de estado e inmutabilidad de la identidad en JWT).
Señales registradas: NONE.
Preguntas orales sugeridas para verificación:
¿Por qué un ataque de Inyección SQL ocurre cuando interpolamos texto en la consulta y de qué manera los parámetros preparados del driver evitan que la base de datos interprete el input como código? Respuesta mínima esperada: Al interpolar, el input del usuario puede alterar la sintaxis del comando SQL. La parametrización separa la estructura del comando de los datos.
Si un usuario envía un JWT válido pero intenta modificar una solicitud que no le pertenece, ¿qué código debe retornar la API y por qué jamás 401? Respuesta mínima esperada: Debe retornar 403 Forbidden porque el servidor ya sabe quién es (está autenticado), pero no tiene los permisos para ese recurso.
Nivel de confianza del examen: Alto (7/7 preguntas y repreguntas completadas dentro del flujo formal).


```

## Metacognición (responde tú, después del examen)

1. ¿Qué pregunta o repregunta te costó más, y por qué crees que fue esa?

[La pregunta 3]

2. Compara este resultado con tu reporte de evidencia: ¿coinciden? ¿Dónde
   difieren y qué te dice esa diferencia?

[COMPLETAR]

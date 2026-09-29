# Autoevaluación asistida por IA — checkpoint 1-7

Guarda aquí la salida COMPLETA y SIN EDITAR de tu única ejecución del
prompt ITSU-CHECKPOINT-01-07-1.0.

> Este reporte es un insumo de la evaluación del curso: el docente lo
> revisa junto con tu evidencia y puede verificarlo oralmente. Si no
> estás de acuerdo con algo, cuestiónalo con argumentos en la
> metacognición.

## Metadata de mi ejecución

* Modelo utilizado: [COMPLETAR]
* Fecha: [COMPLETAR]
* Commit evaluado: [COMPLETAR]
* ¿Necesité el prompt de reparación?: [no / sí, una vez / MODEL_FORMAT_FAILURE]

## BLOQUE 1 — RESULT_CODE

```text
[ITSU-PROGRESS|V=1.0|R=BACKEND-01-07-R1|STATUS=PARTIAL|C01=X-X-X-X|C02=2-X-X-X|C03=X-X-X-X|C04=2-X-X-X|C05=3-3-2-2|C06=3-3-2-3|C07=3-3-2-3|ACTION=SUPPORT]
```

## BLOQUE 2 — JSON

```json
[{
  "protocolVersion": "ITSU-CHECKPOINT-01-07-1.0",
  "rubricVersion": "BACKEND-01-07-R1",
  "status": "PARTIAL",
  "action": "SUPPORT",
  "studentId": "Abrahammachado.itsu@gmail.com",
  "modelReportedByStudent": "[COMPLETAR después de ejecutar el prompt]",
  "classes": [
    {
      "classId": "01",
      "title": "Fundamentos de backend",
      "levels": {
        "knowledge": "X",
        "practice": "X",
        "verification": "X",
        "explanation": "X"
      },
      "confidence": "high",
      "evidence": [],
      "strength": "Sin evidencia presentada.",
      "gap": "Ausencia total de artefactos y respuestas escritas sobre fundamentos de backend.",
      "nextAction": "Completar la pregunta de diagnóstico de la Clase 01 y presentar los ejercicios base."
    },
    {
      "classId": "02",
      "title": "HTTP y contratos",
      "levels": {
        "knowledge": 2,
        "practice": "X",
        "verification": "X",
        "explanation": "X"
      },
      "confidence": "high",
      "evidence": [
        {
          "artifact": "http-contract.md",
          "reference": "Activities/Clase 2 - Backend/request-api-full-template/docs/http-contract.md"
        }
      ],
      "strength": "Documentación parcial del contrato de API en formato Markdown.",
      "gap": "No se incluyen respuestas del cuestionario ni evidencias de ejecución/endpoints activos.",
      "nextAction": "Responder a la pregunta escrita de la Clase 02 especificando un endpoint completo."
    },
    {
      "classId": "03",
      "title": "Recursos, estado y reglas",
      "levels": {
        "knowledge": "X",
        "practice": "X",
        "verification": "X",
        "explanation": "X"
      },
      "confidence": "high",
      "evidence": [],
      "strength": "Sin evidencia presentada.",
      "gap": "No hay artefactos ni respuestas conceptuales relativas a la gestión de estados y recursos.",
      "nextAction": "Explicar en el cuestionario la diferencia entre dato inválido y transición incompatible."
    },
    {
      "classId": "04",
      "title": "PostgreSQL y persistencia",
      "levels": {
        "knowledge": 2,
        "practice": "X",
        "verification": "X",
        "explanation": "X"
      },
      "confidence": "high",
      "evidence": [
        {
          "artifact": "SQL Migrations",
          "reference": "Activities/Clase 5 - Backend /request-api-v5-starter/database/migrations/"
        }
      ],
      "strength": "Presencia de archivos de migración estructurados en SQL.",
      "gap": "Falta completar la explicación escrita sobre migraciones, seeds y transacciones.",
      "nextAction": "Responder la pregunta de la Clase 04 relacionando conceptos con los scripts del proyecto."
    },
    {
      "classId": "05",
      "title": "Autenticación y autorización",
      "levels": {
        "knowledge": 3,
        "practice": 3,
        "verification": 2,
        "explanation": 2
      },
      "confidence": "high",
      "evidence": [
        {
          "artifact": "auth-contract.md",
          "reference": "Activities/Clase 5 - Backend /request-api-v5-starter/activities/class-05/auth-contract.md"
        },
        {
          "artifact": "validation-evidence.md",
          "reference": "Activities/Clase 5 - Backend /request-api-v5-starter/activities/class-05/validation-evidence.md"
        }
      ],
      "strength": "Diseño detallado de contratos de autenticación (login/registro) con manejo explícito de errores.",
      "gap": "El registro de validación guardado está incompleto (secciones en blanco) y no hay respuesta en el cuestionario.",
      "nextAction": "Completar la pregunta teórica de la Clase 05 sobre JWT y autenticación vs. autorización."
    },
    {
      "classId": "06",
      "title": "Onboarding y pruebas",
      "levels": {
        "knowledge": 3,
        "practice": 3,
        "verification": 2,
        "explanation": 3
      },
      "confidence": "high",
      "evidence": [
        {
          "artifact": "work-log.md",
          "reference": "Activities/Clase 6 - Backend/class-06-starter/activities/class-06/work-log.md"
        },
        {
          "artifact": "validation-evidence.txt",
          "reference": "Activities/Clase 6 - Backend/class-06-starter/activities/class-06/validation-evidence.txt"
        }
      ],
      "strength": "Explicación clara del flujo de peticiones, corrección de errores de colección y trazabilidad en el log de trabajo.",
      "gap": "La salida de validación guardada figura como texto estático no verificado en ejecución viva; cuestionario pendiente.",
      "nextAction": "Detallar en la pregunta de la Clase 06 el desglose de una prueba automatizada del proyecto."
    },
    {
      "classId": "07",
      "title": "Diagnóstico y errores",
      "levels": {
        "knowledge": 3,
        "practice": 3,
        "verification": 2,
        "explanation": 3
      },
      "confidence": "high",
      "evidence": [
        {
          "artifact": "incident-report.md",
          "reference": "Activities/Clase 7 - Backend/activities/class-07/incident-report.md"
        },
        {
          "artifact": "validation-evidence.txt",
          "reference": "Activities/Clase 7 - Backend/activities/class-07/validation-evidence.txt"
        }
      ],
      "strength": "Documentación estructurada de reproducción de incidentes y registro de trazabilidad/errores.",
      "gap": "Falta responder la pregunta teórica asociando la investigación a endpoints de health/readiness.",
      "nextAction": "Completar la respuesta a la pregunta 07 diferenciando síntoma, hipótesis y probes de salud."
    }
  ],
  "progressPattern": {
    "label": "improving",
    "explanation": "Se observa una progresión ascendente clara: de la falta total de artefactos en las Clases 1 y 3 a una entrega técnica sólida en contratos, trazabilidad e informes de incidentes en las Clases 5, 6 y 7."
  },
  "priorityConceptGaps": [
    "Cuestionario diagnóstico sin responder (todas las preguntas en [COMPLETAR]).",
    "Falta de artefactos base para las Clases 01 y 03.",
    "Evidencia de validación guardada como texto estático sin verificación de ejecución directa en vivo.",
    "Distinción formal entre health y readiness probes en la Clase 07.",
    "Explicación explicativa sobre firma y verificación de tokens JWT."
  ],
  "studentNextSteps": [
    "Completar la totalidad de las preguntas en la sección 'Cuestionario diagnóstico' de la evidencia.",
    "Reejecutar los scripts de validación (`npm run validate:class-05`, etc.) para asegurar que la evidencia sea verificable.",
    "Documentar formalmente los conceptos teóricos faltantes de las Clases 01 y 03."
  ],
  "teacherFeedback": {
    "supportPriority": "medium",
    "focusClassIds": ["01", "03", "05"],
    "topicsToReinforce": [
      "Fundamentos del flujo Request-Response y persistencia del proceso Node.js.",
      "Modelado de máquinas de estado y reglas de transición de recursos.",
      "Validación teórica de JWT (firma criptográfica vs. decodificación de payload)."
    ],
    "oralVerificationRecommended": true,
    "oralQuestions": [
      "¿Por qué un servidor en Node.js necesita el Event Loop activo para responder peticiones en lugar de cerrarse tras procesar una sola función?",
      "Si un cliente decodifica un JWT y ve `role: admin`, ¿por qué el backend debe verificar la firma obligatoriamente antes de autorizarlo?",
      "En el Incidente 701, ¿cuál fue la causa raíz exacta del error 500 al recibir un ID inválido y qué cambió en el middleware para responder 400?"
    ],
    "integrityReview": "not_needed",
    "integritySignals": ["NONE"],
    "reviewReason": "No hay señales de violación de integridad ni inconsistencias graves en el código expuesto; la brecha principal es la falta de completitud del cuestionario.",
    "teacherDigest": "El estudiante muestra una excelente evolución práctica en las clases 5, 6 y 7 (contratos, manejo de errores e incidentes). Sin embargo, el cuestionario diagnóstico no fue completado y faltan artefactos de las clases 1 y 3. Se requiere apoyo en consolidación teórica."
  }
}]
```

## BLOQUE 3 — Reporte del estudiante

[REPORTE DEL ESTUDIANTE

Panorama general: Muestras un progreso técnico notable. Aunque no se registraron artefactos iniciales para las Clases 01 y 03, tu desempeño a partir de la Clase 05 muestra una rápida apropiación en temas complejos como autenticación, estructura de contratos HTTP, refactorización de middleware y diagnóstico de incidentes.   Fortalezas demostradas: Excelente capacidad para documentar e investigar incidentes en la Clase 07 (incident-report.md), un buen diseño de contratos de autenticación en la Clase 05 (auth-contract.md) y claridad en el registro del flujo de solicitudes en la Clase 06 (work-log.md).   Temas que necesitan refuerzo: Integración conceptual teórica, especialmente en los fundamentos del ciclo de vida de un servidor Node.js (Clase 01) y en el modelado formal de transiciones de estado de recursos (Clase 03).   Evolución entre clases: Progresión claramente positiva. Pasaste de una ausencia de registros al inicio a producir artefactos técnicos detallados, ordenados y bien razonados en las capas de seguridad y diagnósticos.   Tres prioridades:Responder las 7 preguntas del cuestionario diagnóstico adjunto.   Consolidar los conceptos básicos de las Clases 01 y 03.   Asegurar la ejecución directa y verifícable de los validador de las Clases 05 y 06.   Preguntas para comprobar comprensión:¿Qué diferencia existe entre decodificar el payload de un JWT y verificar su firma criptográfica?   ¿Qué código HTTP debe devolver un recurso cuando el cliente solicita modificarlo a un estado al que no se permite pasar según las reglas del negocio?   ¿Cómo evita un request-id en el middleware que perdamos el rastro de una petición que falla silenciosamente?   Evidencia faltante: Respuestas de texto al cuestionario (todas aparecen como [COMPLETAR]) y artefactos explícitos asociados a los ejercicios de las Clases 01 y 03.]

## BLOQUE 4 — Feedback docente

[FEEDBACK DOCENTE

Temas con mayor riesgo conceptual: Fundamentos de procesos continuos/Event Loop (Clase 01), validación y transiciones de estados incompatibles (Clase 03), e interpretación del proceso de verificación de firmas en esquemas JWT (Clase 05).

Evidencia contradictoria o insuficiente: Las preguntas escritas del cuestionario no fueron respondidas (permanecen con el valor predeterminado [COMPLETAR]). Los registros de validaciones de las Clases 05 y 06 existen como archivos de texto pero requieren verificación en ejecución.   

Clases que conviene reforzar: Clase 01, Clase 03 y Clase 05.   

Verificación oral recomendada: Sí, enfocada en comprobar la autoría de la lógica de incidentes de la Clase 07 y el entendimiento real de autenticación/autorización.   

Preguntas priorizadas y respuesta mínima esperada:

  Pregunta: ¿Por qué un servidor en Node.js necesita permanecer activo escuchando un puerto?
  
  Respuesta mínima: Porque es un proceso persistente basado en un bucle de eventos (Event Loop) preparado para recibir y procesar solicitudes asíncronas en cualquier momento sin cerrarse tras la primera petición.
  
  Pregunta: ¿Por qué es insuficiente confiar en los datos de un JWT sin verificar su firma?
  
  Respuesta mínima: Porque el payload solo está codificado en Base64 y cualquier cliente podría alterarlo (por ejemplo, cambiar el rol); la firma garantiza que la información no ha sido manipulada y proviene de la clave secreta del servidor.   
  
  Pregunta: En el Incidente 701, ¿qué provocaba el error 500 y cómo se solucionó?
  
  Respuesta mínima: El backend intentaba procesar o mapear un ID inválido (como un texto) directamente en la consulta/lógica sin validar la entrada, provocando un fallo no capturado que derivaba en el middleware de error 500; la solución consiste en validar el tipo de entrada para responder explícitamente un 400 INVALID_REQUEST_ID.   ]

---

## Mi lectura del reporte (metacognición — esto SÍ lo escribes tú)

* ¿Estoy de acuerdo con el reporte?

  [Si]

* ¿Qué criterio considero incorrecto?

  [Ninguno]

* ¿Qué evidencia adicional aportaría?

  [Ninguna]

* ¿Qué recomendación voy a seguir?

  [Completar cuestionarios de diagnóstico con mis propias palabras y reejecutar los scripts de validación de las clases 5 y 6]

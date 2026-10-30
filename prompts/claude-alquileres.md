# Chat de Alquileres — resumen para el informe final

Oct 29, 2026 · @Tomas

## 1. Objetivo, período y herramientas

Este chat fue el chat de Alquileres: el lugar donde se definió cómo funciona el módulo de Alquileres del CRM y se preparó la migración de su historia, antes de programarlo. Funcionó desde mediados de septiembre hasta el 29/10/2026.

El objetivo, en palabras del primer pedido, fue que el chat se convirtiera "en la referencia funcional de Alquileres antes de pasar a una implementación importante". Había tres fuentes: el Excel de Renovaciones de contratos, el Excel de Interesados y PAC, el programa de recibos que la inmobiliaria usa desde 2016.

| Herramienta | Uso en este chat |
| --- | --- |
| Claude, en el Proyecto "CRM Inmobiliario" (modelo Opus; identificador configurado: claude-opus-5-5) | Análisis, propuestas, preguntas al negocio, documentación |
| Ejecución de código en Claude (Python, pandas, openpyxl, LibreOffice) | Lectura de los Excel, de la extracción de PAC y del documento de liquidaciones; cruce de datos; generación de planillas y archivos |
| Lectura de imágenes de Claude | Análisis de 13 capturas de pantallas de PAC y de una hoja de ajustes en papel |
| Claude Docs | El documento funcional de Alquileres, actualizado en cada etapa (22 secciones) |
| Claude Code (en otro chat, en la PC) | La implementación. Tomás traía sus preguntas a este chat y llevaba las respuestas |
| SQL Server (sqlcmd), ejecutado por Tomás | Los scripts de consulta que escribió la IA, de solo lectura, corridos en la PC de la oficina |

Las fechas anteriores al 24/09 son aproximadas: la primera parte del chat se resumió automáticamente por su extensión, y de ese tramo se conservan las decisiones y los textos de los pedidos, pero no todas las fechas exactas.

## 2. Qué se hizo, paso a paso

El trabajo avanzó en diez etapas, en orden cronológico. Cada una cerró con decisiones registradas en el documento funcional antes de pasar a la siguiente.

| Fecha | Etapa | Qué se hizo |
| --- | --- | --- |
| Mediados de septiembre | Análisis de los Excel | Lectura completa de las dos planillas, columna por columna: qué es dato, qué es estado, qué es paso de un trámite y qué es cálculo |
| Septiembre | Modelo conceptual | Entidades y relaciones del alquiler (persona, unidad, contrato, período, roles, trámite, recibos), con lo confirmado y lo pendiente separados |
| Septiembre | Catálogo de unidades | De 230 formas de escribir direcciones a 200 unidades, con normalización reversible |
| 23–24/09 | Relevamiento de PAC | Ocho scripts SQL de solo lectura sobre la base del programa, ejecutados por Tomás en la oficina, y análisis de 13 capturas de pantalla |
| 24/09 | Reglas de migración | Fecha de corte, carga final repetible, cuatro capas trazables (R1 a R9) |
| 25/09 | Extracción y primer cruce | Extracción cruda completa de PAC (32 tablas) y cruce con Renovaciones; libro de revisión con muestras |
| 25–30/09 | Validación humana | Muestras de 20 casos, revisión por Tomás, consultas al personal; versiones 2 y 3 del cruce |
| 28–29/09 | Reglas de ajuste | Respuestas del responsable de alquileres y la persona que calcula los ajustes, contrastadas con evidencia de los datos; modelo funcional versión 2 |
| 01–02/10 | Traspaso | Paquete de 14 archivos de datos y un README para el chat que implementa el CRM |
| 20–26/10 | Acompañamiento de la implementación | Respuestas a las preguntas de Claude Code sobre ajustes y recibos (decisiones 0074, 0094 y 0095) |

El corazón del trabajo fue el cruce entre PAC y Renovaciones. La dirección sirvió de puente, porque ninguna fuente tenía un identificador confiable de persona:

*[El diagrama del original no se incluye: proceso de cruce y validación, 3 pasos y 2 caminos de revisión.]*

Los vínculos fuertes se validaron con una muestra; los demás los revisó una persona, y todo quedó en un registro que se reaplica en cada versión nueva de las fuentes.

## 3. Quién decidió qué

La regla del chat fue que la IA propone y Tomás decide; las reglas de negocio las confirmaron el responsable de alquileres y la persona que calcula los ajustes, que operan los alquileres. Ninguna propuesta pasó a código sin aprobación explícita.

Lo que decidió Tomás:

- No programar hasta entender el proceso real, y trabajar por etapas.
- "Administrada" es un circuito propio, y un campo vacío es "sin determinar", nunca "no administrada".
- Las seis primeras decisiones del catálogo (A1 a A6): calle canónica por número, etiquetas internas, año de referencia, unidades por planta, cocheras y no interpretar "NUEVO".
- Migrar con fecha de corte y hacer una carga final repetible antes de producción.
- No descartar ningún dato crudo de PAC y separar siempre: dato original, vínculo propuesto, nivel de certeza y dato operativo.
- Recibos anteriores a 2025 como ocupación inferida, sin reconstruir contratos.
- Validar los vínculos fuertes con muestras de 20 casos, y revisar él mismo los dudosos.
- Dos series de recibos, el recibo a nombre de todos los inquilinos y un historial de valores visible.
- Los tres administradores (Tomás, el responsable de alquileres y la persona que calcula los ajustes) con acceso completo; Recibos antes que Renovaciones; el pase de PAC al CRM desde el período de diciembre de 2026.

Lo que propuso o resolvió la IA:

- Leer el Excel de Renovaciones como una agenda de vencimientos con checklist, no como un registro de contratos.
- El método de normalización de direcciones y el catálogo de unidades.
- Los scripts de consulta a PAC y la interpretación de su base: dos circuitos, cobro automático que no es un pago, cuentas que no son personas.
- El método de cruce: la dirección como puente, el semáforo de certeza, las claves estables y la reaplicación de decisiones.
- La evidencia de los datos para las reglas de ajuste: frecuencias reales, porcentajes acotados por el redondeo, momento de preparación de los recibos.
- La detección de contradicciones, entre fuentes y en las propias respuestas del personal.
- El criterio de carga por niveles, los cuatro importes separados y el ciclo de un ajuste, aprobados después por Tomás.
- Las respuestas a Claude Code, marcando en cada caso si salían de lo relevado o si eran una recomendación.

Lo que confirmaron el responsable de alquileres y la persona que calcula los ajustes: la frecuencia de los ajustes, los índices y cómo se calculan, el redondeo, qué hacer cuando falta un índice, la clasificación de los cargos, la administración de los casos dudosos y el contrato en dólares.

## 4. Prompts y pedidos más importantes

Los pedidos de Tomás fijaron el método más que el contenido: qué no asumir, cuándo frenar y cómo tratar la incertidumbre. Son citas textuales, en orden cronológico.

| Momento | Pedido textual | Qué fijó |
| --- | --- | --- |
| Primer mensaje (mediados de septiembre) | "Quiero que este chat se convierta en la referencia funcional de Alquileres antes de pasar a una implementación importante. […] No programes todavía." | Entender antes de construir |
| Primer mensaje | "No quiero que inventes campos simplemente porque sean habituales en un CRM inmobiliario. Si un dato no aparece en los Excel ni en el contexto que te proporcioné, indicá que falta." | Nada inventado |
| Primer mensaje | "Si encontrás una contradicción entre una regla de Alquileres y una decisión ya existente del CRM general, señalala explícitamente. No la resuelvas silenciosamente." | Contradicciones a la vista |
| Aclaraciones al modelo (septiembre) | "Los vacíos deben quedar como SIN DETERMINAR hasta que puedan revisarse. Esto es importante porque quiero evitar convertir una ausencia de información histórica en una afirmación falsa." | Faltante no es negativo |
| Auditoría de PAC (24/09) | "No quiero que simplemente repitas el análisis anterior. Quiero que intentes encontrar errores, contradicciones o conclusiones demasiado fuertes en tu propio análisis." | Autocrítica de la IA |
| Cambio de foco (24/09) | "No quiero seguir investigando PAC como ERP […]. El objetivo original de todo este relevamiento era mucho más concreto: Aprovechar PAC como fuente histórica para rescatar los datos inmobiliarios útiles para el futuro CRM de Alquileres." | Cortar la investigación a tiempo |
| Reglas de migración (24/09) | "PAC es una fuente histórica viva hasta el momento de la migración definitiva. […] Quiero conservar: dato original → interpretación → decisión → dato migrado." | Trazabilidad |
| Plan de cruce (24/09) | "Y si dos fuentes se contradicen, quiero que el conflicto quede marcado para revisión en lugar de elegir automáticamente una." | Ninguna fuente es la verdad absoluta |
| Lógica de ajustes (29/09) | "No quiero que conviertas estas reglas en código todavía. […] Después de nuestra aprobación explícita recién pasamos a implementación." | Control humano antes del código |
| Revisión del cruce (29/09) | "No quiero que esos ‘no sé’ se interpreten como descartes. […] No modifiques ni borres decisiones humanas sin señalarlo primero." | Las decisiones humanas no se tocan |
| Cierre del traspaso (02/10) | "Continuá desde ese estado y no rehagas el procesamiento anterior." | Eficiencia: retomar, no rehacer |
| Preguntas de Claude Code (20/10) | "Contestalas con lo que ya te conté; donde no lo sepas, decímelo y preguntame sólo eso." | Distinguir lo relevado de lo que falta |

El patrón de la última etapa fue un circuito entre dos IA con Tomás en el medio: Claude Code dejaba preguntas, este chat las contestaba separando lo confirmado de lo recomendado, Tomás las consultaba con el personal cuando hacía falta, y recién entonces volvían a Claude Code.

## 5. Qué salió mal y cómo se corrigió

Hubo 17 problemas registrados: diez fueron errores o interpretaciones equivocadas de la IA de este chat; los otros siete vinieron de los datos, de la comunicación, de las herramientas o de la implementación. Todos se detectaron por verificación o por una persona, nunca se dieron por buenos por confianza.

| Problema | Origen | Cómo se detectó | Cómo se resolvió |
| --- | --- | --- | --- |
| El primer script de procedimientos de PAC falló por un conflicto de intercalación de SQL Server | IA | El archivo de resultados traía el error | Script corregido (versión 1b) |
| Los títulos de los resultados salían con caracteres rotos | IA | Lectura del archivo | Codificación UTF-8 en la entrada del script |
| Una consulta demasiado pesada no terminó y su archivo quedó truncado | IA | Se verificó la integridad del archivo antes de analizarlo | Seis de las siete secciones faltantes se reconstruyeron con otro archivo; la séptima, con un script liviano |
| Interpretó las cuentas numeradas de PAC como "una cuenta por tipo de recibo" | IA | El responsable de alquileres explicó cómo se usan | Corregido; los datos coincidían con su explicación |
| Interpretó las anotaciones "Dif." como diferencias de alquiler por ajuste | IA | La persona que calcula los ajustes aclaró que son diferencias de tasas municipales | No se convirtieron en historial de ajustes |
| El script de extracción contradecía la regla de no descartar datos crudos | IA | Al consolidar las reglas del proyecto, antes de ejecutarlo | Reemplazado por una extracción completa de 32 tablas |
| Calculó los porcentajes de la hoja de ajustes sin considerar el redondeo | IA | Revisión propia al buscar evidencia para otra pregunta | Reemplazado por el intervalo correcto, y documentado |
| Leyó "No se" sin tilde como una confirmación | IA | Control de los estados antes de reaplicar las decisiones | Toda variante de "No sé" cuenta como pendiente |
| Aplicó una corrección a "DUPLEX" pero no a "DÚPLEX" | IA | Verificación final del paquete | 28 recibos reasignados |
| Al limpiar anotaciones del Excel, casi elimina nueve personas reales | IA | Control de integridad entre archivos | Restauradas, con el teléfono separado del nombre |
| Dos respuestas del personal sobre el promedio IPC/ICL se contradecían | Comunicación | La IA lo señaló sin elegir una; la fecha de preparación de los recibos aportó evidencia | La persona que calcula los ajustes confirmó la regla |
| "Correcto" en filas que describían un problema no tenía un significado único | Comunicación | La IA preguntó en lugar de suponer | Tomás aclaró; se creó el nivel "decisión humana de alta confianza" |
| Entre dos copias del Excel, 176 filas cambiaron de número con el mismo contenido | Datos | Comparación por contenido | Claves estables en lugar de números de fila |
| Una asignación de dirección chocaba con los recibos | Datos | Cruce con la persona titular | El responsable de alquileres confirmó que eran dos unidades |
| La inferencia propuso ajustes en dos contratos ya terminados | Límite del método | El responsable de alquileres confirmó que ya no alquilaban | Regla: la inferencia no sabe si un contrato sigue vigente |
| El entorno de trabajo del chat se perdió entre sesiones | Herramienta | Al retomar | Reconstruido desde el proceso empaquetado, sin rehacer decisiones |
| La implementación no acumulaba un ajuste salteado, contra una regla ya confirmada | Implementación | Este chat lo contrastó con la regla del ICL | El responsable de alquileres confirmó que se acumula |

El aprendizaje principal fue que la IA es fuerte encontrando patrones en los datos, y débil conociendo el negocio: los datos mostraban qué pasaba, y solo el personal sabía por qué.

## 6. Resultados concretos

El chat no produjo código del CRM —eso lo hizo Claude Code—, sino la definición funcional, los datos preparados para migrar y las respuestas que guiaron la implementación.

| Resultado | Qué es |
| --- | --- |
| Documento funcional de Alquileres (Claude Docs, 22 secciones) | La referencia del módulo: modelo, reglas, decisiones con su origen y pendientes |
| Nueve scripts SQL de solo lectura | Relevamiento de PAC y extracción cruda con fecha de corte |
| Catálogo de unidades funcionales (tres versiones) | 200 unidades en 154 edificios, con las direcciones originales |
| Libro de cruce PAC ↔ Renovaciones (tres versiones) | Planilla de revisión con muestras, desplegables y registro de decisiones |
| Proceso de cruce reproducible (versiones 1.0 a 1.5) | Código Python, sin datos, para repetir el cruce en la carga final |
| Paquete de traspaso | Un README y 14 archivos de datos con origen y certeza en cada vínculo |
| Respuestas a Claude Code | Reglas de la Fase 1 (A3 a A14) y decisiones 0074, 0094 y 0095 |

En cifras: 20.300 recibos históricos rescatados (2016–2026), 995 personas únicas, 438 contratos, 697 decisiones humanas registradas y reaplicables, 60 de 60 vínculos correctos en las muestras, y 1.606 recibos en la carga operativa inicial.

Decisiones de negocio cerradas: cómo se calculan los ajustes (frecuencia, índices, redondeo, ajuste salteado), los contratos en dólares, la clasificación de los cargos, las series y los estados de los recibos, la administración de los casos dudosos y el pase de PAC al CRM desde diciembre de 2026.

El libro de cruce y el paquete de traspaso contienen datos personales reales: no van al repositorio ni al informe. Para el informe sirven las cifras, el diagrama de la sección 2 y capturas con datos ficticios.

Te preparé un resumen detallado, organizado según los seis puntos que pediste y pensado para que puedas utilizarlo como material de base para el informe final de la Diplomatura en Inteligencia Artificial.

El foco está puesto en el desarrollo del CRM Inmobiliario, especialmente en la investigación del sistema anterior, la recuperación de información histórica, el diseño del módulo de Alquileres y el trabajo colaborativo entre vos y distintas herramientas de IA.

Aclaración sobre las fuentes: el resumen se basa en el historial de trabajo que puedo recuperar de este proyecto. Puedo reconstruir las principales actividades, decisiones y resultados, pero no garantizar que todos los mensajes citados sean transcripciones literales. Cuando corresponda, distinguiré los pedidos reconstruidos de las citas textuales.

# Registro del trabajo realizado con inteligencia artificial

Proyecto: CRM Inmobiliario — Investigación, migración de datos y desarrollo del módulo de Alquileres

1. Objetivo del chat y período de trabajo

Período aproximado: agosto a octubre de 2026, con especial intensidad durante septiembre y principios de octubre.

Este espacio de trabajo estuvo dedicado principalmente a investigar, organizar y preparar la incorporación del módulo de Alquileres a un CRM inmobiliario propio, desarrollado para reemplazar progresivamente herramientas y procedimientos administrativos utilizados por una inmobiliaria familiar.

El CRM general se estaba desarrollando con tecnologías modernas, principalmente Next.js, React, TypeScript, PostgreSQL y Prisma.

Sin embargo, el módulo de Alquileres presentaba una dificultad adicional: gran parte de la información necesaria estaba distribuida entre distintos sistemas, archivos y procedimientos administrativos.

Las principales fuentes eran:

- PAC: sistema administrativo antiguo, basado en una base de datos Microsoft SQL Server, utilizado históricamente para emitir recibos y registrar operaciones.
- Excel de Renovaciones y Contratos: planillas utilizadas para administrar contratos de alquiler, vencimientos, renovaciones y datos de las partes involucradas.
- Excel de Interesados: información sobre personas interesadas en alquilar propiedades.
- WordPress: sistema utilizado para publicar propiedades en el sitio web inmobiliario.
- Conocimiento operativo del personal: información sobre procedimientos, conceptos administrativos y particularidades que no estaban documentadas formalmente.

El objetivo no consistía simplemente en copiar información de estos sistemas al nuevo CRM.

Se buscaba comprender qué representaba cada dato, determinar su confiabilidad, reconstruir relaciones entre registros y establecer un procedimiento de migración que evitara introducir información incorrecta.

También se pretendía diseñar un módulo que permitiera administrar personas, propiedades, contratos, períodos contractuales, vencimientos, ajustes, recibos, impuestos, expensas y otros movimientos relacionados con alquileres.

La inteligencia artificial se utilizó como asistente de investigación técnica, análisis de datos, interpretación de resultados, documentación y diseño funcional.

## 2. Qué se hizo, paso a paso

### Etapa 1. Definición del problema y relevamiento de las fuentes

El primer trabajo consistió en identificar qué información existía y dónde se encontraba.

Se estableció que el sistema PAC contenía una cantidad considerable de información histórica, pero que no necesariamente reflejaba la estructura que debía tener el nuevo CRM.

Por ejemplo, PAC había sido diseñado como un sistema administrativo general y posteriormente adaptado a las necesidades inmobiliarias.

Esto significaba que algunas de sus estructuras, como las cuentas de clientes o los comprobantes, respondían a necesidades contables y administrativas, pero no representaban directamente personas, contratos o propiedades.

Se decidió investigar PAC como una fuente histórica de información, no como un modelo que debiera reproducirse en el nuevo sistema.

La IA colaboró en la planificación de la investigación, identificando qué datos podían ser útiles y cuáles no justificaban continuar investigando.

### Etapa 2. Investigación técnica de la base de datos PAC

Se identificó que PAC utilizaba Microsoft SQL Server y que su base de datos contenía aproximadamente 109 tablas.

Se realizaron consultas de solo lectura para conocer su estructura y localizar la información relacionada con alquileres.

Entre las tablas relevantes se identificaron las correspondientes a clientes, encabezados de comprobantes, líneas de comprobantes, propiedades y pagos.

La IA ayudó a interpretar la estructura y a elaborar consultas SQL para analizar los registros.

Se investigaron especialmente:

- La numeración y los estados de los comprobantes.
- Las diferencias entre recibos de alquiler y otros recibos.
- La relación entre cuentas administrativas y personas.
- Los conceptos incluidos en cada comprobante.
- Las fechas de emisión, carga y períodos facturados.
- La posible vinculación de los recibos con propiedades.
- El significado de los registros de pago.

Uno de los hallazgos más importantes fue que los comprobantes no tenían una relación directa y confiable con las propiedades.

También se comprobó que las cuentas administrativas no podían interpretarse automáticamente como personas únicas.

Una misma persona podía tener distintas cuentas y algunas cuentas podían representar a más de una persona.

Esto obligó a descartar una migración basada únicamente en identificadores internos del sistema anterior.

### Etapa 3. Reconstrucción del funcionamiento de los recibos

El análisis permitió identificar dos circuitos principales:

Circuito 2: recibos de alquiler.

Circuito 1: recibos de conceptos asociados, como impuestos, servicios, seguros, expensas y otros movimientos.

Se determinó que los comprobantes podían contener varias líneas, cada una con un concepto diferente.

Por ejemplo, un mismo recibo podía incluir impuestos municipales, agua y seguro.

Por lo tanto, se estableció que el nuevo CRM debía diferenciar entre el comprobante general y sus conceptos individuales.

También se analizaron los estados de los recibos: activos, anulados y diferentes estados administrativos de pago.

Una conclusión fundamental fue que los registros de pago de PAC no constituían evidencia suficiente de que el dinero hubiera sido efectivamente cobrado.

En consecuencia, se estableció el siguiente principio:

Un recibo emitido o preparado no demuestra necesariamente que el período haya sido pagado.

Este criterio resultó importante para evitar que la migración generara información financiera incorrecta.

### Etapa 4. Análisis histórico y definición del alcance de la migración

Se investigaron comprobantes correspondientes aproximadamente al período 2016-2026.

La IA ayudó a diferenciar los registros históricos de aquellos que podían resultar útiles para la operación actual.

Se propuso una clasificación en tres niveles:

Nivel A — Información operativa: comprobantes no anulados correspondientes a períodos de 2026 o preparados/cargados durante ese año.

Nivel B — Información histórica: comprobantes anteriores que debían conservarse para consulta y reconstrucción de antecedentes.

Nivel C — Información excluida de la carga operativa: comprobantes anulados y registros puntuales sin resolver.

Esta clasificación permitió evitar que miles de comprobantes históricos se mezclaran indiscriminadamente con las operaciones vigentes.

También se detectaron comprobantes preparados anticipadamente y diferencias entre fecha de carga, fecha de emisión y período correspondiente.

Se decidió conservar estas distinciones en lugar de reducirlas a una única fecha.

### Etapa 5. Extracción de información de PAC

Una vez comprendida la estructura principal, se preparó un procedimiento de extracción mediante consultas SQL.

Se ejecutó en la computadora donde estaba instalado el sistema original.

El procedimiento generó 33 archivos de texto con información extraída de PAC.

Estos archivos se agruparon en un paquete comprimido para continuar el análisis sin necesidad de conectarse constantemente a la base de datos original.

La extracción se realizó mediante consultas de lectura, sin modificar los registros de PAC.

Esto permitió trabajar con información histórica fuera del sistema operativo original, reduciendo riesgos y evitando interferencias con las tareas habituales de la inmobiliaria.

### Etapa 6. Cruce entre PAC y las planillas de contratos

La siguiente etapa consistió en relacionar los datos históricos de PAC con la información de los contratos registrados en Excel.

Este trabajo fue especialmente complejo porque los sistemas no compartían identificadores estables.

Los nombres podían aparecer escritos de distintas maneras, las direcciones podían estar incompletas y las cuentas administrativas no representaban necesariamente a una sola persona.

Se desarrolló un proceso de conciliación basado en múltiples evidencias:

- Coincidencias entre nombres y apellidos.
- Direcciones de inmuebles.
- Períodos de ocupación.
- Conceptos y datos presentes en los comprobantes.
- Información contractual.
- Confirmaciones humanas.

La IA generó propuestas de vinculación y clasificó los resultados según su nivel de certeza.

Se utilizaron planillas de revisión para que las decisiones no dependieran exclusivamente de las deducciones automáticas.

Las relaciones podían quedar confirmadas, inferidas, pendientes o descartadas.

Una decisión importante fue que una celda vacía o una respuesta como «No sé» no debía interpretarse como rechazo ni como confirmación.

Los casos sin evidencia suficiente debían permanecer pendientes.

### Etapa 7. Revisión humana y corrección de asociaciones

Se revisaron numerosas propuestas generadas por la IA.

Algunas relaciones pudieron confirmarse mediante el conocimiento de las operaciones inmobiliarias.

Otras se corrigieron al descubrir que una misma dirección correspondía a varias unidades independientes.

También se revisaron situaciones en las que una propiedad había cambiado de inquilino o de condición administrativa.

Se incorporaron nuevos contratos a las planillas y se completaron progresivamente datos faltantes sobre propietarios, inquilinos, garantes y documentación.

Se identificó además un problema importante: las filas de Excel cambiaban de posición entre distintas versiones del archivo.

Para resolverlo, se diseñó una clave contractual más estable, construida a partir de información del contrato y de la unidad.

Esto permitió reutilizar decisiones anteriores sin depender exclusivamente del número de fila.

### Etapa 8. Clasificación de conceptos administrativos

El análisis de recibos permitió detectar que algunos conceptos no estaban suficientemente definidos.

Por ejemplo, se estudiaron cargos relacionados con seguros, servicios, impuestos, limpieza y diferencias de importes.

La IA propuso clasificaciones preliminares.

Posteriormente, esas propuestas se contrastaron con el conocimiento del personal de la inmobiliaria.

Entre las decisiones adoptadas se estableció que:

- Los cargos correspondientes a ABSA debían clasificarse dentro de impuestos.
- El seguro de incendio se mantenía provisionalmente en la categoría «Otro».
- Determinados gastos de limpieza y electricidad de cocheras correspondían conceptualmente a expensas.
- Las diferencias identificadas con la abreviatura «Dif.» no debían interpretarse automáticamente como ajustes del alquiler.

Esta última corrección fue especialmente relevante porque esas diferencias podían corresponder a actualizaciones de tasas municipales.

Se evitó así que el CRM construyera un historial de aumentos de alquiler a partir de importes que representaban otra cosa.

### Etapa 9. Construcción de un proceso reproducible

El trabajo de conciliación evolucionó mediante varias versiones.

Se elaboraron paquetes de procesamiento que permitían repetir el cruce de información a partir de las fuentes originales y las decisiones ya registradas.

La última versión documentada de este proceso fue:

Proceso cruce v1_5.zip

Este paquete reemplazó funcionalmente a las versiones anteriores, aunque se decidió conservarlas como antecedentes.

El procedimiento incorporó correcciones relacionadas con identificadores, clasificación de conceptos, contratos nuevos, direcciones y decisiones humanas.

Se alcanzó un registro de 697 decisiones de conciliación, incluyendo correcciones y confirmaciones realizadas durante el proceso.

El objetivo fue que las decisiones no quedaran dispersas únicamente en conversaciones, sino que pudieran conservarse y reproducirse.

### Etapa 10. Preparación del paquete de transferencia al desarrollo del CRM

Una vez avanzado el relevamiento, se elaboró un paquete para trasladar los resultados al espacio de trabajo encargado del desarrollo general del CRM.

El entregable principal fue:

Handoff_Alquileres_CRM_2026-10-01.zip

Este paquete contenía un archivo de instrucciones y 14 archivos de datos.

También se generó un documento introductorio:

00_LEEME_Handoff_Alquileres.md

El material reunía información sobre personas, propiedades, unidades, contratos, períodos, roles, recibos, conceptos, decisiones de conciliación y cuestiones pendientes.

Su finalidad era permitir que la etapa de implementación partiera de información investigada y organizada, en lugar de comenzar nuevamente desde cero.

### Etapa 11. Análisis del modelo funcional y preparación de la implementación

Durante octubre se profundizó el análisis de cómo debía integrarse la información al CRM existente.

Se discutieron varias decisiones arquitectónicas:

Personas y contactos: determinar si correspondía ampliar la entidad Contacto existente o crear una entidad nueva para representar personas y organizaciones.

Propiedades y unidades: diferenciar la propiedad publicada comercialmente de la unidad funcional utilizada en un contrato.

Contratos y períodos: distinguir la relación contractual general de cada período de vigencia, renovación o actualización.

Propiedad y administración: evitar asumir que una propiedad pertenece a la inmobiliaria o está administrada por ella simplemente porque aparece en un sistema.

Recibos y conceptos: diseñar comprobantes con múltiples conceptos, sin confundir importes emitidos con valores contractuales.

Trazabilidad: conservar origen, identificador original, fecha de corte, nivel de certeza y decisiones humanas.

Se recomendó implementar el módulo progresivamente, comenzando por una estructura útil y visible, sin esperar a resolver todos los detalles de la futura emisión de recibos.

Sin embargo, estas propuestas no equivalían todavía a una implementación completa ni a una migración definitiva.

La carga de información real en producción quedó sujeta a autorización y verificaciones posteriores.

## 3. Qué decisiones tomó el usuario y qué propuso o resolvió la inteligencia artificial

La colaboración se organizó mediante una separación entre decisiones humanas y asistencia técnica.

**Decisiones tomadas por el usuario**

1. Definir el objetivo del proyecto.

Se estableció que el objetivo era desarrollar un CRM inmobiliario propio, adaptado al funcionamiento real de la empresa, y no simplemente reproducir PAC.

2. Delimitar la investigación.

Se decidió no investigar exhaustivamente todas las funciones del sistema antiguo, sino concentrarse en la información útil para el módulo de Alquileres.

3. Priorizar la confiabilidad.

Se estableció que las relaciones dudosas no debían confirmarse automáticamente.

4. Aportar conocimiento del negocio.

El usuario revisó propuestas, completó datos faltantes y consultó al personal para resolver dudas sobre propiedades, contratos, administración y conceptos de recibos.

5. Corregir las asociaciones propuestas.

Cuando una relación era incorrecta, se indicó la corrección y se solicitó que quedara documentada.

6. Conservar la trazabilidad.

Se decidió preservar los datos originales, las interpretaciones y las decisiones posteriores como elementos diferenciados.

7. Mantener separados desarrollo y producción.

Se estableció que las pruebas no debían modificar la base productiva sin autorización expresa.

8. Priorizar una implementación gradual.

Se buscó que el módulo de Alquileres pudiera comenzar a utilizarse sin necesidad de resolver anticipadamente todas sus funciones futuras.

**Aportes de la inteligencia artificial**

1. Interpretación técnica de sistemas existentes.

La IA ayudó a investigar una base de datos heredada y a identificar las tablas relevantes.

2. Generación y revisión de consultas SQL.

Propuso procedimientos para extraer información y verificar hipótesis sobre el funcionamiento de PAC.

3. Detección de inconsistencias.

Identificó problemas con cuentas duplicadas, períodos, direcciones, estados de comprobantes y asociaciones entre registros.

4. Conciliación de información.

Desarrolló procedimientos para cruzar fuentes que no compartían identificadores comunes.

5. Automatización de procesos repetitivos.

Colaboró en la elaboración de scripts y archivos de procesamiento para repetir los cruces.

6. Elaboración de documentación.

Produjo informes, archivos de revisión, paquetes de transferencia y registros de decisiones.

7. Propuestas de arquitectura.

Sugirió modelos de datos para personas, propiedades, unidades, contratos, períodos, recibos y conceptos.

8. Evaluación de riesgos.

Señaló problemas relacionados con migraciones, información real, separación de entornos y permisos de acceso a la base de datos.

**Distribución de responsabilidades**

El usuario actuó como responsable funcional, validador de resultados y decisor del proyecto.

La inteligencia artificial actuó como asistente técnico, analista de información, generador de propuestas y apoyo para la documentación.

Las decisiones sobre el significado de los datos y las operaciones reales no se delegaron completamente a la IA.

## 4. Prompts y pedidos más importantes

Los siguientes ejemplos representan los principales tipos de instrucciones utilizadas durante el proyecto.

Algunos están reconstruidos a partir del historial disponible, por lo que no deben presentarse como transcripciones literales sin contrastarlos con la conversación original.

### Pedido 1. Delimitar el análisis de PAC

Pedido reconstruido:

El objetivo no es investigar todo PAC, sino recuperar la información que necesitamos para el CRM: recibos de alquiler, impuestos, expensas y clientes. Tenemos que entender cómo se relacionan los datos sin perder tiempo investigando funciones que no vamos a utilizar.

Importancia: permitió reducir el alcance de una investigación potencialmente muy extensa.

### Pedido 2. Evitar asociaciones incorrectas

Pedido reconstruido:

No podemos asumir que cada cuenta de cliente de PAC representa a una persona distinta. Una persona puede tener varias cuentas en PAC y necesitamos identificar correctamente esas relaciones antes de migrar.

Importancia: evitó diseñar una estructura de personas basada en identificadores administrativos poco confiables.

### Pedido 3. Conservar la información original

Pedido reconstruido:

Quiero que podamos distinguir lo que viene de PAC, lo que figura en Excel, lo que deduce la IA y lo que confirmamos nosotros.

Importancia: estableció la trazabilidad como principio central del proyecto.

### Pedido 4. Revisar las coincidencias

Pedido reconstruido:

Prepará una planilla con las relaciones que encontraste para que pueda revisarlas y confirmar cuáles son correctas, cuáles no y cuáles todavía no sabemos.

Importancia: incorporó una etapa de validación humana dentro del procedimiento automatizado.

### Pedido 5. Corregir los criterios de interpretación

Pedido reconstruido:

Cuando marco «No sé», significa que todavía no puedo confirmar la información. No quiero que el proceso lo tome como correcto ni como descartado.

Importancia: corrigió un problema en la interpretación automática de las respuestas humanas.

### Pedido 6. Preparar la transferencia al CRM

Pedido reconstruido:

Necesito que todo lo investigado quede documentado para pasarlo al desarrollo general del CRM, sin tener que volver a explicar desde cero cómo funciona Alquileres.

Importancia: dio origen al paquete de transferencia de datos y documentación.

### Pedido 7. Proteger los datos reales

Pedido reconstruido:

No quiero que se modifique la base de producción ni que se importen datos reales hasta que revisemos el procedimiento y lo autorice.

Importancia: estableció una restricción operativa para las pruebas y futuras migraciones.

### Pedido 8. Implementar progresivamente

Pedido reconstruido:

No quiero esperar a tener absolutamente todo el módulo de Alquileres terminado para empezar a verlo funcionando dentro del CRM.

Importancia: orientó el desarrollo hacia entregas progresivas, con una primera versión funcional y ampliaciones posteriores.

## 5. Problemas, errores y correcciones

Durante el trabajo surgieron dificultades técnicas y de interpretación que obligaron a revisar procedimientos.

### Problema 1. Las cuentas de PAC no identificaban personas únicas

Situación: una misma persona podía aparecer asociada a diferentes cuentas administrativas.

Riesgo: crear personas duplicadas en el CRM.

Solución: utilizar información adicional, como nombres, documentos, direcciones y relaciones contractuales. Las coincidencias no suficientemente respaldadas quedaron pendientes de revisión.

### Problema 2. Los recibos no estaban vinculados directamente con propiedades

Situación: PAC no ofrecía una relación directa y confiable entre cada recibo y su inmueble.

Riesgo: asignar comprobantes a propiedades equivocadas.

Solución: desarrollar un procedimiento de conciliación utilizando direcciones, períodos, nombres e información contractual.

### Problema 3. Confusión entre emisión y pago

Situación: algunos registros administrativos podían interpretarse erróneamente como pagos efectivamente realizados.

Riesgo: generar estados financieros incorrectos.

Solución: separar el concepto de comprobante emitido o preparado del concepto de pago efectivamente acreditado.

### Problema 4. Interpretación incorrecta de conceptos

Situación: algunas descripciones de PAC eran ambiguas.

Riesgo: clasificar impuestos o diferencias municipales como aumentos de alquiler.

Solución: consultar el funcionamiento real de la inmobiliaria y corregir las reglas de clasificación.

### Problema 5. Direcciones correspondientes a varias unidades

Situación: una misma dirección podía representar un local comercial y una vivienda independiente.

Riesgo: vincular contratos y recibos de diferentes unidades.

Solución: incorporar la distinción entre edificio, dirección y unidad funcional.

### Problema 6. Cambios en la posición de las filas de Excel

Situación: al actualizar las planillas, los números de fila cambiaban.

Riesgo: aplicar decisiones anteriores al contrato equivocado.

Solución: utilizar claves contractuales más estables, construidas a partir de varios atributos.

### Problema 7. Interpretación incorrecta de «No sé»

Situación: una versión del procedimiento interpretó respuestas sin tilde como confirmaciones.

Riesgo: validar asociaciones que todavía estaban pendientes.

Solución: corregir el procesamiento de las respuestas y conservar expresamente el estado pendiente.

### Problema 8. Diferencias entre versiones de los informes

Situación: aparecieron diferencias en cantidades de registros, unidades, roles y decisiones.

Riesgo: utilizar cifras inconsistentes durante la implementación.

Solución: revisar las unidades de conteo y los criterios de inclusión.

Por ejemplo, se identificaron diferencias entre contar comprobantes y contar sus líneas, así como registros de Excel excluidos por estar vacíos.

Algunas diferencias quedaron explicadas y otras se documentaron para una revisión posterior.

### Problema 9. Datos contradictorios entre fuentes

Situación: la condición administrativa de algunas propiedades difería entre una planilla y las confirmaciones operativas.

Riesgo: sobrescribir información válida sin comprender su origen.

Solución: establecer un criterio operativo para el estado actual y conservar la discrepancia como información pendiente de revisión.

### Problema 10. Riesgos en la futura migración

[omitido: detalle interno de seguridad]

## 6. Resultados concretos

### 6.1. Resultados de la investigación

Se logró identificar y documentar el funcionamiento principal de los comprobantes históricos de PAC.

Se diferenciaron dos circuitos administrativos y se establecieron criterios para interpretar estados, períodos, importes y conceptos.

También se determinó qué información podía utilizarse operativamente y cuál debía mantenerse como referencia histórica.

### 6.2. Extracción y procesamiento de información

Se generó una extracción de PAC compuesta por 33 archivos de texto.

Se desarrollaron procedimientos para cruzar esta información con las planillas de contratos.

El proceso evolucionó mediante distintas versiones hasta alcanzar el paquete:

Proceso cruce v1_5.zip

### 6.3. Conciliación y validación

Se registraron 697 decisiones de conciliación.

Estas decisiones permitieron documentar confirmaciones, correcciones y asociaciones entre fuentes.

Se estableció que los registros pendientes debían conservarse como tales y no convertirse automáticamente en datos confirmados.

### 6.4. Información organizada para el CRM

El paquete final de transferencia incluyó aproximadamente:

| Elemento | Resultado documentado |
| --- | --- |
| Personas identificadas | 995 |
| Personas procedentes de Renovaciones | 692 |
| Personas identificadas únicamente en PAC | 303 |
| Períodos contractuales | 438 |
| Unidades identificadas | 200 |
| Decisiones de conciliación | 697 |
| Archivos de datos del paquete de transferencia | 14 |

Estas cantidades corresponden al corte documentado de octubre de 2026 y no deben interpretarse como la cantidad definitiva de registros cargados en producción.

Los 438 registros contractuales corresponden a períodos, no necesariamente a 438 contratos independientes.

### 6.5. Documentos y entregables

Entre los principales resultados se encuentran:

Extracción PAC: conjunto de 33 archivos de texto con información histórica.

Cruce PAC-Renovaciones: planillas de revisión y conciliación de registros.

Cruce_PAC_Renovaciones_corte_2026-09-25_v3.xlsx: versión documentada del archivo de revisión.

Proceso cruce v1_5.zip: paquete reproducible de procesamiento y conciliación.

Handoff_Alquileres_CRM_2026-10-01.zip: paquete de transferencia para el desarrollo general del CRM.

00_LEEME_Handoff_Alquileres.md: documento introductorio con instrucciones, criterios y alcance de la información transferida.

También se produjeron informes de análisis, propuestas funcionales y registros de cuestiones pendientes.

### 6.6. Decisiones de diseño

Se establecieron criterios para el futuro modelo de datos:

- Una persona debe tener una ficha única y puede desempeñar varios roles.
- Una propiedad publicada no necesariamente equivale a una única unidad contractual.
- Un contrato debe distinguirse de sus períodos de vigencia.
- La titularidad y la administración de una propiedad son relaciones diferentes.
- Los recibos deben permitir múltiples conceptos.
- Los importes emitidos no equivalen necesariamente a valores contractuales.
- Los datos originales deben conservar su procedencia.
- Las inferencias deben distinguirse de las confirmaciones humanas.
- Las migraciones deben ensayarse antes de modificar producción.

Algunas decisiones de arquitectura permanecieron abiertas para la etapa de implementación.

### 6.7. Estado alcanzado

Al finalizar esta etapa, el módulo de Alquileres contaba con un relevamiento considerablemente más completo, información histórica organizada, procedimientos reproducibles de conciliación y un paquete de transferencia para su incorporación al CRM.

El principal resultado no fue un módulo de Alquileres completamente implementado, sino una base de información investigada, validada y documentada que permitía abordar su desarrollo con menor incertidumbre.

## 7. Evaluación del uso de inteligencia artificial

Este trabajo permitió utilizar inteligencia artificial en tareas que excedieron la generación de texto o la programación puntual.

La IA participó en un proceso prolongado de investigación de sistemas existentes, interpretación de estructuras de datos, elaboración de consultas SQL, detección de inconsistencias, conciliación de fuentes, automatización de procedimientos y diseño funcional.

Una característica relevante fue el trabajo iterativo.

Los primeros resultados no siempre fueron correctos. Se detectaron errores de interpretación, problemas en las asociaciones y diferencias entre versiones.

En lugar de aceptar automáticamente las respuestas de la IA, se utilizaron revisiones humanas, nuevas consultas y correcciones sucesivas.

El conocimiento operativo de la inmobiliaria fue indispensable para interpretar conceptos que no podían deducirse únicamente de la información almacenada.

Por ejemplo, la IA podía identificar una diferencia monetaria en un recibo, pero no necesariamente determinar si correspondía a un aumento contractual, una actualización municipal o una regularización administrativa.

Esa interpretación requería información del negocio.

También resultó importante establecer restricciones explícitas para proteger los datos reales y evitar modificaciones no autorizadas.

La experiencia mostró que la IA podía acelerar significativamente tareas técnicas y analíticas, pero que sus resultados necesitaban validación cuando involucraban información ambigua o decisiones operativas.

8. Conclusión

El trabajo realizado permitió transformar información inmobiliaria histórica, distribuida entre sistemas y planillas, en una estructura más organizada y preparada para su integración a un CRM propio.

La inteligencia artificial fue utilizada como herramienta de asistencia durante distintas etapas: investigación, extracción, análisis, conciliación, documentación y diseño.

El usuario mantuvo el control sobre los objetivos, las prioridades, la interpretación de los procesos reales y la aprobación de las decisiones.

La experiencia permitió comprobar la utilidad de un enfoque de trabajo basado en cuatro etapas:

Evidencia → Inferencia → Decisión → Implementación.

Primero se recuperaron y analizaron los datos disponibles. Luego se formularon hipótesis sobre sus relaciones. Posteriormente se validaron las decisiones con intervención humana y, finalmente, se preparó la información para su implementación.

El principal aprendizaje fue que el valor de la inteligencia artificial no estuvo solamente en producir código o respuestas rápidamente, sino en ayudar a comprender un problema complejo, organizar evidencia dispersa, detectar errores y construir un procedimiento verificable para desarrollar software a partir de necesidades reales.

Una distinción importante para tu informe final

Este resumen corresponde principalmente al trabajo de investigación y preparación del módulo de Alquileres, no a todo el desarrollo del CRM.

Para que el informe de la Diplomatura refleje correctamente el proyecto completo, conviene diferenciar tres grandes áreas:

- Desarrollo del CRM: arquitectura, programación, interfaz, módulos, base de datos, autenticación, pruebas y versiones.
- Investigación y migración de Alquileres: análisis de PAC, conciliación de Excel, validación humana y preparación de datos. Es el trabajo documentado en este resumen.
- Auditoría y control de calidad: pruebas automatizadas, corrección de errores, seguridad, gestión de versiones y protección de producción.

También te recomiendo presentar este chat como un ejemplo de trabajo colaborativo entre una persona y varias herramientas de IA, destacando que no se trató de generar el CRM mediante un único prompt, sino de un proceso iterativo con investigación, decisiones, correcciones y validación.

Eso permite explicar tanto los resultados obtenidos como las limitaciones reales de la inteligencia artificial durante el desarrollo.

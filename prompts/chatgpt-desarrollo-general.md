# Resumen del trabajo realizado con IA — Proyecto CRM Ortelli

Material para el informe final de la Diplomatura en Inteligencia Artificial

Este resumen reconstruye el trabajo documentado en esta conversación, incluyendo los checkpoints que fui recibiendo sobre las implementaciones realizadas con Claude.

Es importante distinguir dos cosas: este chat se utilizó principalmente para analizar, planificar, revisar decisiones técnicas y dar continuidad al proyecto, mientras que buena parte de la programación y las pruebas fueron ejecutadas por Claude, siguiendo las decisiones y los requisitos que vos definiste.

El resumen no incluye contraseñas, tokens, credenciales ni información personal de clientes.

## 1. Objetivo del chat y período de trabajo

**Período aproximado**

Septiembre–octubre de 2026, con especial concentración en las etapas documentadas entre el 4 y el 9 de octubre de 2026.

La última actualización técnica recibida corresponde a la versión v0.20.0-rc.2, informada el 9 de octubre.

Este período no representa necesariamente la duración completa del desarrollo del CRM, sino las etapas reconstruidas y documentadas en esta conversación.

**Objetivo principal**

El objetivo fue avanzar en el desarrollo de un sistema CRM inmobiliario propio, utilizando inteligencia artificial como herramienta de asistencia para el análisis funcional, el diseño de arquitectura, la programación, las pruebas y la validación.

El proyecto buscó integrar información que anteriormente estaba distribuida entre diferentes herramientas:

- WordPress, para las propiedades publicadas.
- Google Sheets, para el CRM inmobiliario anterior.
- Archivos Excel, para interesados, contratos y renovaciones.
- PAC, un sistema administrativo anterior basado en SQL Server.
- Una nueva base de datos PostgreSQL para centralizar la información.

Durante esta etapa, el trabajo se concentró en dos grandes objetivos:

Primero: consolidar el módulo de Alquileres, ya implementado y cargado en producción.

Segundo: desarrollar y validar una sincronización segura entre WordPress y el nuevo CRM, evitando depender de descargas e importaciones manuales.

También se buscó establecer una metodología de desarrollo asistido por IA que permitiera avanzar sin comprometer los datos reales de la inmobiliaria.

## 2. Qué se hizo, paso a paso

### Etapa 1. Consolidación de la versión v0.16.0

El punto de partida fue la versión:

v0.16.0-rc.2-0059

Esta versión ya había sido auditada, probada, compilada y verificada visualmente.

El sistema utilizaba las siguientes tecnologías:

| Tecnología | Función |
| --- | --- |
| Next.js | Desarrollo de la aplicación web |
| React | Construcción de interfaces |
| TypeScript | Programación con tipado |
| Tailwind CSS | Diseño visual |
| PostgreSQL | Base de datos |
| Prisma | Acceso y modelado de datos |
| Node.js | Entorno de ejecución |
| GitHub | Repositorio previsto para el código |
| Vercel | Plataforma prevista para despliegue |

La IA colaboró en la revisión de la estructura técnica, las pruebas y los procedimientos de instalación.

Se trabajó con una separación estricta entre desarrollo, pruebas y producción.

**Resultado**

Se estableció una base funcional sobre la cual continuar el desarrollo sin reconstruir módulos ya terminados.

### Etapa 2. Integración de Alquileres

Una parte importante del proyecto fue la incorporación de información real de alquileres al CRM.

Para esto se analizaron distintas fuentes históricas, principalmente planillas Excel y registros provenientes de PAC.

La integración siguió un procedimiento controlado:

- Análisis de las fuentes.
- Preparación de datos.
- Carga en un entorno de staging.
- Identificación de conflictos.
- Simulación.
- Prueba sobre una copia restaurada de producción.
- Verificación de integridad.
- Generación y restauración de backups.
- Autorización explícita.
- Aplicación en producción.
- Verificación posterior.

**Resultado concreto**

Se incorporaron:

| Entidad | Registros |
| --- | --- |
| Personas/partes | 995 |
| Unidades | 200 |
| Períodos | 438 |
| Roles | 893 |
| Administraciones | 199 |
| Titularidades | 255 |
| Recibos históricos | 1.601 |
| Condiciones | 93 |
| Eventos | 16 |
| Decisiones | 692 |

Los recibos históricos de PAC quedaron separados de los futuros recibos que genere el CRM.

**Decisión importante**

Se estableció que los datos inferidos no podían presentarse como confirmados.

Por ejemplo, una relación entre una persona, una propiedad y un período debía conservar su nivel de certeza cuando no existiera evidencia suficiente.

Esto permitió diseñar un sistema que no solamente almacenara información, sino que también diferenciara hechos comprobados, datos provenientes de fuentes externas e inferencias.

### Etapa 3. Identificación de la base correcta de desarrollo

Después de cerrar v0.16.0-rc.2-0059, apareció una dificultad relacionada con las carpetas del proyecto.

Existían diferencias entre el código de desarrollo y determinadas correcciones visuales que ya estaban funcionando en producción.

Dos ejemplos fueron:

- La apertura de las fichas de WordPress en una pestaña nueva.
- La corrección del fondo negro que aparecía al pasar el mouse sobre las miniaturas.

La IA detectó que continuar programando sobre una copia desactualizada podía provocar que esas correcciones se perdieran.

**Resolución**

Se decidió identificar y verificar la versión fuente correcta antes de seguir modificando código.

Posteriormente se avanzó mediante candidatas versionadas y carpetas separadas de desarrollo y revisión.

Aprendizaje: una aplicación que funciona correctamente no garantiza que todas las carpetas locales contengan exactamente el mismo código.

### Etapa 4. Análisis de la sincronización WordPress existente

Uno de los descubrimientos más importantes fue que el CRM ya tenía implementada una parte sustancial de la sincronización.

El comando:

wp:importar

ya permitía procesar exportaciones completas y detectar:

- Propiedades nuevas.
- Cambios en propiedades existentes.
- Modificaciones de precios.
- Publicaciones desaparecidas.
- Reactivaciones.

También existía:

wp:simular

para revisar qué modificaciones produciría una importación antes de aplicarla.

**Problema identificado**

Aunque el procesamiento ya existía, el procedimiento todavía dependía de descargar manualmente un CSV desde WordPress.

**Decisión**

No desarrollar nuevamente el importador.

En cambio, reutilizarlo y construir el mecanismo de transporte y la interfaz necesarios para simplificar el proceso.

Esta decisión evitó duplicar código y redujo el alcance de la nueva implementación.

### Etapa 5. Definición de la arquitectura de sincronización

Se analizó cómo conectar el CRM con WP All Export, el complemento utilizado para exportar propiedades desde WordPress.

Inicialmente se propuso este flujo:

WordPress → descarga → archivo → simulación → revisión → autorización → importación.

El diseño incluía conservar cada exportación con:

- Fecha y hora.
- Nombre del archivo.
- Identificador de la corrida.
- Huella digital SHA-256.

El objetivo era garantizar que el archivo finalmente aplicado fuera exactamente el mismo que se había revisado.

**Evolución**

En las versiones posteriores, el procedimiento se transformó en una experiencia más integrada.

Según el último informe de Claude sobre v0.20.0-rc.2, el botón «Actualizar desde WordPress» ya podía descargar, archivar, comparar y aplicar automáticamente cambios considerados seguros.

Los casos ambiguos y las decisiones comerciales continuaron sujetos a revisión.

**Resultado**

Se pasó de un conjunto de comandos independientes a un flujo de sincronización integrado en la aplicación.

### Etapa 6. Depuración del Export #3

Se revisó la estructura real del archivo generado por WP All Export.

Se tomó la decisión de eliminar campos internos que no debían alimentar el CRM nuevo, especialmente información de propietarios y autores de publicaciones.

Entre los campos eliminados estaban el nombre y el teléfono del dueño, y los campos de autor de WordPress.

El export quedó con 80 columnas.

Se conservaron campos relevantes para futuras funcionalidades, como:

- Estado de conservación.
- Situación de la propiedad.

**Decisión funcional**

La información de propietarios debía gestionarse desde el CRM y sus fuentes correspondientes, no depender de campos informales de WordPress.

La IA implementó y verificó la compatibilidad con esa estructura.

**Resultado**

La decisión 0063 quedó cerrada sin requerir una nueva migración.

### Etapa 7. Desarrollo del registro de bajas de publicaciones

Se implementó una estructura denominada:

PublicacionBaja

mediante la migración 0008.

El problema que debía resolver era importante.

Cuando una propiedad desaparecía del export de WordPress, no podía asumirse que había sido vendida.

Podía haber sido retirada, reservada, alquilada o eliminada por un error de carga.

**Solución**

Separar dos conceptos:

Estado de publicación: si el aviso continúa publicado en WordPress.

Estado comercial: cuál es la situación real de la propiedad.

De esta manera, la desaparición de un aviso genera una baja de publicación pendiente de revisión, sin alterar automáticamente el estado comercial.

**Resultado**

Se incorporó trazabilidad para las publicaciones desaparecidas y la posibilidad de confirmar posteriormente su motivo.

Esta fue una decisión funcional especialmente importante para evitar errores comerciales producidos por automatizaciones.

### Etapa 8. Pruebas con exportaciones reales

Se realizaron ensayos utilizando el Export #3 real de WordPress.

Una de las primeras simulaciones documentadas produjo:

| Resultado | Cantidad |
| --- | --- |
| Altas | 1 |
| Actualizaciones | 4 |
| Bajas | 3 |
| Sin cambios | 181 |
| Total procesado | 186 |

Posteriormente se aplicó el mismo archivo sobre una copia restaurada de producción.

Los resultados coincidieron con la simulación.

Al volver a procesar el archivo, el sistema informó:

186 propiedades sin cambios.

Esto permitió verificar la idempotencia: repetir la sincronización con el mismo archivo no debía generar modificaciones adicionales.

**Resultado**

Se comprobó que el importador podía detectar y aplicar correctamente los cambios esperados sin afectar los datos de Alquileres.

### Etapa 9. Pruebas de situaciones comerciales concretas

En versiones posteriores se utilizaron propiedades reales de WordPress para verificar situaciones específicas.

Se comprobaron:

Alta: incorporación de una nueva publicación como propiedad del CRM.

Baja: eliminación posterior de una publicación y registro de la desaparición sin convertirla automáticamente en una venta.

Posible duplicación: detección de similitud entre dos propiedades sin fusionarlas automáticamente.

Cambio de imagen: actualización de la imagen destacada desde WordPress.

Cambio de precio: modificación de USD 98.000 a USD 90.000 en una propiedad y registro del cambio en el historial.

Estas pruebas fueron realizadas sobre una copia restaurada de producción.

**Resultado**

Se verificaron los principales escenarios de sincronización con datos reales, manteniendo aislada la base productiva.

### Etapa 10. Historial de precios y retasaciones

En v0.20.0-rc.1 se incorporó una pantalla de Retasaciones y se amplió el detalle de las propiedades para mostrar su historial de precios.

Se reutilizó el modelo:

PropiedadPrecioHistorial

**Decisiones**

Se estableció que:

- Debía conservarse el precio anterior y el nuevo.
- Debían conservarse las monedas correspondientes.
- No debía calcularse un porcentaje cuando cambiara la moneda.
- No debía inventarse la fecha histórica de una modificación.

Cuando WordPress no proporcionaba la fecha exacta del cambio, el CRM debía registrar el momento en que lo detectó o aplicó.

**Resultado**

Se incorporó una trazabilidad más completa de las modificaciones de precios.

### Etapa 11. Integración con Demandas y Coincidencias

Se definió la necesidad de conectar las propiedades con las demandas activas de los clientes.

El objetivo era que, al ingresar o actualizar una propiedad, el CRM pudiera identificar posibles coincidencias con búsquedas existentes.

La IA propuso y desarrolló parte del cálculo dinámico de coincidencias.

Sin embargo, quedó pendiente importar y validar las hojas actuales de Demandas y Coincidencias del CRM anterior.

**Resultado**

La funcionalidad quedó parcialmente preparada, pero no completamente validada con las demandas reales.

Esta distinción es importante: una funcionalidad implementada no necesariamente está validada en todas sus condiciones de uso.

## 3. Qué decidí yo y qué propuso o resolvió la IA

Durante el proyecto existió una división clara de responsabilidades.

| Aspecto | Decisiones tomadas por vos | Aportes de la IA |
| --- | --- | --- |
| Objetivo del CRM | Centralizar y mejorar la gestión inmobiliaria | Propuestas de arquitectura y organización |
| Datos reales | Proteger producción y exigir autorización | Procedimientos de backup, simulación y validación |
| WordPress | Mantenerlo como fuente de publicaciones | Reutilización del importador y desarrollo del transporte |
| Bajas | No interpretar una desaparición como venta | Implementación de PublicacionBaja |
| Propietarios | No depender de los campos informales de WordPress | Adaptación del importador |
| Precios | Conservar historial sin inventar fechas | Implementación de retasaciones e historial |
| Duplicados | No fusionar propiedades por similitud | Detección de posibles coincidencias |
| Alquileres | Mantener niveles de certeza | Modelado, integración y verificaciones |
| Pruebas | Utilizar datos reales en copias aisladas | Tests automatizados, simulaciones y auditorías |
| Versiones | Avanzar por implementaciones controladas | Generación de candidatas y reportes técnicos |
| Seguridad | No compartir secretos ni modificar producción sin permiso | Separación de entornos y controles de configuración |

**Papel de la IA**

La IA no se utilizó únicamente para generar código.

También participó como:

Analista funcional: ayudó a convertir necesidades inmobiliarias en requisitos.

Asistente de arquitectura: propuso estructuras y relaciones entre sistemas.

Programador: Claude implementó funcionalidades y modificaciones.

Asistente de pruebas: generó y ejecutó verificaciones automatizadas.

Auditor técnico: revisó resultados, diferencias y posibles regresiones.

Asistente documental: ayudó a mantener checkpoints y continuidad entre conversaciones.

Tu responsabilidad principal fue definir las necesidades reales del negocio, decidir las reglas funcionales, revisar los resultados y autorizar las operaciones sensibles.

## 4. Prompts y pedidos más importantes

Los siguientes fragmentos son textuales o prácticamente textuales de los mensajes y checkpoints compartidos en esta conversación. No son una reconstrucción completa de todos los prompts enviados directamente a Claude.

### Prompt 1. Evitar repetir investigaciones

«No quiero volver a rehacer la investigación histórica que ya quedó cerrada.»

Este pedido estableció una regla de continuidad: aprovechar los resultados documentados y concentrar cada nueva etapa en lo que todavía faltaba.

### Prompt 2. Revisar antes de programar

«Antes de comenzar una nueva implementación: revisar qué ya existe; revisar qué ya está probado; reutilizar lo existente; identificar solamente lo que falta; definir las fuentes necesarias; recién después programar.»

Este fue uno de los criterios metodológicos más importantes.

### Prompt 3. Seguridad de producción

«Ningún cambio de datos en [la base de producción] sin autorización explícita para esa implementación.»

La instrucción permitió establecer una separación entre experimentar, probar y modificar el sistema real.

### Prompt 4. Sincronización WordPress

«El importador ya existe; falta resolver el transporte y la interfaz.»

Este pedido evitó rehacer una funcionalidad existente y orientó el desarrollo hacia la integración.

### Prompt 5. Protección de estados comerciales

«No convertir desapariciones de WordPress automáticamente en Vendida/Alquilada/Reservada.»

La instrucción definió una regla de negocio que debía respetarse incluso cuando la sincronización fuera automática.

### Prompt 6. Garantía de integridad

«Quiero conservar la garantía de que el archivo aplicado sea exactamente el mismo que fue simulado. La huella/hash del archivo debe formar parte de la evidencia.»

Esto impulsó el registro de SHA-256 y los controles entre simulación e importación.

### Prompt 7. Desarrollo incremental

«Una implementación concreta → pruebas → revisión → aprobación → siguiente implementación.»

La instrucción buscó reducir riesgos y evitar modificaciones demasiado grandes sin puntos de control.

### Prompt 8. Criterio de autorización

«No interpretar expresiones generales como “hacé lo que consideres mejor” como autorización para modificar producción.»

Este pedido delimitó la autonomía de la IA frente a operaciones sensibles.

### Prompt 9. Continuidad entre versiones

«No duplicar tareas que Claude ya resolvió y documentó.»

La intención fue utilizar la IA como herramienta de continuidad técnica y no como un sistema que reconstruyera el proyecto desde cero en cada conversación.

## 5. Problemas encontrados y correcciones

### Problema 1. Diferencias entre versiones de código

Situación: determinadas correcciones visuales estaban presentes en una versión utilizada para producción, pero no aparecían en otra copia de trabajo.

Riesgo: perder funcionalidades correctas al instalar una versión posterior.

Respuesta: identificar la fuente correcta y establecer verificaciones antes de modificar o empaquetar nuevas versiones.

### Problema 2. Dependencia de descargas manuales

Situación: el importador WordPress funcionaba, pero era necesario descargar manualmente el CSV.

Solución: desarrollar el mecanismo de descarga, archivo y sincronización desde la aplicación.

Resultado: en v0.20.0-rc.2 se informó un flujo integrado que aplicaba automáticamente cambios considerados seguros.

### Problema 3. Interpretación incorrecta de publicaciones desaparecidas

Situación: una publicación ausente podía confundirse con una propiedad vendida.

Solución: crear PublicacionBaja y separar publicación de estado comercial.

Resultado: las bajas quedaron registradas para revisión, sin modificar automáticamente el estado comercial.

### Problema 4. Campos innecesarios en el export

Situación: WordPress exportaba información interna y campos de propietarios que no debían ser fuente de autoridad del CRM.

Solución: eliminar esas columnas del Export #3 y adaptar el procesamiento.

Resultado: export de 80 columnas y compatibilidad verificada.

### Problema 5. Riesgo de importar archivos incorrectos

Situación: un archivo podía haber sido modificado, estar incompleto o no corresponder a la última exportación.

Solución: incorporar archivo histórico, SHA-256 y controles de integridad y antigüedad.

Resultado: el sistema podía rechazar exportaciones sospechosas antes de modificar datos.

### Problema 6. Posibles propiedades duplicadas

Situación: el sistema advirtió una similitud entre dos propiedades que no necesariamente eran duplicadas.

Solución parcial: conservar ambas propiedades y no fusionarlas automáticamente.

Pendiente: revisar el cálculo y la presentación de la similitud para evitar advertencias engañosas.

### Problema 7. Fechas históricas de precios

Situación: WordPress no siempre permitía conocer el momento exacto en que se había modificado un precio.

Solución: registrar la fecha de detección o aplicación por parte del CRM.

Resultado: historial de precios sin atribuir fechas históricas no verificadas.

### Problema 8. Coordenadas geográficas

Situación: se detectaron coordenadas almacenadas con un apóstrofe inicial, lo que impedía interpretarlas correctamente como números.

Resultado: se identificó el defecto y su posible impacto sobre mapas y búsquedas geográficas.

Estado: quedó como incidencia pendiente, separada del cierre de la sincronización.

### Problema 9. Prueba unitaria histórica

Situación: una prueba relacionada con demandas y permutas, identificada como DEM-32, continuaba fallando.

Resultado: se documentó como un fallo histórico conocido.

No se consideró una regresión nueva porque las pruebas de integración y las demás verificaciones continuaron funcionando.

Estado: pendiente de corrección específica.

## 6. Resultados concretos

**Evolución de versiones**

Las versiones documentadas en esta etapa incluyen:

| Versión | Resultado principal |
| --- | --- |
| v0.16.0-rc.2-0059 | Base consolidada con Alquileres en producción |
| v0.17.0-rc.1 | Candidata intermedia de la evolución |
| v0.18.0-rc.1 | Candidata intermedia de la evolución |
| v0.19.0-rc.1 | Ensayo completo de sincronización WordPress |
| v0.20.0-rc.1 | Retasaciones e historial de precios |
| v0.20.0-rc.2 | Flujo integrado de actualización WordPress y nuevas validaciones |

No tenemos en esta conversación un desglose suficientemente completo de todos los cambios individuales de v0.17 y v0.18 como para atribuirles funcionalidades específicas.

**Migraciones**

| Migración | Finalidad | Estado documentado |
| --- | --- | --- |
| 0007 | Fechas de WordPress con zona horaria | Aplicada y verificada en producción |
| 0008 | Registro de bajas de publicaciones | Probada en copia; pendiente en producción |
| 0009 | Ajustes de timestamps e índices del historial de precios | Probada en copia; pendiente en producción |

**Resultados de pruebas**

El último informe de Claude para v0.20.0-rc.2 indicó:

| Verificación | Resultado |
| --- | --- |
| Tests unitarios | 758 aprobados de 761 |
| Fallo conocido | 1 (DEM-32) |
| Tests omitidos | 2 |
| Integración | 292/292 |
| TypeScript | Correcto |
| Build | Correcto |
| Auditoría de staging | 413 archivos, 0 hallazgos |
| Suite comercial | 76 evaluaciones sin validar por falta de datos en ese equipo |

Estos resultados fueron informados por Claude. No constituyen una auditoría independiente realizada en este chat sobre el ZIP final.

**Código y componentes relevantes**

Entre los elementos desarrollados o utilizados se encuentran:

- wp:simular
- wp:importar
- wp:sincronizar
- PublicacionBaja
- PropiedadPrecioHistorial
- Pantalla de Retasaciones.
- Historial de precios en la ficha de propiedad.
- Archivo de exportaciones con SHA-256.
- Controles de integridad e idempotencia.
- Registro de auditoría.
- Notificaciones en «Hoy».
- Cálculo de posibles coincidencias con demandas.

**Documentos y evidencias**

El trabajo generó o utilizó distintos tipos de evidencia:

Checkpoints técnicos: documentos de continuidad entre versiones y conversaciones.

Informes de pruebas: resultados unitarios, de integración, compilación y auditoría.

Exportaciones CSV: archivos reales del Export #3 utilizados para las simulaciones.

Backups: copias anteriores y posteriores a los ensayos.

Candidatas versionadas: carpetas de desarrollo y revisión, además de paquetes ZIP cuando estuvieron disponibles.

Decisiones funcionales: criterios documentados sobre bajas, duplicados, propietarios, precios, certeza de datos y autorización de cambios.

El último handoff indicó que todavía estaba pendiente obtener y verificar el ZIP definitivo de v0.20.0-rc.2. Por lo tanto, no corresponde afirmar que ese paquete ya había sido entregado y auditado.

## 7. Cómo se utilizó la inteligencia artificial durante el proyecto

Esta experiencia permite identificar un proceso de trabajo con IA dividido en cuatro momentos.

1. Definición humana del problema

Las necesidades surgieron de situaciones reales de la inmobiliaria.

Por ejemplo, evitar que una publicación eliminada se interpretara como una venta o permitir que una propiedad actualizada pudiera relacionarse con demandas activas.

2. Traducción de necesidades a requisitos

La IA colaboró en transformar esas necesidades en especificaciones técnicas.

Se definieron modelos, flujos, validaciones, condiciones de seguridad y criterios de aceptación.

3. Implementación asistida

Claude participó en la programación, generación de pruebas, modificaciones del código y preparación de versiones.

ChatGPT colaboró en el análisis de decisiones, la revisión de riesgos, la planificación de los siguientes pasos y la continuidad documental.

4. Validación y control humano

Los resultados no se aceptaron únicamente porque la IA informara que una implementación había terminado.

Se realizaron simulaciones, pruebas con exportaciones reales, comparaciones de resultados y ensayos sobre copias restauradas.

Las operaciones sobre producción quedaron sujetas a autorización explícita.

Esto representa un enfoque de desarrollo asistido por inteligencia artificial con supervisión humana, en el que la IA ejecuta o propone tareas técnicas, pero las decisiones funcionales y las autorizaciones sensibles permanecen bajo control de la persona responsable del proyecto.

## 8. Conclusiones para el informe de la Diplomatura

De esta experiencia pueden extraerse cinco conclusiones principales.

Primera: la IA permitió abordar un desarrollo de software de considerable complejidad. El proyecto integró tecnologías web, bases de datos, información histórica y fuentes externas.

Segunda: la calidad de los resultados dependió de la precisión de los requisitos. Las instrucciones sobre bajas comerciales, duplicados, fechas, seguridad y niveles de certeza fueron determinantes para orientar correctamente las implementaciones.

Tercera: la IA resultó útil más allá de la generación de código. Su participación incluyó análisis funcional, propuestas de arquitectura, automatización de pruebas, auditoría y documentación.

Cuarta: la validación con datos reales fue fundamental. Las simulaciones sobre copias restauradas permitieron detectar problemas que no necesariamente aparecían en las pruebas automatizadas.

Quinta: mantener checkpoints y límites de autonomía fue esencial. La continuidad documental ayudó a evitar trabajos duplicados, mientras que las autorizaciones explícitas protegieron la información productiva.

**Síntesis final**

Durante el período analizado se avanzó desde una versión del CRM con el módulo de Alquileres consolidado hasta una candidata que incorporaba un flujo integrado de sincronización con WordPress, registro de bajas de publicaciones, historial de precios, retasaciones y controles de integridad.

El desarrollo se realizó mediante sucesivas versiones, pruebas automatizadas y ensayos con exportaciones reales sobre copias aisladas de la base productiva.

La inteligencia artificial participó en el análisis, diseño, programación, pruebas y documentación, mientras que las reglas de negocio, la evaluación de resultados y las autorizaciones de producción permanecieron bajo supervisión humana.

El principal aprendizaje fue que la IA no reemplazó la necesidad de comprender el funcionamiento de la inmobiliaria, sino que permitió traducir ese conocimiento en un sistema informático progresivamente más completo, manteniendo controles técnicos y funcionales durante su desarrollo.

Nota para el informe: este resumen está basado en los mensajes y handoffs disponibles en esta conversación. Para una presentación académica conviene distinguir entre implementaciones efectivamente verificadas, resultados informados por Claude y funcionalidades que permanecían pendientes. Esa distinción fortalece la trazabilidad y evita presentar como finalizado algo que todavía estaba en revisión.

# Resumen del chat principal de desarrollo (Claude) · para el informe del TFI

Escrito el 29/10/2026 por el mismo chat. Sin datos personales de clientes ni credenciales.

**Cómo se armó este resumen:**
- Del 24/08 al 08/10 está reconstruido a partir de lo que el chat generó: el informe de auditoría, las especificaciones, los "Estado del proyecto" fechados, las decisiones numeradas con fecha, `docs/metodologia.md` y `docs/estado-actual.md`. Esa parte de la conversación ya no está completa en el contexto del chat.
- Del 08/10 al 13/10 sale de la conversación misma.
- Las citas marcadas como **textuales** lo son. Lo demás es descripción.
- Lo marcado **A CONFIRMAR** no está verificado.

## 1 · Objetivo y período

- **Herramienta:** Claude, en el Proyecto "CRM Inmobiliario" de claude.ai, con entorno de ejecución de código.
  - Ahí Claude corrió PostgreSQL, las pruebas y las capturas automáticas, y empaquetó cada versión en un ZIP.
  - Desde el 13/10, Opus 5.5 (esfuerzo alto).
  - **A CONFIRMAR:** el modelo de las etapas anteriores. Se ve en el historial del chat.
- **Período:** del 24/08/2026 aproximadamente (carga del paquete de transferencia) al 13/10/2026.
- **Objetivo:**
  - Comprender y auditar el CRM existente (Apps Script + Google Sheets + WordPress).
  - Definir y diseñar la plataforma web que lo reemplaza.
  - Construirla por versiones, hasta dejarla funcionando en la PC de la inmobiliaria con datos reales.
- **Desde el 13/10, cambio de rol:** este chat pasó a ser el **asesor** que interpreta los informes de Claude Code y le redacta los pedidos. La implementación siguió en Claude Code, y las etapas siguientes en otros chats del Proyecto.

## 2 · Qué se hizo, paso a paso

1. **Auditoría inicial (fines de agosto).**
   - **Paquete de entrada:** el Prompt Maestro (redactado con ChatGPT), el Manual CRM V2.0, el "Estado del proyecto y objetivos de migración", los 11 `.gs` y un snapshot del Google Sheets del 24/08.
   - **Entrega:** el *Informe de Auditoría Inicial*, sin escribir código. Cada hallazgo marcado según su fuente: manual, código, dataset, inferencia o contradicción.
   - **Volumen del sistema:** 256 propiedades, 280 interesados, 19 demandas, 73 coincidencias y 1.307 relaciones de propiedades similares.
2. **Especificación funcional** (V2 objetivo y V2.1). Se definió qué construir antes de decidir cómo. Las preguntas críticas quedaron abiertas hasta que las respondiera Tomás.
3. **Análisis del dataset de validación comercial.**
   - Tomás evaluó a mano **76 alternativas** sobre 11 propiedades de referencia (después fueron 12).
   - Claude cruzó cada evaluación con el snapshot y las coordenadas de WordPress.
   - **El estado de conservación era la variable que más explicaba los rechazos:** aparecía en 24 de las 76 evaluaciones y decidía 11 de los 21 rechazos. No existía en el sistema.
   - **Los dormitorios predecían sus decisiones,** pero por un error del motor viejo no sumaban puntos.
   - En el export del 08/09 aparecieron dos campos nuevos de WordPress: estado de conservación y situación.
4. **Arquitectura y decisiones consolidadas (principios de septiembre).**
   - WordPress es la fuente de las propiedades y el CRM nunca escribe hacia allá.
   - Los datos de WordPress y los del CRM van en tablas separadas.
   - La lógica de negocio es código puro, separado de la base y de la interfaz.
   - Nada se borra.
   - La seguridad es una condición de diseño.
   - **Stack:** TypeScript, Next.js, PostgreSQL y Prisma. Se justificó por la facilidad de mantenimiento con asistencia de IA y porque otra persona puede tomar el proyecto.
5. **Núcleo de comparación y calibración (04 al 10/09).**
   - Motor nuevo en TypeScript puro, con un solo núcleo y dos perfiles (coincidencias y similares).
   - Suite comercial con las 76 evaluaciones y 3 referencias reservadas para validar (*holdout*).
   - Extractor de emails de Zonaprop y migración de identidad de los leads.
   - Dataset sintético.
   - **284 pruebas** al cerrar esta etapa.
6. **Plataforma web (14 al 20/09).**
   - Interfaz navegable primero con datos en memoria, después con PostgreSQL y Prisma.
   - Alta, edición y baja de contactos, demandas, seguimientos y ofertas.
   - Autenticación real con roles y visitas.
   - **Aislamiento de entornos** (v0.9.1): base de pruebas, de desarrollo y de producción, con tres barreras independientes.
7. **Camino a los datos reales (26/09 al 01/10).**
   - **Separar conceptos:** que una propiedad exista en el CRM, que esté publicada en WordPress y que se pueda ofrecer son cosas distintas.
   - **Identidad propia:** cada propiedad tiene un código del CRM (`PRO-000123`), independiente de WordPress.
   - **Simulación:** muestra qué pasaría al importar un export de WordPress, sin escribir nada. Se ajustó con el CSV real.
   - **Rol para la diplomatura:** se agregó el rol AGENT.
   - **Etapa 0 en la PC de la inmobiliaria:**
     - base de producción separada de la de desarrollo;
     - backups con copia externa;
     - restauración probada.
   - **01/10, primera importación real:** **188 propiedades** de WordPress cargadas en producción. Ese mismo día, la versión que trae altas, cambios, precios y bajas.
8. **Alquileres de consulta (02 al 07/10).**
   - Partió del traspaso que se hizo en un chat aparte de Alquileres.
   - Modelo de personas y unidades, área de preparación de los datos y reglas de identidad.
   - Se cargó en producción.
   - La candidata rc.2 corrigió los problemas que aparecieron al validarla en Windows (ver §5).
9. **Sincronización con WordPress (08/10).** Tres versiones candidatas en el día:
   - **v0.17:** buscador de unidades, más la reparación del paquete base que había preparado Tomás.
   - **v0.18:** cada baja de WordPress se registra como un **evento**, con motivo manual. Cada export se archiva con su huella SHA-256.
   - **v0.19:** botón "Actualizar desde WordPress", pantalla de revisión y una "firma" que garantiza que se aplique exactamente lo que se revisó.
   - **Revisión visual:** capturas automáticas en PC y celular.
10. **Análisis de los datos internos que viajaban en el export (08/10).**
    - Viajaban el nombre y el teléfono del dueño, y los datos de la cuenta de WordPress.
    - Tomás sacó 7 columnas del export.
    - El CRM dejó de leer y de exigir los datos del dueño (decisión 0063).
11. **Paso a Claude Code (08 al 13/10).** El ciclo ZIP → descargar → instalar era lento. Tomás pasó a trabajar con Claude Code en su PC, que entregó la v0.20.0-rc.2.
12. **Rol de asesor (13/10).**
    - Cierre de las recomendaciones anteriores.
    - Mapa de riesgos y plan por etapas: GitHub y seguridad, pase a producción, datos comerciales, Alquileres.
    - Documento de estado en el Proyecto.
    - Primer pedido para Claude Code (Etapa 1A: repositorio limpio, reglas permanentes en `CLAUDE.md`, escaneo de secretos).
    - Texto de traspaso para el chat siguiente.

## 3 · Qué decidió Tomás y qué propuso o resolvió la IA

**Decisiones de Tomás**, que no se podían deducir del código ni de los datos:
- **Reglas comerciales del motor:**
  - qué significa comercialmente una "Permuta";
  - que el estado de conservación no es lo mismo que la antigüedad;
  - que un campo vacío no es lo mismo que "Sin determinar";
  - que una propiedad sin precio no es un error;
  - que el límite de precio del 35% es duro, sin excepciones automáticas;
  - que una alternativa con dos niveles de conservación peores se descarta.
- **Que todo lo que se hacía en Excel tenía que poder hacerse desde la plataforma,** porque el resto de la inmobiliaria no usa planillas.
- **Alcance de la primera importación:** solo altas; una ciudad, un tipo o una operación fuera de catálogo detienen la importación; se agrega el tipo "Quinta".
- **Una baja de WordPress nunca cambia sola el estado comercial:**
  - el motivo lo indica una persona;
  - se quitó "Cancelada" de los motivos;
  - los exports se archivan con huella.
- **Producción solo con autorización explícita para cada operación concreta.** La migración 0007, ya aplicada, no se toca.
- **El token del export es un secreto:**
  - no se regeneró mientras el Apps Script viejo lo usaba;
  - nunca se muestra ni se escribe en ningún lado.
- **Datos del dueño fuera de WordPress (opción B):** lo ya cargado en el CRM no se borra.
- **Herramientas y forma de trabajo:**
  - pasar a Claude Code;
  - usar un chat de Claude como asesor en lugar de ChatGPT;
  - empezar GitHub con un commit limpio y documentar las versiones anteriores;
  - renovar las credenciales después de publicar el repositorio.

**Propuestas de la IA que Tomás validó:**
- Un solo núcleo de comparación con dos perfiles, en lugar de dos motores.
- Un único formato de respuesta para todos los criterios del motor.
- Moderar el puntaje según cuántos datos hay, en lugar de un umbral fijo.
- La persona como entidad principal, no la consulta.
- El patrón sugerencia → confirmación humana → medición de acuerdo.
- La baja de WordPress como evento propio, en vez de un campo en la propiedad.
- Archivar cada export y exigir la misma "firma" entre lo revisado y lo aplicado.
- Separar las bases y el commit inicial limpio.

**Lo que resolvió la IA con evidencia:** los defectos del sistema viejo.
- Dos funciones homónimas hacían que dormitorios y comodidades no puntuaran.
- La operación se comparaba con igualdad exacta: 10 de 18 demandas quedaban sin resultados.
- 53 identificadores de lead duplicados, 44 de ellos entre personas distintas.
- El 70% de los leads de Zonaprop no estaba vinculado a una propiedad.
- Las coordenadas nunca se importaban.
- Una credencial estaba escrita en el código (ya se reemplazó).

## 4 · Pedidos importantes de Tomás (citas textuales)

- **Prompt Maestro (24/08, redactado con ChatGPT):**
  > "IMPORTANTE: NO comiences construyendo código. Primero necesito que comprendas, audites y reconstruyas el sistema actual."
  > "NO impongo React, Node, Supabase, PostgreSQL ni ninguna otra tecnología."
  > "No construyas todavía. No migres todavía. No reemplaces Sheets todavía."
- **Pedido "Gestión completa de datos" (mediados de septiembre):**
  > "Todo lo que hoy hago en Excel tiene que poder hacerse desde la plataforma visual, y repercutir en la base de datos real."
  > "yo puedo usar Excel, pero el resto de la inmobiliaria no."
  > "No empieces a implementar. Antes quiero análisis y propuesta, porque hay decisiones de fondo."
  > Sobre las opciones para resolver el conflicto con WordPress: "No des por sentada ninguna."
- **Límites para la versión de bajas (08/10):**
  > "No tocar [la base de producción] sin autorización explícita. No convertir automáticamente una desaparición de WordPress en Vendida/Alquilada/Reservada. No ejecutar cambios irreversibles de datos reales sin revisión/autorización. No incluir credenciales, tokens ni datos reales en la candidata/ZIP."
- **Producción:**
  > "No modificar [la base de producción] sin mi autorización explícita para la operación concreta. No se deben aplicar migraciones ni ejecutar sincronizaciones sobre producción por una autorización genérica."
- **Token:**
  > "No quiero que lo muestres, copies ni escribas en ningún archivo de salida, mensaje, log o documentación."
- **Datos del dueño:**
  > "NO quiero que elimines ni modifiques esos campos todavía."
- **Prueba con datos reales:**
  > "Si encontrás algún problema, detenete en ese punto."
- **Cambio de método (13/10):**
  > "se me ocurrió de que desde este chat u otro chat dentro del proyecto de CRM Inmobiliaria de Claude, pueda funcionar como hasta el momento venia funcionando chatgpt, y que la parte de implementacion se encargo Claude code."
  > "Por el momento, NO quiero que implementes cambios ni que generes otra candidata."
- **Historial de GitHub (13/10):**
  > "Empecemos con un commit limpio por las dudas, y documentemos los anteriores de lo que hicimos y que fueron mejorando versión a versión."

## 5 · Qué salió mal y cómo se corrigió

**Propuestas de la IA que los datos refutaron.** Se midieron antes de aplicarlas:
- **Asimetría del precio:** dos propuestas descartadas. Las variantes simétricas empataban, y la invertida era la peor.
- **Vincular avisos de Zonaprop por el título:** 27 de 35 correspondencias eran otra propiedad. La regla se invirtió: la IA sugiere y la persona confirma.
- **"La centralidad no aporta":** el criterio no se estaba ejecutando. Una vez arreglado, estaba mal medido; se reescribió.
- **Pesos "óptimos" del motor:** perdían 25 puntos sobre las referencias reservadas. Se rechazaron.

**Errores de la IA durante el desarrollo.** Todos se detectaron ejecutando contra datos reales o con pruebas, no revisando el código:
- Usó el `REF` de Zonaprop como identificador de aviso, y no lo era.
- Inventó datos de prueba que confirmaban una suposición equivocada. El archivo real la contradijo.
- No decodificó la ciudad del export: el filtro descartaba 197 propiedades.
- Mapeó la columna "expenses" como un importe por su nombre, y era una nota comercial del precio. Se corrigió con el CSV real.

**Problemas técnicos:**
- **Pruebas sobre la base equivocada:** las pruebas escribían en la base de desarrollo (había 687 contactos donde la carga inicial puso 120). Se resolvió con el aislamiento de entornos de tres barreras.
- **Vulnerabilidades críticas en la versión de Next.js:** se actualizaron las dependencias.
- **La validación en Windows de la rc.1 falló en 14 de 222 pruebas.** Causas:
  - las pruebas corrían en paralelo sobre la misma base;
  - los mensajes de PostgreSQL estaban en español;
  - había **un error real**: las fechas de WordPress se leían 3 horas tarde, y se corrigió con la migración 0007.
- **El paquete base que armó Tomás tenía problemas:** textos con la codificación dañada y faltaban los archivos SQL de las migraciones. Se repararon y se verificaron uno por uno con SHA-256.
- **Una prueba de punta a punta encontró un error real:** un export más viejo podía pisar un precio más nuevo. Ahora la "firma" incluye el valor anterior y bloquea los exports más viejos.
- **El export real sin las columnas del dueño hacía abortar el importador.** La IA se detuvo y preguntó; Tomás eligió la opción B.
- **"Cancelada" quedó en las bases de desarrollo** donde se aplicó una versión temprana: se registró como deuda técnica.
- **El entorno de la IA no podía descargar desde el sitio de WordPress,** y el chat no estaba vinculado a la PC. La prueba de descarga real la terminó haciendo Claude Code en la PC.
- **El ciclo de ZIP era lento:** cada versión había que descargarla, instalarla y probarla a mano. Eso motivó el paso a Claude Code.

## 6 · Resultados concretos

- **Documentos:**
  - Informe de Auditoría Inicial.
  - Especificación del CRM V2 (objetivo y V2.1).
  - Análisis del dataset de validación y calibración del motor.
  - Arquitectura del CRM V2 y Decisiones consolidadas.
  - "Estado del proyecto" fechados.
  - Metodología (registro para el TFI).
  - Diseño de la sincronización con WordPress y análisis de los datos internos del export.
  - Estado y plan del 13/10, en el Proyecto.
- **Código:**
  - Versiones v0.1 a v0.19 (se conservan 19 ZIP, de la v0.9.1 en adelante).
  - Al 08/10 (v0.19.0-rc.1): **569 pruebas unitarias** (una falla conocida, DEM-32) y **259 de integración**, 21 pantallas y 8 migraciones.
- **Decisiones:** registradas una por archivo, con fecha, hasta la **0063**.
- **En producción, en la PC de la inmobiliaria:**
  - **188 propiedades reales** importadas desde WordPress (01/10);
  - Alquileres de consulta cargado;
  - backups con copia externa y restauración probada.
- **Método de trabajo** que siguieron las etapas posteriores:
  - Tomás decide;
  - un chat de Claude asesora y revisa;
  - Claude Code implementa;
  - las reglas permanentes quedan en `CLAUDE.md`;
  - toda decisión se documenta en el repositorio.

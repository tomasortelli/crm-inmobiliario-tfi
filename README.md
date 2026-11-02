# CRM Inmobiliario · Trabajo Final Integrador

Trabajo Final Integrador de la **Diplomatura en IA Aplicada a Entornos Digitales de Gestión** (FCE-UBA, cohorte 2026).
Autor: **Tomás Ortelli**.

Es un sistema de gestión para una inmobiliaria de Chivilcoy (provincia de Buenos Aires). Reemplaza de a poco a un CRM anterior, hecho sobre
Google Sheets con Apps Script.

> **Sobre este repositorio:** el desarrollo real ocurrió en un **repositorio privado**, porque trabaja con datos reales de la inmobiliaria
> y de sus clientes. Este repositorio público es la entrega: tiene el código de la primera versión, la evolución del proyecto y capturas
> de la versión actual con las propiedades publicadas en el sitio y datos ficticios. Sus commits son nuevos: no reproducen la historia ni las fechas del repositorio privado. Las
> fechas reales de cada cambio están en [`evolucion/`](evolucion/).

## Qué hace
- **Venta:**
  - la cartera de propiedades, que se actualiza desde la página web de la inmobiliaria (WordPress);
  - los contactos y lo que busca cada uno (demandas), las visitas, las ofertas y los cierres.
- **Coincidencias:** un motor compara cada propiedad con cada demanda y da un puntaje.
  - Responde dos preguntas: «¿qué le ofrezco a este cliente?» y «¿a quién le ofrezco esta propiedad?».
  - Cada puntaje se puede abrir para ver por qué: precio, ubicación, ambientes, comodidades.
- **Hoy:** el resumen del día y lo que hay que resolver:
  - coincidencias nuevas y contactos para seguir;
  - cambios de la página web;
  - ajustes de alquiler y recibos del período.
- **Alquiler:**
  - contratos con ajuste por índices oficiales (ICL e IPC), propuesto por el sistema y confirmado por una persona;
  - recibos emitidos, impresos y anulados, renovaciones y propietarios.
- **Estadísticas:**
  - la cartera, la actividad comercial y las operaciones cerradas;
  - los motivos de baja y la evolución de precios.
- **Virtual Staging:** una galería de videos generados con IA (Magnific) que muestran ambientes reales amueblados virtualmente.
- **Administración:** usuarios y roles, integraciones, aceptación de los Términos y la Política de Privacidad.

## Para qué sirve
- **Ordenar el trabajo comercial:** que ninguna consulta quede sin respuesta y que cada propiedad llegue a quien la está buscando.
- **Reemplazar las planillas por una base de datos:** cada cambio queda registrado, con quién lo hizo y cuándo.
- **Automatizar lo repetitivo, con control humano:** la importación desde la web, los ajustes de alquiler y los avisos por WhatsApp y mail.
  El sistema propone, una persona confirma.

## Cómo se usa
- **Demo:** https://crm-ortelli-demo.up.railway.app
  - **Las credenciales se envían por mail al docente.**
  - Al ingresar se aceptan los Términos y Condiciones de Uso y la Política de Privacidad.
- **Datos:** las propiedades son las publicadas en el sitio de la inmobiliaria; personas, contratos, recibos e importes son ficticios.
  - «Actualizar desde WordPress simulado» agrega cambios ficticios: cambios de precio, un aviso nuevo inventado y una baja.
  - Las capturas de este repositorio muestran lo mismo: las propiedades reales publicadas en el sitio, y todo lo demás ficticio.
  - Cada pantalla de la demo tiene una **guía** («Ver») que explica qué muestra y qué se puede probar.
- **Recorrido sugerido:**
  1. **Hoy**: el resumen del día.
  2. **Venta → Propiedades**: una ficha, y «¿A quién se la ofrezco?».
  3. **Venta → Coincidencias**: el puntaje y «¿Por qué este puntaje?».
  4. **Venta → WordPress**: «Actualizar desde WordPress simulado». Después, **Retasaciones** y **Bajas de WordPress**.
  5. **Alquiler → Recibos**: emitir, imprimir y anular un recibo.
  6. **Estadísticas**.
- **En el celular:** la barra de abajo tiene **«Más»**, con Virtual Staging, Estadísticas y Administración.

## Evolución: de la v1 a la v2

### v1 · Google Sheets + Apps Script
- **Qué es:** una planilla de Google con menús y procesos en Apps Script.
- **Qué hacía:**
  - importaba el export de propiedades de WordPress;
  - llevaba consultas, seguimientos y demandas;
  - buscaba coincidencias y propiedades similares.
- **Fechas:**
  - empezó en **junio de 2026**, después de la primera clase de la diplomatura;
  - los archivos del código tienen fechas del **12/08/2026 al 24/08/2026** (última modificación);
  - la importación se ajustó el **14/10/2026**, cuando cambió el export de WordPress.
- **Asistencia de IA:** se hizo con ayuda de **ChatGPT**.
- **Código:** en [`v1-apps-script/`](v1-apps-script/).
- **Por qué hacía falta otra versión:**
  - la lógica de comparación estaba mezclada con la lectura y escritura de la planilla;
  - no había pruebas;
  - no había usuarios ni permisos;
  - una planilla no guarda quién cambió qué.

### v2 · Aplicación web
- **Tecnologías:** Next.js, React, TypeScript, Tailwind CSS y PostgreSQL. Las pruebas corren con el ejecutor de pruebas de Node.
- **Despliegue:**
  - la demo corre en Railway;
  - producción sigue instalada en la PC de la inmobiliaria. El pase a la nube viene después de esta entrega.
- **Cómo se trabajó:**
  - **cada decisión quedó escrita**, con su fecha y su porqué: 108 decisiones al 28/10/2026, de la 0001 a la 0108;
  - **desde el 13/10/2026, cada cambio entró por un pull request**: 75 al 28/10/2026;
  - al 28/10/2026 hay 1.082 pruebas unitarias y 406 de integración.
- **Asistencia de IA:** se hizo con **Claude**, en dos papeles:
  - un **chat asesor**, que redactaba los pedidos y revisaba los resultados;
  - **Claude Code**, que implementaba los cambios.
  - Revisé cada cambio antes de unirlo.

| Fecha | Hito |
|---|---|
| junio de 2026 | Empieza la v1 (Google Sheets + Apps Script), después de la primera clase de la diplomatura. |
| 05/09/2026 | Primeras decisiones fechadas del núcleo de comparación (desde la 0010). |
| 14/09/2026 – 16/09/2026 | Primera versión con repositorio en memoria; después, PostgreSQL y las pantallas sobre la base (v0.6.0 y v0.7.0). |
| 17/09/2026 – 20/09/2026 | Ingreso con usuarios y roles, visitas, entornos separados (v0.8.0 a v0.9.1). |
| 27/09/2026 – 30/09/2026 | Simulación de la importación de WordPress y ajuste con el export real (v0.11.0 a v0.12.5). |
| 01/10/2026 | Base de producción separada y primera importación de la cartera publicada (v0.13.0 y v0.14.0). |
| 02/10/2026 – 10/10/2026 | Actualizaciones desde WordPress, Alquileres de consulta, bajas y retasaciones (v0.15.0 a v0.20.0-rc.1). |
| 13/10/2026 | Repositorio privado: primer commit (v0.20.0-rc.2). |
| 15/10/2026 – 16/10/2026 | Demo en Railway, con las propiedades publicadas y personas ficticias. Producción sigue en la PC de la inmobiliaria. |
| 16/10/2026 – 21/10/2026 | Coincidencias más claras, avisos por WhatsApp y mail, guías de la demo, importación del CRM anterior. |
| 20/10/2026 – 28/10/2026 | Alquileres operativo: contratos, ajustes por índices y recibos. |
| 27/10/2026 – 28/10/2026 | Demo de la diplomatura: Estadísticas, WordPress simulado, Términos y consentimiento, Integraciones, Virtual Staging y revisión en el celular. |

El detalle está en:
- [`evolucion/historial-versiones.md`](evolucion/historial-versiones.md): las versiones anteriores al repositorio privado;
- [`evolucion/decisiones.md`](evolucion/decisiones.md): las 108 decisiones, con número, fecha y título;
- [`evolucion/pull-requests.md`](evolucion/pull-requests.md): los 75 pull requests, con número, fechas y título.

## Qué hay en este repositorio
| Carpeta | Contenido |
|---|---|
| [`v1-apps-script/`](v1-apps-script/) | El código de la primera versión (Apps Script). La URL del export de WordPress está reemplazada por un marcador. |
| [`evolucion/`](evolucion/) | Historial de versiones, decisiones y pull requests. |
| [`prompts/`](prompts/) | Resúmenes de los chats con IA (ChatGPT y Claude): qué se hizo, quién decidió qué, los pedidos más importantes y qué salió mal. Sin nombres de personas ni datos reales. Con su [índice](prompts/README.md). |
| [`informe/`](informe/) | El informe del trabajo, en PDF: [`TFI_Tomas_Ortelli.pdf`](informe/TFI_Tomas_Ortelli.pdf). |
| [`capturas/`](capturas/) | Capturas de la v2 en escritorio y celular: las propiedades reales publicadas en el sitio, y todo lo demás ficticio. Con su [índice](capturas/indice.md). |

**El informe del trabajo:** [`informe/TFI_Tomas_Ortelli.pdf`](informe/TFI_Tomas_Ortelli.pdf).

**Qué no hay:** el código de producción de la v2, datos reales, credenciales ni configuración de los servidores.

## El código de producción
- **Dónde está:** el código de producción de la v2 está en un **repositorio privado**, porque va a manejar datos reales y tiene
  documentación interna.
- **Docentes:** los docentes de la diplomatura tienen acceso por invitación.
- **Para pedir acceso:** quien quiera verlo puede pedírmelo, indicando su usuario de GitHub o su correo.

---

© 2026 Tomás Ortelli. Todos los derechos reservados.

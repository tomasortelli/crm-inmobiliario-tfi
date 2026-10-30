# Capturas para el informe de la diplomatura

Tomadas el 30/10/2026 sobre una **base local de demostración** (marcada «demo»), cargada con `demo:cargar` y el export real más reciente
del sitio de la inmobiliaria (WP All Export del 16/10/2026). La versión del CRM es la de `main` del 28/10/2026 (PR #75).

- **Datos reales:** sólo las **propiedades publicadas en el sitio**, con sus fotos (178), y los videos de Virtual Staging del canal de
  YouTube de la inmobiliaria. Son datos públicos: el export no trae dueños, teléfonos ni mails.
- **Datos ficticios:** todo lo demás, como en la demo:
  - personas, demandas, visitas, ofertas, contratos, recibos, importes y cierres;
  - los teléfonos son números inexistentes (el número local empieza con 0) y los mails son de `ejemplo.test`;
  - el encabezado del recibo es de ejemplo.
- **Tamaño:** escritorio, 1366 × 900; celular, 390 × 844, en doble resolución.
- **Guías:** las guías de la demo están plegadas para que se vea el contenido, salvo en la 32.
- **WordPress simulado:** «Actualizar desde WordPress simulado» se usó una sola vez, en la 13, que se tomó al final. Por eso las demás
  no muestran cambios ficticios: Retasaciones (14), Bajas (15) y los motivos de baja (25) todavía están vacíos.
- **No está la 27** (Administración), porque mostraba la configuración interna del sistema. Los números de las demás no cambian.

| N° | Archivos (`-escritorio.png` / `-celular.png`) | Qué muestra |
|---|---|---|
| 01 | `01-ingresar` | Pantalla de ingreso, la primera vez en un navegador: email, contraseña y las dos casillas obligatorias («Acepto los Términos y Condiciones de Uso» y «Acepto la Política de Privacidad»), sin tildar. |
| 02 | `02-ingresar-casillas-tildadas` | La misma pantalla, las veces siguientes en ese navegador: las casillas aparecen ya tildadas, pero siempre visibles. Si cambia la versión de los textos, vuelven a aparecer sin tildar. |
| 03 | `03-hoy` | Hoy: el resumen del día y lo que hay que resolver (Venta y Alquileres). |
| 04 | `04-venta-resumen` | Venta: la portada del módulo. |
| 05 | `05-venta-propiedades` | La cartera de propiedades publicadas en el sitio, con fotos, buscador y filtros. |
| 06 | `06-venta-propiedad-ficha` | Ficha de una propiedad publicada: datos, historial de precios, «Registrar oferta» y «Registrar cierre». |
| 07 | `07-venta-propiedad-a-quien-ofrecerla` | «¿A quién se la ofrezco?»: las demandas (ficticias) que encajan, con puntaje, «¿Por qué…?» y los avisos por WhatsApp y mail. |
| 08 | `08-venta-contactos` | Contactos (ficticios). |
| 09 | `09-venta-contacto-ficha` | Ficha de un contacto (ficticio): datos, consentimiento, demandas e historia con la persona. |
| 10 | `10-venta-demandas` | Demandas: qué busca cada persona y las propiedades publicadas que mejor le encajan. |
| 11 | `11-venta-coincidencias` | Coincidencias: qué ofrecerle a cada cliente, desde 70 puntos. |
| 12 | `12-visitas` | La agenda de visitas. |
| 13 | `13-venta-wordpress-simulado` | Sincronización con WordPress en la demo, después de «Actualizar desde WordPress simulado»: la ronda agrega cambios ficticios (un aviso nuevo inventado, tres cambios de precio y una baja). |
| 14 | `14-venta-retasaciones` | Retasaciones: cada cambio de precio con el anterior, el nuevo y la variación. Acá todavía no hay cambios, porque la base se cargó con un solo export. |
| 15 | `15-venta-bajas` | Bajas de WordPress: las publicaciones que desaparecieron del sitio, con su motivo. Acá todavía no hay bajas. |
| 16 | `16-alquiler-portada` | Alquiler: lo que funciona, los módulos en versión básica y lo que todavía no está. |
| 17 | `17-alquiler-contratos` | La lista de contratos de alquiler (ficticios). |
| 18 | `18-alquiler-contrato-ficha` | Ficha de un contrato: estado, valor vigente, partes. |
| 19 | `19-alquiler-contrato-recibos` | La misma ficha más abajo: recibo emitido (Imprimir / Anular), condición de ajuste e historial del valor. |
| 20 | `20-alquiler-recibo-impreso` | El recibo listo para imprimir en media hoja A4, con un encabezado de ejemplo. En el celular la hoja se achica para verse entera. |
| 21 | `21-alquiler-renovaciones` | Renovaciones: los contratos que vencen en los próximos 90 días. |
| 22 | `22-alquiler-propietarios` | Propietarios (ficticios): sus unidades, contratos y recibos (sin liquidación: sigue en PAC). |
| 23 | `23-estadisticas` | Estadísticas: la cartera publicada (por tipo, operación y estado) y la actividad comercial. |
| 24 | `24-estadisticas-operaciones-cerradas` | Operaciones cerradas (ficticias): vendidas, alquiladas, tiempo promedio de venta, conversión y el gráfico por mes. |
| 25 | `25-estadisticas-motivos-y-precios` | Motivos de baja por mes (todavía sin bajas) y evolución de precios. |
| 26 | `26-virtual-staging` | Virtual Staging: la galería de videos generados con IA (Magnific), que muestran ambientes reales amueblados virtualmente. |
| 28 | `28-administracion-integraciones` | Integraciones: WordPress simulado, índices, WhatsApp y mail por enlace, Meta verificado y la API todavía no conectada. |
| 29 | `29-terminos` | Términos de uso (borrador para revisión legal). |
| 30 | `30-privacidad` | Política de privacidad (borrador, Ley 25.326). |
| 31 | `31-menu-mas-celular.png` | Sólo celular: el menú «Más» de la barra de abajo (Virtual Staging, Estadísticas, Administración). |
| 32 | `32-guia-de-la-demo` | Una pantalla con la guía de la demo abierta (Contratos y recibos). |

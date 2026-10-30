# Historial de versiones anteriores al repositorio (v2)

El repositorio privado de la v2 empieza el **13/10/2026**, con la versión **v0.20.0-rc.2**. Las versiones anteriores no se subieron a
ningún repositorio: este historial las reconstruye a partir de la documentación del proyecto y de las copias guardadas de cada versión.

**Cómo leer las fechas:**
- **doc:** la fecha que da la documentación.
- **archivos:** la última modificación de los archivos de la copia guardada. Puede ser posterior a la entrega de esa versión.
- **sin copia:** no quedó ninguna copia de esa versión; lo que se dice sale sólo de la documentación.

| Versión | Fecha | Qué cambió | Decisiones |
|---|---|---|---|
| hasta v0.5.x | sin datos | Diseño del núcleo de comparación, modelo de datos, importación y calibración del motor. | 0001–0034 |
| v0.6.0 | sin copia | Las pantallas leen de PostgreSQL. | 0035 |
| v0.7.0 | archivos 16/09/2026 | Altas, bajas y modificaciones comerciales sobre PostgreSQL. | 0036 |
| v0.7.1 – v0.7.4 | sin copia | Búsquedas, listas, demandas archivadas fuera del motor. | — |
| v0.7.5 – v0.7.6 | archivos 17/09/2026 (v0.7.6) | Fecha y origen del último contacto. | — |
| v0.8.0 | sin copia | Ingreso con usuarios propios guardados en PostgreSQL. | 0037 |
| v0.8.1 | sin copia | El estado comercial recorta el motor. | 0038 |
| v0.9.0 | sin copia | Visitas como módulo propio. | 0039 |
| v0.9.1 | sin copia | Entornos separados (desarrollo, pruebas y producción). | 0040 |
| v0.10.0 | sin copia | Qué propiedad puede ser candidata del motor · identidad y publicaciones de cada propiedad. | 0041 · 0042 · 0043 |
| v0.11.0 | sin copia | Simulación de la importación de WordPress. | 0044 |
| v0.11.1 | archivos 28/09/2026 | Revisión de la simulación: un defecto de bajas corregido, moneda fuera de la comparación, informe legible. | 0044 |
| v0.12.0 | archivos 29/09/2026 | Rol AGENT para la diplomatura, «Salir» siempre a mano, listas completas, descripción y códigos. | 0045 |
| v0.12.1 | archivos 29/09/2026 | La simulación lee el CSV de WP All Export · gestión de usuarios con doble verificación de permisos. | 0046 |
| v0.12.2 | archivos 30/09/2026 | Correcciones con el export real: ambientes y nota del precio como texto. | 0047 |
| v0.12.3 | archivos 30/09/2026 | Mapeo final del CSV: descripción, imagen, piso, monoambiente. | 0048 |
| v0.12.4 | archivos 30/09/2026 | Números como en Argentina, año de construcción, piso como evidencia de unidad. | 0049 |
| v0.12.5 | archivos 30/09/2026 | Piso desde el título · dependencias sin vulnerabilidades · simulación con el CSV real aprobada. | 0049 |
| v0.13.0 | archivos 01/10/2026 | Etapa 0: base de producción separada, catálogos, backup, prueba de restauración e indicador de entorno. | 0050 |
| v0.14.0 | archivos 01/10/2026 | Primera importación controlada desde WordPress, sólo altas. Con esta versión se cargó la cartera publicada en producción. | 0051 |
| v0.14.1 | archivos 01/10/2026 | Búsqueda por código, miniaturas, enlaces externos en otra pestaña. | 0052 |
| v0.15.0 | archivos 02/10/2026 | Actualizaciones desde WordPress (cambios, precios, bajas, reactivaciones) · aviso en Hoy · tipo Quinta. | 0053 |
| v0.16.0-rc.1 | doc 03/10/2026 · archivos 06/10/2026 | Partes, Unidades y Alquileres de consulta; reglas de identidad; área de carga intermedia. | 0054 · 0055 · 0056 · 0057 |
| v0.16.0-rc.2 | doc 06/10/2026 · archivos 07/10/2026 | Pruebas aisladas, dos zonas horarias, fechas de WordPress como instantes; datos repetidos del paquete de alquileres. Es la versión que quedó instalada en producción. | 0058 · 0059 |
| v0.17.0-rc.1 | doc y archivos 08/10/2026 | Buscador de Unidades · configuración por función · verificador del esquema. | 0060 |
| v0.18.0-rc.1 | doc y archivos 08/10/2026 | Bajas de WordPress como eventos, con motivo manual · archivo de exports con huella SHA-256 · pantalla Bajas de WordPress. | 0061 |
| v0.19.0-rc.1 | doc y archivos 08/10/2026 | Descarga del export de WordPress desde el CRM, pantalla de revisión y firma de cambios; nunca se aplica un export incompleto ni más viejo. | 0062 |
| v0.20.0-rc.1 | doc 10/10/2026 | El importador deja de depender de datos internos del export, escape de fórmulas y coordenadas, franjas de cercanía, sincronización a la vista, Retasaciones. | 0063 · 0064 · 0065 · 0066 |

La **v0.20.0-rc.2** (decisiones 0067 y 0068) es el contenido del primer commit del repositorio privado, el 13/10/2026. Desde ahí, cada
cambio está en [`pull-requests.md`](pull-requests.md).

## Huecos conocidos
- No quedaron copias de las versiones 0.8.0 a 0.11.0, ni de 0.6.0, 0.7.1–0.7.5, ni de nada anterior a 0.7.0.
- Las decisiones 0001–0034 no tienen versión asignada en ningún documento.
- Las fechas «archivos» indican cuándo se tocó la copia por última vez, no necesariamente cuándo se entregó la versión.

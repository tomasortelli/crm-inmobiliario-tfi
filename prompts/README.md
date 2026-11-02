# Resúmenes de los chats con IA

Cuatro resúmenes de los chats con IA que se usaron para hacer el CRM. Cada uno lo escribió el propio chat a pedido de Tomás, el
29/10/2026, para el informe de la diplomatura: qué se hizo, quién decidió qué, los pedidos más importantes, qué salió mal y los
resultados. Tres eran documentos de Word y se pasaron a Markdown; el cuarto ya estaba en Markdown.

| Archivo | Chat | Período | Modelo |
|---|---|---|---|
| [`chatgpt-alquileres.md`](chatgpt-alquileres.md) | ChatGPT · Alquileres: investigación del sistema de recibos anterior (PAC) y de las planillas de contratos, cruce de las fuentes y traspaso al desarrollo del CRM | agosto – octubre de 2026 | ChatGPT · GPT-6 Luna |
| [`chatgpt-desarrollo-general.md`](chatgpt-desarrollo-general.md) | ChatGPT · desarrollo general: análisis, planificación y revisión de las versiones v0.16 a v0.20 (Alquileres de consulta y sincronización con WordPress) | septiembre – octubre de 2026, sobre todo del 04/10 al 09/10 | ChatGPT · GPT-6 Luna |
| [`claude-desarrollo-general.md`](claude-desarrollo-general.md) | Claude · chat principal de desarrollo, en el Proyecto «CRM Inmobiliario» de claude.ai: auditoría del CRM anterior, diseño y construcción de la v2 hasta la v0.19; desde el 13/10, asesor de Claude Code | 24/08/2026 – 13/10/2026 | Claude Sonnet 5 hasta el 13/10; Claude Opus 5.5 desde entonces |
| [`claude-alquileres.md`](claude-alquileres.md) | Claude · Alquileres, en el mismo Proyecto: definición funcional del módulo, migración de su historia y respuestas a Claude Code durante la implementación | mediados de septiembre – 29/10/2026 | Claude Sonnet 5 hasta el 13/10; Claude Opus 5.5 desde entonces |

## Cómo se limpiaron
- **Personas:** no hay nombres de personas salvo el de Tomás. Las dos personas de la inmobiliaria que confirmaron las reglas de
  Alquileres aparecen por su rol: «el responsable de alquileres» y «la persona que calcula los ajustes».
- **Datos reales:** no hay datos de clientes, inquilinos ni propietarios, direcciones de propiedades alquiladas ni importes de
  contratos. Las cantidades (por ejemplo, cuántas personas o recibos se migraron) son totales, sin datos de nadie.
- **Detalles técnicos internos:** no hay tokens, contraseñas, URLs internas ni nombres de variables.
  - El nombre interno de la base de producción se cambió por «[la base de producción]», también dentro de las citas.
  - Los nombres de columnas se cambiaron por su descripción.
- **Pasajes sacados:** lo que no se podía limpiar sin perder sentido se sacó y quedó marcado. No hizo falta sacar nada por datos
  reales («[omitido: datos reales]»); se sacó un solo pasaje, en `chatgpt-alquileres.md`, marcado «[omitido: detalle interno de
  seguridad]».
- **Texto original:** lo demás es el texto tal como lo escribió cada chat, con su tono y sus aclaraciones (por ejemplo, qué está
  reconstruido y qué es cita textual).

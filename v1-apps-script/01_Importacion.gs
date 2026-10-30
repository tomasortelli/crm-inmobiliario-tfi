function probarCSV() {

  const token = PropertiesService.getScriptProperties().getProperty('WP_EXPORT_TOKEN');
  const url = '[URL_DEL_EXPORT_DE_WORDPRESS]'; // marcador: la URL real del export (dominio, número de export y token) no se publica

  const respuesta = UrlFetchApp.fetch(url);

  Logger.log(respuesta.getContentText());

}

function importarCSV() {

  const token = PropertiesService.getScriptProperties().getProperty('WP_EXPORT_TOKEN');
  const url = '[URL_DEL_EXPORT_DE_WORDPRESS]'; // marcador: la URL real del export (dominio, número de export y token) no se publica

  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RAW');

  const csv = UrlFetchApp.fetch(url).getContentText();

  const datos = Utilities.parseCsv(csv);

  hoja.clearContents();

  hoja.getRange(1, 1, datos.length, datos[0].length).setValues(datos);

  hoja.setRowHeights(1, datos.length, 20);

  hoja.getDataRange().setWrap(false);

}

function limpiarDescripcionHTML(texto) {

  if (!texto) return "";

  return texto
    .toString()

    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")

    .trim();

}

function sincronizarPropiedades() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const raw =
    ss.getSheetByName("RAW");

  const propiedades =
    ss.getSheetByName("Propiedades");

  const historico =
    ss.getSheetByName("Historico Propiedades");

  const datos = raw.getDataRange().getValues();

  const encabezados = datos[0];

  const datosActuales = propiedades.getDataRange().getValues();

  const memoriaCRM = {};

  const historialPrecios =
    ss.getSheetByName("Historial Precios");

  const preciosAnteriores = {};

  if (datosActuales.length > 1) {

    for (let i = 1; i < datosActuales.length; i++) {

      const id =
        String(datosActuales[i][0] || "");

      const valor =
        datosActuales[i][12];

      const titulo =
        datosActuales[i][1];

      preciosAnteriores[id] = {

        precio: valor,
        titulo: titulo

      };

    }

  }

  if (datosActuales.length > 1) {

    for (let i = 1; i < datosActuales.length; i++) {

      const filaActual = datosActuales[i];

      const id = filaActual[0];

      memoriaCRM[id] = {
        estadoCRM: filaActual[7],
        fechaEstado: filaActual[8],
        observaciones: filaActual[9]
      };

    }

  }

  function col(nombre) {
    return encabezados.indexOf(nombre);
  }

  const resultado = [];

  resultado.push([
    "ID",
    "Título",
    "Página Web",
    "Fecha Alta",
    "Fecha Modificación",
    "Operación",
    "Descripción",
    "Estado CRM",
    "Fecha Estado",
    "Observaciones",
    "Apto Crédito",
    "Tipo",
    "Valor",
    "Moneda",
    "Precio Mostrar",
    "Dormitorios",
    "Aclaración Dormitorios",
    "Baños",
    "Sup. Cubierta",
    "Sup. Terreno",
    "Vista",
    "Ambientes",
    "Comodidades",
    "Expensas",
    "Antigüedad",
    "Servicios",
    "Dirección",
    "Ciudad",
    "Permuta",
    "Rango Precio",
    "Dueño",
    "Teléfono",
    "Estado Publicación",
    "YouTube",
    "Imagen Destacada",
    "Etiquetas",
    "Fecha Última Sync",
    "Días Publicada",
    "WhatsApp Dueño",
    ""
  ]);

  const idsActuales = new Set();

  for (let i = 1; i < datos.length; i++) {

    const fila = datos[i];

    const id = fila[col("ID")];

    idsActuales.add(String(id));

    const memoria = memoriaCRM[id] || {
      estadoCRM: "",
      fechaEstado: "",
      observaciones: ""
    };

    const servicios = fila[col("rem_property_detail_cbs")] || "";

    const textoServicios =
      servicios.toString().toLowerCase();

    const aptoCredito =
      textoServicios.includes("apta crédito") ||
      textoServicios.includes("apto crédito")
        ? "Sí"
        : "No";
        
    const operacion =
      limpiarArrayREM(
        fila[col("rem_property_purpose")]
      );

    const descripcionLimpia =
      limpiarDescripcionHTML(
        fila[col("Content")]
      );

    const valor = fila[col("rem_property_price")] || "";

    const precioAnteriorObj =
      preciosAnteriores[String(id)];

    if (
      precioAnteriorObj &&
      Number(precioAnteriorObj.precio) !== Number(valor)
    ) {

      Logger.log(
        "ID: " + id +
        " | Anterior: " + precioAnteriorObj.precio +
        " | Nuevo: " + valor
      );

      historialPrecios.appendRow([

        id,

        fila[col("Title")],

        precioAnteriorObj.precio,

        valor,

        new Date(),

        ""

      ]);

    }

    const fechaAlta = fila[col("Date")];

    const fechaSync = new Date();

    let diasPublicada = "";

    if (fechaAlta) {

      const fecha1 = new Date(fechaAlta);

      const diferencia =
        fechaSync.getTime() - fecha1.getTime();

      diasPublicada =
        Math.floor(diferencia / (1000 * 60 * 60 * 24));

    }

    const telefono =
      fila[col("rem_telefono_del_dueo")] || "";

    let whatsapp = "";

    if (telefono !== "") {

      let numero =
        telefono.toString().replace(/\D/g, "");

      if (!numero.startsWith("54")) {
        numero = "54" + numero;
      }

      whatsapp =
        "https://wa.me/" + numero;

    }

    let moneda = "";
    let precioMostrar = "";

    if (
      operacion.toLowerCase().includes("venta") ||
      operacion.toLowerCase().includes("permuta")
    ) {
      moneda = "USD";
    }

    if (
      operacion.toLowerCase().includes("alquiler")
    ) {
      moneda = "$";
    }

    if (valor !== "") {

      if (moneda === "USD") {
        precioMostrar = "USD " + valor;
      }

      if (moneda === "$") {
        precioMostrar = "$" + valor;
      }

    }

    resultado.push([

      fila[col("ID")],
      fila[col("Title")],
      fila[col("Permalink")],

      fila[col("Date")],
      fila[col("Post Modified Date")],

      operacion,

      fila[col("Content")],

      memoria.estadoCRM,
      memoria.fechaEstado,
      memoria.observaciones,

      aptoCredito,

      limpiarArrayREM(
        fila[col("rem_property_type")]
      ),

      valor,
      moneda,
      precioMostrar,

      fila[col("rem_property_bedrooms")],
      fila[col("rem_property_aclaración")],
      fila[col("rem_property_bathrooms")],
      fila[col("rem_property_area")],
      fila[col("rem_property_surface")],
      fila[col("rem_property_view")],
      fila[col("rem_property_ambientes2")],
      limpiarArrayREM(
        fila[col("rem_property_comfort")]
      ),
      fila[col("rem_property_ expenses")],
      fila[col("rem_property_antique")],

      limpiarArrayREM(servicios),

      fila[col("rem_property_address")],
      limpiarArrayREM(
        fila[col("rem_property_city")]
      ),
      fila[col("rem_property_barter")],
      limpiarArrayREM(
        fila[col("rem_property_money")]
      ),
      fila[col("rem_nombre_del_dueo")],
      fila[col("rem_telefono_del_dueo")],

      "Publicado",

      fila[col("rem_property_video")],
      fila[col("Image Featured")],
      fila[col("Property Tags")],

      fechaSync,
      diasPublicada,
      whatsapp,
      descripcionLimpia

    ]);

  }

  for (let i = 1; i < datosActuales.length; i++) {

    const filaAnterior = datosActuales[i];

    const idAnterior =
      String(filaAnterior[0] || "");

    if (
      idAnterior !== "" &&
      !idsActuales.has(idAnterior)
    ) {

      resultado.push([

        filaAnterior[0],   // ID
        filaAnterior[1],   // Título
        filaAnterior[2],   // Página Web
        filaAnterior[3],   // Fecha Alta
        filaAnterior[4],   // Fecha Modificación
        filaAnterior[5],   // Operación
        filaAnterior[6],   // Descripción

        filaAnterior[7],   // Estado CRM
        filaAnterior[8],   // Fecha Estado
        filaAnterior[9],   // Observaciones

        filaAnterior[10],  // Apto Crédito
        filaAnterior[11],  // Tipo
        filaAnterior[12],  // Valor
        filaAnterior[13],  // Moneda
        filaAnterior[14],  // Precio Mostrar
        filaAnterior[15],  // Dormitorios
        filaAnterior[16],
        filaAnterior[17],
        filaAnterior[18],
        filaAnterior[19],
        filaAnterior[20],
        filaAnterior[21],
        filaAnterior[22],
        filaAnterior[23],
        filaAnterior[24],
        filaAnterior[25],
        filaAnterior[26],
        filaAnterior[27],
        filaAnterior[28],
        filaAnterior[29],
        filaAnterior[30],
        filaAnterior[31],

        "Eliminado",

        filaAnterior[33],
        filaAnterior[34],
        filaAnterior[35],

        new Date(),
        filaAnterior[37],
        filaAnterior[38],
        filaAnterior[39]

      ]);

    }

  }

  if (propiedades.getLastRow() > 0) {

    propiedades.getRange(
      1,
      1,
      propiedades.getLastRow(),
      propiedades.getLastColumn()
    ).clearContent();

  }

  propiedades.getRange(
    1,
    1,
    resultado.length,
    resultado[0].length
  ).setValues(resultado);

}

function limpiarArrayREM(valor) {

  if (!valor) return "";

  valor = valor.toString();

  const coincidencias =
    [...valor.matchAll(/"([^"]+)"/g)];

  const resultado = [];

  for (let i = 0; i < coincidencias.length; i++) {

    const texto = coincidencias[i][1];

    if (
      texto !== "on" &&
      !/^\d+$/.test(texto)
    ) {
      resultado.push(texto);
    }

  }

  return resultado.join(", ");

}

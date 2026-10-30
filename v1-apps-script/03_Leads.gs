function generarIdLead() {

  return "LEAD-" +
    Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyyMMddHHmmss"
    );

}

function importarLeadsZonaprop() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const origen =
    ss.getSheetByName(
      "IMPORT_ZONAPROP"
    );

  const interesados =
    ss.getSheetByName(
      "Interesados"
    );

  const datos =
    origen.getDataRange().getValues();

  for (let i = 1; i < datos.length; i++) {

    const fila = datos[i];

    const importado =
      String(fila[17] || "");

    if (
      importado.toUpperCase() === "SI"
    ) {
      continue;
    }

    let tipoCliente = "";
    let moneda = "";
    let idPropiedad = "";
    let linkPropiedad = "";
    let ciudad = "";
    let tipoPropiedad = "";
    let operacionPropiedad = "";

    const operacion =
      String(fila[13] || "")
        .toLowerCase();

    const tituloZonaprop =
      String(fila[15] || "");

    const tituloBuscado =
      tituloZonaprop
        .split(" - ")[0]
        .trim();

    if (operacion.includes("venta")) {

      tipoCliente = "Comprador";
      moneda = "USD";

    }

    if (operacion.includes("alquiler")) {

      tipoCliente = "Alquiler";
      moneda = "$";

    }

    const propiedades =
      ss.getSheetByName(
        "Propiedades"
      );

    const datosPropiedades =
      propiedades
        .getDataRange()
        .getValues();

    for (
      let j = 1;
      j < datosPropiedades.length;
      j++
    ) {

      const tituloCRM =
        String(
          datosPropiedades[j][1] || ""
        ).trim();

      if (
        tituloCRM.toUpperCase() ===
        tituloBuscado.toUpperCase()
      ) {

        idPropiedad =
          datosPropiedades[j][0];

        operacionPropiedad =
          datosPropiedades[j][5];

        tipoPropiedad =
          String(
            datosPropiedades[j][11] || ""
          ).trim();

        ciudad =
          datosPropiedades[j][27];

        linkPropiedad =
          datosPropiedades[j][2];

        break;

      }

    }

    interesados.appendRow([

      generarIdLead(),

      new Date(),

      fila[0],   // Nombre

      fila[1],   // Email

      fila[2],   // Teléfono

      fila[3],   // Teléfono 2

      "Zonaprop",

      "Nuevo",

      tituloBuscado,

      idPropiedad,

      operacionPropiedad ||
      fila[13],

      tipoCliente,

      tipoPropiedad ||
      fila[12],

      ciudad ||
      fila[10],

      fila[14],

      moneda,

      fila[5],   // Mensaje

      "",

      "",

      "",

      "",

      "",

      linkPropiedad ||
      fila[16],

      "",

      ""

    ]);

    origen.getRange(
      i + 1,
      18
    ).setValue("SI");

  }

  actualizarCantidadInteresados();

}

function actualizarClientes() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const interesados =
    ss.getSheetByName("Interesados");

  const clientes =
    ss.getSheetByName("Clientes");

  const datos =
    interesados.getDataRange().getValues();

  const resumen = {};

  for (let i = 1; i < datos.length; i++) {

    const nombre =
      String(datos[i][2] || "").trim();

    const email =
      String(datos[i][3] || "").trim();

    const telefono =
      String(datos[i][4] || "").trim();

    const fechaIngreso =
      datos[i][1];

    let estadoCRM = "Nuevo";

    const estadoLead =
      String(datos[i][7] || "");

    if (
      estadoLead === "Contactado" ||
      estadoLead === "Interesado" ||
      estadoLead === "Visita Programada" ||
      estadoLead === "Visita Realizada" ||
      estadoLead === "Oferta" ||
      estadoLead === "Reservado"
    ) {

      estadoCRM = "Activo";

    }
    else if (
      estadoLead === "Concretado"
    ) {

      estadoCRM = "Compró";

    }
    else if (
      estadoLead === "Descartado"
    ) {

      estadoCRM = "Descartado";

    }

    const observaciones =
      datos[i][20];

    const idPropiedad =
      String(datos[i][9] || "");

    if (nombre === "") {
      continue;
    }

    let clave = "";

    if (telefono !== "") {

      clave = telefono;

    }
    else if (email !== "") {

      clave = email;

    }
    else {

      clave =
        "SINCONTACTO_" + i;

    }

    if (!resumen[clave]) {

      resumen[clave] = {

        nombre: nombre,
        email: email,
        telefono: telefono,

        consultas: 0,

        propiedades:
          new Set(),

        ultimaConsulta:
          fechaIngreso,

        estadoCRM:
          estadoCRM,

        observaciones:
          observaciones

      };

    }

    resumen[clave].consultas++;

    resumen[clave]
      .propiedades
      .add(idPropiedad);

    if (
      fechaIngreso >
      resumen[clave]
        .ultimaConsulta
    ) {

      resumen[clave]
        .ultimaConsulta =
        fechaIngreso;

    }

  }

  const resultado = [];

  resultado.push([

    "ID Cliente",
    "Nombre",
    "Email",
    "Teléfono",

    "Cantidad Consultas",

    "Cantidad Propiedades Consultadas",

    "Última Consulta",

    "Estado CRM",

    "Observaciones",

    "Nivel Cliente",

    "Último Seguimiento"

  ]);

  let contador = 1;

  for (const clave in resumen) {

    const cliente =
      resumen[clave];

    let nivel = "Cliente Frío";

    if (cliente.consultas >= 5) {

      nivel = "Cliente Caliente";

    }
    else if (cliente.consultas >= 2) {

      nivel = "Activo";
    }

    resultado.push([

      "CLI-" +
      contador
        .toString()
        .padStart(5, "0"),

      cliente.nombre,

      cliente.email,

      cliente.telefono,

      cliente.consultas,

      cliente.propiedades.size,

      cliente.ultimaConsulta,

      cliente.estadoCRM,

      cliente.observaciones,

      nivel,

      ""

    ]);

    contador++;

  }

  if (clientes.getLastRow() > 0) {

    clientes.getRange(
      1,
      1,
      clientes.getLastRow(),
      clientes.getLastColumn()
    ).clearContent();

  }

  clientes.getRange(
  1,
  1,
  resultado.length,
  resultado[0].length
).setValues(resultado);

}
function onEdit(e) {

  const hoja = e.source.getActiveSheet();

  if (
    hoja.getName() !== "Interesados" &&
    hoja.getName() !== "Seguimientos" &&
    hoja.getName() !== "Demandas"
  ) {
    return;
  }

  const fila = e.range.getRow();

  if (fila === 1) {
    return;
  }

  const idCell =
    hoja.getRange(fila, 1);

  const fechaCell =
    hoja.getRange(fila, 2);

  const nombre =
    hoja.getRange(fila, 3).getValue();

  if (
    nombre !== "" &&
    idCell.getValue() === ""
  ) {

    idCell.setValue(
      generarIdLead()
    );

    fechaCell.setValue(
      new Date()
    );

    SpreadsheetApp.flush();

    actualizarClientes();

  }

  
  const columnaEditada =
  e.range.getColumn();

  if (
    hoja.getName() === "Interesados" &&
    columnaEditada === 10
  ) {

    const idPropiedad =
      hoja.getRange(fila, 10).getValue();

    if (idPropiedad !== "") {

      const propiedades =
        e.source.getSheetByName(
          "Propiedades"
        );

      const datos =
        propiedades
          .getDataRange()
          .getValues();

      for (
        let i = 1;
        i < datos.length;
        i++
      ) {

        if (
          String(datos[i][0]) ===
          String(idPropiedad)
        ) {

          hoja.getRange(fila, 9)
            .setValue(datos[i][1]);

          hoja.getRange(fila, 11)
            .setValue(datos[i][5]);

          hoja.getRange(fila, 13)
            .setValue(
              String(
                datos[i][11]
              ).trim()
            );

          hoja.getRange(fila, 14)
            .setValue(datos[i][27]);

          hoja.getRange(fila, 15)
            .setValue(datos[i][12]);

          hoja.getRange(fila, 16)
            .setValue(datos[i][13]);

          hoja.getRange(fila, 23)
            .setValue(datos[i][2]);

          if (
            hoja.getRange(fila, 8)
              .getValue() === ""
          ) {

            hoja.getRange(fila, 8)
              .setValue("Nuevo");
          }

          actualizarCantidadInteresados();

          break;

        }

      }

    }

  }

  if (hoja.getName() === "Demandas") {

    const idDemanda =
      hoja.getRange(fila, 1);

    const fechaDemanda =
      hoja.getRange(fila, 2);

    if (
      hoja.getRange(fila, 3).getValue() !== "" &&
      idDemanda.getValue() === ""
    ) {

      idDemanda.setValue(
        "DEM-" +
        new Date().getTime()
      );

      fechaDemanda.setValue(
        new Date()
      );

    }

    const columnaEditada =
      e.range.getColumn();

    if (columnaEditada === 3) {

      const idLead =
        hoja.getRange(fila, 3).getValue();

      const interesados =
        e.source.getSheetByName(
          "Interesados"
        );

      const datos =
        interesados
          .getDataRange()
          .getValues();

      for (
        let i = 1;
        i < datos.length;
        i++
      ) {

        if (
          String(datos[i][0]) ===
          String(idLead)
        ) {

          hoja
            .getRange(fila, 4)
            .setValue(datos[i][2]);

          if (
            hoja
              .getRange(fila, 15)
              .getValue() === ""
          ) {

            hoja
              .getRange(fila, 15)
              .setValue("Activa");

          }

          break;

        }

      }

    }

    if (
      columnaEditada >= 3 &&
      columnaEditada <= 15
    ) {

      buscarCoincidencias();

    }

  }


  if (hoja.getName() === "Seguimientos") {

  const columnaEditada =
    e.range.getColumn();

  const fila =
    e.range.getRow();

  if (fila === 1) {
    return;
  }

  const idSeguimiento =
    hoja.getRange(fila, 1);

  const fecha =
    hoja.getRange(fila, 2);

  if (
    idSeguimiento.getValue() === ""
  ) {

    idSeguimiento.setValue(
      generarIdSeguimiento()
    );

    fecha.setValue(
      new Date()
    );

  }

  if (columnaEditada === 3) {

      const idLead =
        hoja.getRange(fila, 3).getValue();

      const interesados =
        e.source
          .getSheetByName("Interesados");

      const datos =
        interesados
          .getDataRange()
          .getValues();

      for (let i = 1; i < datos.length; i++) {

        if (
          String(datos[i][0]) ===
          String(idLead)
        ) {

          hoja.getRange(fila, 4)
            .setValue(datos[i][2]);

          hoja.getRange(fila, 5)
            .setValue(datos[i][9]);

          hoja.getRange(fila, 6)
            .setValue(datos[i][8]);

          break;

        }

      }

    }

  }

  const tipoAccion =
  hoja.getRange(fila, 7).getValue();

  const resultado =
  hoja.getRange(fila, 8).getValue();

  const idLead =
    hoja.getRange(fila, 3).getValue();

  if (
    tipoAccion !== "" &&
    idLead !== ""
  ) {

    const interesados =
      e.source.getSheetByName(
        "Interesados"
      );

    const hojaOfertas =
      e.source.getSheetByName(
        "Ofertas"
      );

    const datosLeads =
      interesados
        .getDataRange()
        .getValues();

    let nuevoEstado = "";

    if (
      resultado === "Interesado"
    ) {

      nuevoEstado = "Interesado";

    }
    else if (
      resultado === "Visita Programada"
    ) {

      nuevoEstado =
        "Visita Programada";

    }
    else if (
      resultado === "Oferta Recibida"
    ) {

      nuevoEstado =
        "Oferta";

    }
    else if (
      resultado === "Reservado"
    ) {

      nuevoEstado =
        "Reservado";

    }
    else if (
      resultado === "Concretado"
    ) {

      nuevoEstado =
        "Concretado";

    }
    else if (
      resultado === "Descartado"
    ) {

      nuevoEstado =
        "Descartado";

    }
    else if (
      resultado === "Respondió"
    ) {

      nuevoEstado =
        "Contactado";

    }

    if (
      resultado === "Oferta Recibida" &&
      hoja.getRange(fila, 13).getValue() !== ""
    ) {

      const idPropiedad =
        hoja.getRange(fila, 5).getValue();

      const propiedad =
        hoja.getRange(fila, 6).getValue();

      const nombreLead =
        hoja.getRange(fila, 4).getValue();

      const observaciones =
        hoja.getRange(fila, 12).getValue();

      const valorOferta =
        hoja.getRange(fila, 13).getValue();

      hojaOfertas.appendRow([

        "OFE-" + new Date().getTime(), // ID Oferta
        new Date(),                   // Fecha
        idPropiedad,                  // ID Propiedad
        propiedad,                    // Propiedad
        idLead,                       // ID Lead
        nombreLead,                   // Nombre
        valorOferta,                  // Valor Oferta
        "Activa",                     // Estado
        "",                           // Contraoferta
        "",                           // Fecha Respuesta
        "",                           // Resultado Final
        observaciones                 // Observaciones

      ]);

    }

    
    if (nuevoEstado !== "") {

      for (
        let i = 1;
        i < datosLeads.length;
        i++
      ) {

        if (
          String(datosLeads[i][0]) ===
          String(idLead)
        ) {

          interesados
            .getRange(i + 1, 8)
            .setValue(nuevoEstado);

          interesados
            .getRange(i + 1, 18)
            .setValue(
              Utilities.formatDate(
                new Date(),
                Session.getScriptTimeZone(),
                "dd/MM/yyyy"
              )
            );

          if (
            resultado ===
            "Oferta Recibida"
          ) {

            interesados
              .getRange(i + 1, 26)
              .setValue("SI");

            interesados
              .getRange(i + 1, 28)
              .setValue(
                Utilities.formatDate(
                  new Date(),
                  Session.getScriptTimeZone(),
                  "dd/MM/yyyy"
                )
              );

          }

          break;

        }

      }

    }

  }

}

function generarIdSeguimiento() {

  return "SEG-" +
    Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyyMMddHHmmss"
    );

}

function actualizarUltimosSeguimientos() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const clientes =
    ss.getSheetByName("Clientes");

  const interesados =
    ss.getSheetByName("Interesados");

  const seguimientos =
    ss.getSheetByName("Seguimientos");

  const datosClientes =
    clientes.getDataRange().getValues();

  const datosInteresados =
    interesados.getDataRange().getValues();

  const datosSeguimientos =
    seguimientos.getDataRange().getValues();

  for (let i = 1; i < datosClientes.length; i++) {

    const telefonoCliente =
      String(datosClientes[i][3] || "").trim();

    let ultimaFecha = "";

    for (let x = 1; x < datosInteresados.length; x++) {

      const telefonoLead =
        String(datosInteresados[x][4] || "").trim();

      if (
        telefonoLead === telefonoCliente
      ) {

        const idLead =
          String(datosInteresados[x][0]);

        for (let j = 1; j < datosSeguimientos.length; j++) {

          const idLeadSeguimiento =
            String(datosSeguimientos[j][2]);

          if (
            idLeadSeguimiento === idLead
          ) {

            const fechaSeguimiento =
              datosSeguimientos[j][1];

            if (
              ultimaFecha === "" ||
              fechaSeguimiento > ultimaFecha
            ) {

              ultimaFecha =
                fechaSeguimiento;

            }

          }

        }

      }

    }

    clientes
      .getRange(i + 1, 11)
      .setValue(ultimaFecha);

    let diasSinContacto = "";

    let accion = "";

    if (ultimaFecha !== "") {

      diasSinContacto = Math.floor(

        (
          new Date() -
          new Date(ultimaFecha)
        ) / (1000 * 60 * 60 * 24)

      );

      if (diasSinContacto > 15) {

        accion = "Prioridad Alta";

      }
      else if (diasSinContacto > 7) {

        accion = "Contactar";

      }
      else {

        accion = "Al día";

      }

    }

    clientes
      .getRange(i + 1, 12)
      .setValue(diasSinContacto);

    clientes
      .getRange(i + 1, 13)
      .setValue(accion);

  }

}

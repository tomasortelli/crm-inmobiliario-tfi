function actualizarHistorico() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const propiedades =
    ss.getSheetByName("Propiedades");

  const historico =
    ss.getSheetByName("Historico Propiedades");

  const datosPropiedades =
    propiedades.getDataRange().getValues();

  const datosHistorico =
    historico.getDataRange().getValues();

  const idsHistorico = new Set();

  for (let i = 1; i < datosHistorico.length; i++) {

    idsHistorico.add(
      String(datosHistorico[i][0])
    );

  }

  for (let i = 1; i < datosPropiedades.length; i++) {

    const fila = datosPropiedades[i];

    const estado =
      String(fila[32] || "");

    const id =
      String(fila[0] || "");

    if (
      estado === "Eliminado" &&
      !idsHistorico.has(id)
    ) {

      historico.appendRow([

        fila[0],   // ID
        fila[1],   // Título
        fila[26],  // Dirección
        fila[27],  // Ciudad

        new Date(),

        "Eliminada",

        fila[14],  // Precio Mostrar

        fila[5]    // Operación

      ]);

    }

  }

}

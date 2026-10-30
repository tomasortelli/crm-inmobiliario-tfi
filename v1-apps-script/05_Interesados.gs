function actualizarCantidadInteresados() {

  const hoja =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName("Interesados");

  const datos =
    hoja.getDataRange().getValues();

  const contador = {};

  for (let i = 1; i < datos.length; i++) {

    const idPropiedad =
      String(datos[i][9] || "");

    if (idPropiedad !== "") {

      contador[idPropiedad] =
        (contador[idPropiedad] || 0) + 1;

    }

  }

  for (let i = 1; i < datos.length; i++) {

    const idPropiedad =
      String(datos[i][9] || "");

    if (idPropiedad !== "") {

      hoja.getRange(i + 1, 25)
        .setValue(contador[idPropiedad]);

    }

  }

}
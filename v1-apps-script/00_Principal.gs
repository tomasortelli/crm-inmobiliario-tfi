function actualizarCRM() {

  importarCSV();

  sincronizarPropiedades();

  actualizarHistorico();

  actualizarCantidadInteresados();

  importarLeadsZonaprop();

  actualizarClientes();

  actualizarUltimosSeguimientos();

  buscarCoincidencias();

}

function onOpen() {

  SpreadsheetApp.getUi()
    .createMenu("CRM Inmobiliaria")
    .addItem(
      "Actualizar propiedades",
      "actualizarCRM"
    )
    .addToUi();

}
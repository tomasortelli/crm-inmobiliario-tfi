function buscarCoincidencias() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const hojaDemandas =
    ss.getSheetByName(
      "Demandas"
    );

  const hojaPropiedades =
    ss.getSheetByName(
      "Propiedades"
    );

  const hojaCoincidencias =
    ss.getSheetByName(
      "Coincidencias"
    );

  const demandas =
    hojaDemandas
      .getDataRange()
      .getValues();

  const propiedades =
    hojaPropiedades
      .getDataRange()
      .getValues();

  const resultado = [];

  resultado.push([

    "ID Coincidencia",

    "Fecha",

    "ID Propiedad",

    "Propiedad",

    "Link",

    "ID Demanda",

    "ID Lead",

    "Nombre",

    "Puntaje",

    "Estado",

    "Motivo"

  ]);

  for (

    let i = 1;

    i < demandas.length;

    i++

  ) {

    const demanda =

      crearObjetoDemanda(

        demandas[i]

      );

    if (

      demanda.estado !==

      "Activa"

    ) {

      continue;

    }

    for (

      let j = 1;

      j < propiedades.length;

      j++

    ) {

      const propiedad =

        crearObjetoPropiedad(

          propiedades[j]

        );

          if (

        propiedad.publicado !==

        "Publicado"

      ) {

        continue;

      }

      const comparacion =

        comparar(

          demanda,

          propiedad

        );

      if (

        !comparacion.valido

      ) {

        continue;

      }

      // Puntaje mínimo para considerar una coincidencia

      if (

        comparacion.puntaje < 50

      ) {

        continue;

      }

      resultado.push([

        "COI-" +

        Utilities.getUuid(),

        new Date(),

        propiedad.id,

        propiedad.titulo,

        propiedad.link,

        demanda.id,

        demanda.idLead,

        demanda.nombre,

        comparacion.puntaje,

        "Nueva",

        comparacion.resumen

      ]);

    }

  }

  hojaCoincidencias.clearContents();

  hojaCoincidencias.getRange(

    1,

    1,

    resultado.length,

    resultado[0].length

  ).setValues(resultado);

}

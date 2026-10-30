// ============================================================
// 08_PropiedadesSimilares.gs
// MOTOR DE PROPIEDADES SIMILARES
// VERSIÓN LIMPIA Y UNIFICADA
// ============================================================


// ============================================================
// CONFIGURACIÓN
// ============================================================

const CONFIG_PROPIEDADES_SIMILARES = {

  // Máximo de propiedades similares por propiedad origen
  cantidadMaxima: 10,

  // Diferencia máxima de precio permitida
  diferenciaPrecioMaxima: 35,

  // Diferencia máxima de superficie permitida
  diferenciaSuperficieMaxima: 40,

  // Puntaje mínimo normalizado
  puntajeMinimo: 75,

  // Puntajes máximos
  puntajePrecioMaximo: 35,
  puntajeTipoMaximo: 20,
  puntajeDormitoriosMaximo: 15,
  puntajeSuperficieCubiertaMaximo: 10,
  puntajeSuperficieTerrenoMaximo: 5,
  puntajeComodidadesMaximo: 15

};


// ============================================================
// NORMALIZACIÓN DE TEXTO
// ============================================================

function normalizarTextoSimilar(valor) {

  return String(valor || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

}


// ============================================================
// NORMALIZACIÓN DE MONEDA
// ============================================================

function normalizarMonedaSimilar(moneda) {

  const texto =
    normalizarTextoSimilar(moneda);

  if (
    texto === "usd" ||
    texto === "u$s" ||
    texto === "us$" ||
    texto === "dolares" ||
    texto === "dólares" ||
    texto === "dolar" ||
    texto === "dólar" ||
    texto.includes("usd")
  ) {

    return "usd";

  }


  if (
    texto === "ars" ||
    texto === "$" ||
    texto === "pesos" ||
    texto === "peso" ||
    texto.includes("ars")
  ) {

    return "ars";

  }


  return "";

}


// ============================================================
// TIPOS DE PROPIEDAD
// ============================================================

function obtenerTiposPropiedadSimilar(tipo) {

  return String(tipo || "")
    .toLowerCase()
    .split(",")
    .map(
      t =>
        t
          .trim()
          .replace(/\s+/g, " ")
    )
    .filter(Boolean);

}


function tiposPropiedadSimilares(
  tipoA,
  tipoB
) {

  const tiposA =
    obtenerTiposPropiedadSimilar(
      tipoA
    );

  const tiposB =
    obtenerTiposPropiedadSimilar(
      tipoB
    );


  if (
    tiposA.length === 0 ||
    tiposB.length === 0
  ) {

    return false;

  }


  return tiposA.some(
    tipo =>
      tiposB.includes(tipo)
  );

}


// ============================================================
// SUPERFICIE CUBIERTA
// ============================================================
// La columna S admite solamente números enteros.
// No se extrae información de texto.
// ============================================================

function normalizarSuperficieCubiertaSimilar(valor) {

  const numero =
    Number(valor);


  if (
    !Number.isFinite(numero) ||
    numero <= 0
  ) {

    return null;

  }


  return Math.round(numero);

}


// ============================================================
// SUPERFICIE TERRENO
// ============================================================
// La columna T puede contener:
//
// 154,3 m2 (10 x 15 mts aprox)
//
// Se toma únicamente el primer número.
//
// Ejemplos:
//
// 154,3 -> 154
// 154,8 -> 155
// 154,5 -> 155
// 154   -> 154
//
// También soporta:
//
// 1.250,5 -> 1251
// 1250.5 -> 1251
// ============================================================

function normalizarSuperficieTerrenoSimilar(valor) {

  const texto =
    String(valor || "")
      .trim();


  if (
    texto === ""
  ) {

    return null;

  }


  const coincidencia =
    texto.match(
      /^\s*([\d.,]+)/
    );


  if (
    !coincidencia
  ) {

    return null;

  }


  let numeroTexto =
    coincidencia[1]
      .trim();


  // ----------------------------------------------------------
  // FORMATO ARGENTINO CON COMA DECIMAL
  // ----------------------------------------------------------

  if (
    numeroTexto.includes(",")
  ) {

    numeroTexto =
      numeroTexto
        .replace(/\./g, "")
        .replace(",", ".");

  }


  // ----------------------------------------------------------
  // FORMATO CON PUNTO DECIMAL
  // ----------------------------------------------------------

  else {

    numeroTexto =
      numeroTexto
        .replace(/,/g, "");

  }


  const numero =
    Number(
      numeroTexto
    );


  if (
    !Number.isFinite(numero) ||
    numero <= 0
  ) {

    return null;

  }


  return Math.round(numero);

}



// ============================================================
// COMPARACIÓN DE DORMITORIOS
// ============================================================

function compararDormitoriosSimilar(
  propiedadBase,
  propiedadCandidata
) {

  const base =
    Number(
      propiedadBase.dormitorios || 0
    );

  const candidata =
    Number(
      propiedadCandidata.dormitorios || 0
    );


  const tiposHabitables = [

    "casa",
    "departamento",
    "casaquinta",
    "quinta",
    "duplex",
    "dúplex"

  ];


  const tipoBase =
    obtenerTiposPropiedadSimilar(
      propiedadBase.tipo
    );

  const tipoCandidata =
    obtenerTiposPropiedadSimilar(
      propiedadCandidata.tipo
    );


  const tieneDormitorios =
    tipoBase.some(
      tipo =>
        tiposHabitables.includes(tipo)
    ) ||
    tipoCandidata.some(
      tipo =>
        tiposHabitables.includes(tipo)
    );


  if (
    !tieneDormitorios
  ) {

    return {

      aplica: false,

      puntaje: 0,

      maximo: 0,

      motivo:
        "Dormitorios: no aplica"

    };

  }


  const diferencia =
    Math.abs(
      base -
      candidata
    );


  if (
    diferencia === 0
  ) {

    return {

      aplica: true,

      puntaje:
        CONFIG_PROPIEDADES_SIMILARES
          .puntajeDormitoriosMaximo,

      maximo:
        CONFIG_PROPIEDADES_SIMILARES
          .puntajeDormitoriosMaximo,

      motivo:
        "Dormitorios iguales"

    };

  }


  if (
    diferencia === 1
  ) {

    return {

      aplica: true,

      puntaje:
        Math.round(
          CONFIG_PROPIEDADES_SIMILARES
            .puntajeDormitoriosMaximo *
          0.60
        ),

      maximo:
        CONFIG_PROPIEDADES_SIMILARES
          .puntajeDormitoriosMaximo,

      motivo:
        "Dormitorios similares"

    };

  }


  if (
    diferencia === 2
  ) {

    return {

      aplica: true,

      puntaje:
        Math.round(
          CONFIG_PROPIEDADES_SIMILARES
            .puntajeDormitoriosMaximo *
          0.25
        ),

      maximo:
        CONFIG_PROPIEDADES_SIMILARES
          .puntajeDormitoriosMaximo,

      motivo:
        "Dormitorios algo diferentes"

    };

  }


  return {

    aplica: true,

    puntaje: 0,

    maximo:
      CONFIG_PROPIEDADES_SIMILARES
        .puntajeDormitoriosMaximo,

    motivo:
      "Dormitorios diferentes"

  };

}


// ============================================================
// COMPARACIÓN DE SUPERFICIE
// ============================================================

function compararSuperficieSimilar(
  superficieBase,
  superficieCandidata,
  puntajeMaximo,
  nombre
) {

  if (
    superficieBase === null ||
    superficieCandidata === null ||
    superficieBase <= 0 ||
    superficieCandidata <= 0
  ) {

    return {

      aplica: false,

      puntaje: 0,

      maximo: 0,

      diferencia: null,

      motivo:
        nombre +
        ": sin comparar"

    };

  }


  const diferencia =
    Math.abs(
      superficieCandidata -
      superficieBase
    );


  const porcentaje =
    (
      diferencia /
      superficieBase
    ) * 100;


  let similitud =
    1 -
    (
      porcentaje /
      CONFIG_PROPIEDADES_SIMILARES
        .diferenciaSuperficieMaxima
    );


  if (
    similitud < 0
  ) {

    similitud = 0;

  }


  const puntaje =
    Math.round(
      similitud *
      puntajeMaximo
    );


  let motivo;


  if (
    porcentaje === 0
  ) {

    motivo =
      nombre +
      ": iguales";

  } else {

    motivo =
      nombre +
      ": " +
      (
        superficieCandidata >
        superficieBase
          ? "+"
          : "-"
      ) +
      porcentaje.toFixed(1) +
      "%";

  }


  return {

    aplica: true,

    puntaje,

    maximo:
      puntajeMaximo,

    diferencia:
      porcentaje,

    motivo

  };

}


// ============================================================
// COMPARACIÓN DE COMODIDADES
// ============================================================

function compararComodidadesSimilar(
  propiedadBase,
  propiedadCandidata
) {

  const comodidades = [

    "patio",
    "garage",
    "pileta"

  ];


  let baseTotal = 0;

  let coincidencias = 0;


  for (
    const comodidad
    of comodidades
  ) {

    const tieneBase =
      propiedadBase[
        comodidad
      ] === true;

    const tieneCandidata =
      propiedadCandidata[
        comodidad
      ] === true;


    if (
      tieneBase
    ) {

      baseTotal++;


      if (
        tieneCandidata
      ) {

        coincidencias++;

      }

    }

  }


  if (
    baseTotal === 0
  ) {

    return {

      aplica: false,

      puntaje: 0,

      maximo: 0,

      motivo:
        "Comodidades: sin comparar"

    };

  }


  const porcentaje =
    coincidencias /
    baseTotal;


  const puntaje =
    Math.round(
      porcentaje *
      CONFIG_PROPIEDADES_SIMILARES
        .puntajeComodidadesMaximo
    );


  const nombres = [];


  for (
    const comodidad
    of comodidades
  ) {

    if (
      propiedadBase[comodidad] === true &&
      propiedadCandidata[comodidad] === true
    ) {

      nombres.push(
        comodidad
      );

    }

  }


  if (
    coincidencias === 0
  ) {

    return {

      aplica: true,

      puntaje: 0,

      maximo:
        CONFIG_PROPIEDADES_SIMILARES
          .puntajeComodidadesMaximo,

      motivo:
        "Comodidades: sin coincidencias"

    };

  }


  return {

    aplica: true,

    puntaje,

    maximo:
      CONFIG_PROPIEDADES_SIMILARES
        .puntajeComodidadesMaximo,

    motivo:
      "Comodidades: " +
      nombres.join(", ")

  };

}


// ============================================================
// CREAR OBJETO DESDE FILA
// ============================================================

function crearObjetoPropiedadSimilar(
  fila
) {

  const comodidades =
    String(
      fila[22] || ""
    ).toLowerCase();


  return {

    id:
      String(
        fila[0] || ""
      ).trim(),

    titulo:
      String(
        fila[1] || ""
      ).trim(),

    link:
      String(
        fila[2] || ""
      ).trim(),

    operacion:
      String(
        fila[5] || ""
      ).trim(),

    tipo:
      String(
        fila[11] || ""
      ).trim(),

    precio:
      Number(
        fila[12] || 0
      ),

    moneda:
      normalizarMonedaSimilar(
        fila[13]
      ),

    dormitorios:
      Number(
        fila[15] || 0
      ),

    superficieCubierta:
      normalizarSuperficieCubiertaSimilar(
        fila[18]
      ),

    superficieTerreno:
      normalizarSuperficieTerrenoSimilar(
        fila[19]
      ),

    ciudad:
      String(
        fila[27] || ""
      ).trim(),

    publicado:
      String(
        fila[32] || ""
      ).trim(),

    patio:
      comodidades.includes(
        "patio"
      ),

    garage:
      comodidades.includes(
        "garage"
      ),

    pileta:
      comodidades.includes(
        "pileta"
      )

  };

}


// ============================================================
// OBTENER PROPIEDADES PARA SIMILARES
// ============================================================

function obtenerPropiedadesParaSimilares() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();


  const hoja =
    ss.getSheetByName(
      "Propiedades"
    );


  if (
    !hoja
  ) {

    throw new Error(
      'No existe la hoja "Propiedades".'
    );

  }


  const datos =
    hoja
      .getDataRange()
      .getValues();


  const propiedades = [];


  for (
    let i = 1;
    i < datos.length;
    i++
  ) {

    const propiedad =
      crearObjetoPropiedadSimilar(
        datos[i]
      );


    if (
      propiedad.id
    ) {

      propiedades.push(
        propiedad
      );

    }

  }


  Logger.log(
    "Propiedades cargadas para similares: " +
    propiedades.length
  );


  return propiedades;

}


// ============================================================
// COMPARACIÓN GENERAL
// ============================================================

function compararPropiedadSimilar(
  propiedadBase,
  propiedadCandidata
) {

  // ----------------------------------------------------------
  // MISMA PROPIEDAD
  // ----------------------------------------------------------

  if (
    String(
      propiedadBase.id
    ) ===
    String(
      propiedadCandidata.id
    )
  ) {

    return {

      valido: false

    };

  }


  // ----------------------------------------------------------
  // PUBLICADA
  // ----------------------------------------------------------

  if (
    normalizarTextoSimilar(
      propiedadCandidata.publicado
    ) !==
    "publicado"
  ) {

    return {

      valido: false

    };

  }


  // ----------------------------------------------------------
  // OPERACIÓN
  // ----------------------------------------------------------

  const operacionesBase =
    String(
      propiedadBase.operacion || ""
    )
      .split(",")
      .map(
        operacion =>
          normalizarTextoSimilar(
            operacion
          )
      )
      .filter(Boolean);


  const operacionesCandidata =
    String(
      propiedadCandidata.operacion || ""
    )
      .split(",")
      .map(
        operacion =>
          normalizarTextoSimilar(
            operacion
          )
      )
      .filter(Boolean);


  const operacionesCompatibles =
    operacionesBase.some(
      operacion =>
        operacionesCandidata.includes(
          operacion
        )
    );


  if (
    !operacionesCompatibles
  ) {

    return {

      valido: false

    };

  }


  // ----------------------------------------------------------
  // CIUDAD
  // ----------------------------------------------------------

  if (
    normalizarTextoSimilar(
      propiedadBase.ciudad
    ) !==
    normalizarTextoSimilar(
      propiedadCandidata.ciudad
    )
  ) {

    return {

      valido: false

    };

  }


  // ----------------------------------------------------------
  // TIPO
  // ----------------------------------------------------------

  if (
    !tiposPropiedadSimilares(
      propiedadBase.tipo,
      propiedadCandidata.tipo
    )
  ) {

    return {

      valido: false

    };

  }


  // ----------------------------------------------------------
  // PRECIO Y MONEDA
  // ----------------------------------------------------------

  const precio =
    compararPrecioSimilar(
      propiedadBase,
      propiedadCandidata
    );


  if (
    !precio.valido
  ) {

    return {

      valido: false,

      puntaje:
        0,

      resumen:
        precio.motivo || ""

    };

  }


  // ----------------------------------------------------------
  // DORMITORIOS
  // ----------------------------------------------------------

  const dormitorios =
    compararDormitoriosSimilar(
      propiedadBase,
      propiedadCandidata
    );


  // ----------------------------------------------------------
  // SUPERFICIE CUBIERTA
  // ----------------------------------------------------------

  const superficieCubierta =
    compararSuperficieSimilar(

      propiedadBase
        .superficieCubierta,

      propiedadCandidata
        .superficieCubierta,

      CONFIG_PROPIEDADES_SIMILARES
        .puntajeSuperficieCubiertaMaximo,

      "Sup. cubierta"

    );


  // ----------------------------------------------------------
  // SUPERFICIE TERRENO
  // ----------------------------------------------------------

  const superficieTerreno =
    compararSuperficieSimilar(

      propiedadBase
        .superficieTerreno,

      propiedadCandidata
        .superficieTerreno,

      CONFIG_PROPIEDADES_SIMILARES
        .puntajeSuperficieTerrenoMaximo,

      "Sup. terreno"

    );


  // ----------------------------------------------------------
  // COMODIDADES
  // ----------------------------------------------------------

  const comodidades =
    compararComodidadesSimilar(
      propiedadBase,
      propiedadCandidata
    );


  // ----------------------------------------------------------
  // PUNTAJE
  // ----------------------------------------------------------

  let puntajeObtenido = 0;

  let puntajeMaximoDisponible = 0;


  // Precio
  puntajeObtenido +=
    precio.puntaje;

  puntajeMaximoDisponible +=
    CONFIG_PROPIEDADES_SIMILARES
      .puntajePrecioMaximo;


  // Tipo
  puntajeObtenido +=
    CONFIG_PROPIEDADES_SIMILARES
      .puntajeTipoMaximo;

  puntajeMaximoDisponible +=
    CONFIG_PROPIEDADES_SIMILARES
      .puntajeTipoMaximo;


  // Dormitorios
  if (
    dormitorios.aplica
  ) {

    puntajeObtenido +=
      dormitorios.puntaje;

    puntajeMaximoDisponible +=
      dormitorios.maximo;

  }


  // Superficie cubierta
  if (
    superficieCubierta.aplica
  ) {

    puntajeObtenido +=
      superficieCubierta.puntaje;

    puntajeMaximoDisponible +=
      superficieCubierta.maximo;

  }


  // Superficie terreno
  if (
    superficieTerreno.aplica
  ) {

    puntajeObtenido +=
      superficieTerreno.puntaje;

    puntajeMaximoDisponible +=
      superficieTerreno.maximo;

  }


  // Comodidades
  if (
    comodidades.aplica
  ) {

    puntajeObtenido +=
      comodidades.puntaje;

    puntajeMaximoDisponible +=
      comodidades.maximo;

  }


  // ----------------------------------------------------------
  // NORMALIZAR A 100
  // ----------------------------------------------------------

  let puntajeNormalizado = 0;


  if (
    puntajeMaximoDisponible > 0
  ) {

    puntajeNormalizado =
      Math.round(
        (
          puntajeObtenido /
          puntajeMaximoDisponible
        ) * 100
      );

  }


  // ----------------------------------------------------------
  // PUNTAJE MÍNIMO
  // ----------------------------------------------------------

  if (
    puntajeNormalizado <
    CONFIG_PROPIEDADES_SIMILARES
      .puntajeMinimo
  ) {

    return {

      valido: false,

      puntaje:
        puntajeNormalizado,

      puntajeObtenido,

      puntajeMaximoDisponible,

      motivos: [],

      resumen:
        "Puntaje insuficiente"

    };

  }


  // ----------------------------------------------------------
  // MOTIVOS
  // ----------------------------------------------------------

  const motivos = [

    precio.motivo,

    "Tipo compatible",

    dormitorios.motivo,

    superficieCubierta.motivo,

    superficieTerreno.motivo,

    comodidades.motivo

  ];


  return {

    valido: true,

    puntaje:
      puntajeNormalizado,

    puntajeObtenido,

    puntajeMaximoDisponible,

    motivos,

    resumen:
      motivos.join(
        " | "
      )

  };

}


// ============================================================
// GENERAR PROPIEDADES SIMILARES
// ============================================================

function generarPropiedadesSimilares() {

  const propiedades =
    obtenerPropiedadesParaSimilares();


  if (
    propiedades.length === 0
  ) {

    throw new Error(
      "No se encontraron propiedades para comparar."
    );

  }


  const ss =
    SpreadsheetApp.getActiveSpreadsheet();


  let hojaSalida =
    ss.getSheetByName(
      "Propiedades Similares"
    );


  if (
    !hojaSalida
  ) {

    hojaSalida =
      ss.insertSheet(
        "Propiedades Similares"
      );

  }


  // ----------------------------------------------------------
  // LIMPIAR RESULTADOS
  // ----------------------------------------------------------

  hojaSalida.clearContents();


  // ----------------------------------------------------------
  // ENCABEZADOS
  // ----------------------------------------------------------

  hojaSalida
    .getRange(
      1,
      1,
      1,
      7
    )
    .setValues([

      [

        "ID Similaridad",
        "ID Propiedad Origen",
        "Propiedad Origen",
        "ID Propiedad Similar",
        "Propiedad Similar",
        "Puntaje",
        "Motivo"

      ]

    ]);


  const filasSalida = [];


  // ----------------------------------------------------------
  // COMPARAR
  // ----------------------------------------------------------

  for (
    const propiedadBase
    of propiedades
  ) {

    // --------------------------------------------------------
    // SOLAMENTE LAS PROPIEDADES PUBLICADAS PUEDEN SER BASE
    // --------------------------------------------------------

    if (
      normalizarTextoSimilar(
        propiedadBase.publicado
      ) !==
      "publicado"
    ) {

      continue;

    }


    const candidatos = [];


    for (
      const propiedadCandidata
      of propiedades
    ) {

      const resultado =
        compararPropiedadSimilar(
          propiedadBase,
          propiedadCandidata
        );


      if (
        !resultado ||
        resultado.valido !== true
      ) {

        continue;

      }


      candidatos.push({

        propiedad:
          propiedadCandidata,

        puntaje:
          resultado.puntaje,

        motivo:
          resultado.resumen

      });

    }


    // --------------------------------------------------------
    // ORDENAR
    // --------------------------------------------------------

    candidatos.sort(
      (a, b) => {

        if (
          b.puntaje !==
          a.puntaje
        ) {

          return (
            b.puntaje -
            a.puntaje
          );

        }


        // Desempate por diferencia
        // absoluta de precio.

        const precioA =
          Math.abs(
            Number(
              a.propiedad.precio || 0
            ) -
            Number(
              propiedadBase.precio || 0
            )
          );


        const precioB =
          Math.abs(
            Number(
              b.propiedad.precio || 0
            ) -
            Number(
              propiedadBase.precio || 0
            )
          );


        return (
          precioA -
          precioB
        );

      }
    );


    // --------------------------------------------------------
    // TOMAR LAS 10 MEJORES
    // --------------------------------------------------------

    const seleccionados =
      candidatos.slice(
        0,
        CONFIG_PROPIEDADES_SIMILARES
          .cantidadMaxima
      );


    // --------------------------------------------------------
    // CREAR FILAS
    // --------------------------------------------------------

    for (
      const candidato
      of seleccionados
    ) {

      filasSalida.push([

        Utilities.getUuid(),

        propiedadBase.id,

        propiedadBase.titulo,

        candidato.propiedad.id,

        candidato.propiedad.titulo,

        candidato.puntaje,

        candidato.motivo

      ]);

    }

  }


  // ----------------------------------------------------------
  // ESCRIBIR RESULTADOS
  // ----------------------------------------------------------

  if (
    filasSalida.length > 0
  ) {

    hojaSalida
      .getRange(
        2,
        1,
        filasSalida.length,
        7
      )
      .setValues(
        filasSalida
      );

  }


  Logger.log(
    "Propiedades analizadas: " +
    propiedades.length
  );


  Logger.log(
    "Similaridades generadas: " +
    filasSalida.length
  );


  return {

    propiedadesAnalizadas:
      propiedades.length,

    similaridadesGeneradas:
      filasSalida.length

  };

}


// ============================================================
// DIAGNÓSTICO GENERAL
// ============================================================

function diagnosticarPropiedadesSimilares() {

  const propiedades =
    obtenerPropiedadesParaSimilares();


  let publicadas = 0;

  let noPublicadas = 0;

  const estados = {};

  const ejemplos = [];


  for (
    const propiedad
    of propiedades
  ) {

    const estado =
      String(
        propiedad.publicado || ""
      ).trim();


    const estadoNormalizado =
      normalizarTextoSimilar(
        estado
      );


    if (
      estadoNormalizado ===
      "publicado"
    ) {

      publicadas++;

    } else {

      noPublicadas++;

    }


    if (
      !estados[estado]
    ) {

      estados[estado] = 0;

    }


    estados[estado]++;


    if (
      ejemplos.length < 10
    ) {

      ejemplos.push({

        id:
          propiedad.id,

        titulo:
          propiedad.titulo,

        operacion:
          propiedad.operacion,

        tipo:
          propiedad.tipo,

        ciudad:
          propiedad.ciudad,

        precio:
          propiedad.precio,

        moneda:
          propiedad.moneda,

        superficieCubierta:
          propiedad.superficieCubierta,

        superficieTerreno:
          propiedad.superficieTerreno,

        publicado:
          estado

      });

    }

  }


  Logger.log(
    "TOTAL PROPIEDADES: " +
    propiedades.length
  );


  Logger.log(
    "PUBLICADAS RECONOCIDAS: " +
    publicadas
  );


  Logger.log(
    "NO PUBLICADAS RECONOCIDAS: " +
    noPublicadas
  );


  Logger.log(
    "ESTADOS ENCONTRADOS:"
  );


  Logger.log(
    JSON.stringify(
      estados,
      null,
      2
    )
  );


  Logger.log(
    "PRIMEROS EJEMPLOS:"
  );


  Logger.log(
    JSON.stringify(
      ejemplos,
      null,
      2
    )
  );

}


// ============================================================
// DIAGNÓSTICO DE FILTROS
// ============================================================

function diagnosticarFiltrosPropiedadesSimilares() {

  const propiedades =
    obtenerPropiedadesParaSimilares();


  Logger.log(
    "TOTAL PROPIEDADES: " +
    propiedades.length
  );


  const publicadas =
    propiedades.filter(
      propiedad =>
        normalizarTextoSimilar(
          propiedad.publicado
        ) ===
        "publicado"
    );


  Logger.log(
    "PUBLICADAS: " +
    publicadas.length
  );


  let descartadasMismaPropiedad = 0;
  let descartadasOperacion = 0;
  let descartadasCiudad = 0;
  let descartadasTipo = 0;
  let descartadasPrecio = 0;


  let candidatosHastaOperacion = 0;
  let candidatosHastaCiudad = 0;
  let candidatosHastaTipo = 0;
  let candidatosHastaPrecio = 0;


  const ejemplosOperacion = [];
  const ejemplosTipo = [];
  const ejemplosPrecio = [];


  for (
    const base
    of publicadas
  ) {

    for (
      const candidata
      of publicadas
    ) {

      // ------------------------------------------------------
      // MISMA PROPIEDAD
      // ------------------------------------------------------

      if (
        String(base.id) ===
        String(candidata.id)
      ) {

        descartadasMismaPropiedad++;

        continue;

      }


      // ------------------------------------------------------
      // OPERACIÓN
      // ------------------------------------------------------

      const operacionesBase =
        String(
          base.operacion || ""
        )
          .split(",")
          .map(
            operacion =>
              normalizarTextoSimilar(
                operacion
              )
          )
          .filter(Boolean);


      const operacionesCandidata =
        String(
          candidata.operacion || ""
        )
          .split(",")
          .map(
            operacion =>
              normalizarTextoSimilar(
                operacion
              )
          )
          .filter(Boolean);


      const operacionesCompatibles =
        operacionesBase.some(
          operacion =>
            operacionesCandidata.includes(
              operacion
            )
        );


      if (
        !operacionesCompatibles
      ) {

        descartadasOperacion++;


        if (
          ejemplosOperacion.length < 10
        ) {

          ejemplosOperacion.push({

            base:
              base.id +
              " - " +
              base.titulo,

            operacionBase:
              base.operacion,

            candidata:
              candidata.id +
              " - " +
              candidata.titulo,

            operacionCandidata:
              candidata.operacion

          });

        }


        continue;

      }


      candidatosHastaOperacion++;


      // ------------------------------------------------------
      // CIUDAD
      // ------------------------------------------------------

      if (
        normalizarTextoSimilar(
          base.ciudad
        ) !==
        normalizarTextoSimilar(
          candidata.ciudad
        )
      ) {

        descartadasCiudad++;

        continue;

      }


      candidatosHastaCiudad++;


      // ------------------------------------------------------
      // TIPO
      // ------------------------------------------------------

      if (
        !tiposPropiedadSimilares(
          base.tipo,
          candidata.tipo
        )
      ) {

        descartadasTipo++;


        if (
          ejemplosTipo.length < 10
        ) {

          ejemplosTipo.push({

            base:
              base.id +
              " - " +
              base.titulo,

            tipoBase:
              base.tipo,

            candidata:
              candidata.id +
              " - " +
              candidata.titulo,

            tipoCandidata:
              candidata.tipo

          });

        }


        continue;

      }


      candidatosHastaTipo++;


      // ------------------------------------------------------
      // PRECIO
      // ------------------------------------------------------

      const resultadoPrecio =
        compararPrecioSimilar(
          base,
          candidata
        );


      if (
        !resultadoPrecio ||
        resultadoPrecio.valido !== true
      ) {

        descartadasPrecio++;


        if (
          ejemplosPrecio.length < 20
        ) {

          ejemplosPrecio.push({

            base:
              base.id +
              " - " +
              base.titulo,

            candidata:
              candidata.id +
              " - " +
              candidata.titulo,

            monedaBase:
              base.moneda,

            monedaCandidata:
              candidata.moneda,

            precioBase:
              base.precio,

            precioCandidata:
              candidata.precio,

            motivo:
              resultadoPrecio
                ? resultadoPrecio.motivo
                : "Sin resultado"

          });

        }


        continue;

      }


      candidatosHastaPrecio++;

    }

  }


  Logger.log(
    "DESCARTADAS MISMA PROPIEDAD: " +
    descartadasMismaPropiedad
  );


  Logger.log(
    "PASAN OPERACIÓN: " +
    candidatosHastaOperacion
  );


  Logger.log(
    "DESCARTADAS OPERACIÓN: " +
    descartadasOperacion
  );


  Logger.log(
    "PASAN CIUDAD: " +
    candidatosHastaCiudad
  );


  Logger.log(
    "DESCARTADAS CIUDAD: " +
    descartadasCiudad
  );


  Logger.log(
    "PASAN TIPO: " +
    candidatosHastaTipo
  );


  Logger.log(
    "DESCARTADAS TIPO: " +
    descartadasTipo
  );


  Logger.log(
    "PASAN PRECIO: " +
    candidatosHastaPrecio
  );


  Logger.log(
    "DESCARTADAS PRECIO: " +
    descartadasPrecio
  );


  Logger.log(
    "EJEMPLOS DESCARTADOS POR OPERACIÓN:"
  );


  Logger.log(
    JSON.stringify(
      ejemplosOperacion,
      null,
      2
    )
  );


  Logger.log(
    "EJEMPLOS DESCARTADOS POR TIPO:"
  );


  Logger.log(
    JSON.stringify(
      ejemplosTipo,
      null,
      2
    )
  );


  Logger.log(
    "EJEMPLOS DESCARTADOS POR PRECIO:"
  );


  Logger.log(
    JSON.stringify(
      ejemplosPrecio,
      null,
      2
    )
  );

}


// ============================================================
// PRUEBA AISLADA DE MONEDA Y PRECIO
// ============================================================

function probarComparacionPrecioSimilar() {

  const casos = [

    {
      base: 120000,
      candidata: 130000,
      monedaBase: "usd",
      monedaCandidata: "usd"
    },

    {
      base: 120000,
      candidata: 115000,
      monedaBase: "usd",
      monedaCandidata: "usd"
    },

    {
      base: 120000,
      candidata: 65000,
      monedaBase: "usd",
      monedaCandidata: "usd"
    },

    {
      base: 120000,
      candidata: 120000,
      monedaBase: "usd",
      monedaCandidata: "usd"
    },

    // --------------------------------------------------------
    // ESTE CASO DEBE SER DESCARTADO
    // USD VS ARS
    // --------------------------------------------------------

    {
      base: 120000,
      candidata: 130000,
      monedaBase: "usd",
      monedaCandidata: "ars"
    }

  ];


  for (
    const caso
    of casos
  ) {

    const resultado =
      compararPrecioSimilar(

        {
          precio:
            caso.base,

          moneda:
            caso.monedaBase

        },

        {

          precio:
            caso.candidata,

          moneda:
            caso.monedaCandidata

        }

      );


    Logger.log(

      JSON.stringify(

        {

          caso,

          resultado

        },

        null,

        2

      )

    );

  }

}


// ============================================================
// PRUEBA DE SUPERFICIES
// ============================================================

function probarNormalizacionSuperficiesSimilares() {

  const casos = [

    "154,3 m2 (10 x 15 mts aprox)",

    "154,8 m2",

    "154,5 m2",

    "154 m2",

    "1250,4 m2",

    "1250,8 m2",

    "1.250,5 m2",

    "1.250,4 m2"

  ];


  for (
    const caso
    of casos
  ) {

    Logger.log(

      JSON.stringify({

        original:
          caso,

        normalizado:
          normalizarSuperficieTerrenoSimilar(
            caso
          )

      })

    );

  }

}



function diagnosticarComparadorPrecioReal() {

  Logger.log("========================================");
  Logger.log("DIAGNÓSTICO COMPARADOR PRECIO REAL");
  Logger.log("========================================");

  const casoUSDUSD =
    compararPrecioSimilar(
      {
        precio: 120000,
        moneda: "usd"
      },
      {
        precio: 130000,
        moneda: "usd"
      }
    );

  Logger.log("USD/USD:");
  Logger.log(
    JSON.stringify(
      casoUSDUSD,
      null,
      2
    )
  );

  Logger.log(
    "USD/USD valido: " +
    casoUSDUSD.valido
  );

  Logger.log(
    "USD/USD tiene valido: " +
    Object.prototype.hasOwnProperty.call(
      casoUSDUSD,
      "valido"
    )
  );

  const casoUSDARS =
    compararPrecioSimilar(
      {
        precio: 120000,
        moneda: "usd"
      },
      {
        precio: 130000,
        moneda: "ars"
      }
    );

  Logger.log("USD/ARS:");
  Logger.log(
    JSON.stringify(
      casoUSDARS,
      null,
      2
    )
  );

  Logger.log(
    "USD/ARS valido: " +
    casoUSDARS.valido
  );

  Logger.log(
    "USD/ARS tiene valido: " +
    Object.prototype.hasOwnProperty.call(
      casoUSDARS,
      "valido"
    )
  );

  Logger.log("========================================");
  Logger.log("FIN DIAGNÓSTICO");
  Logger.log("========================================");

}

// ============================================================
// DIAGNÓSTICO DEFINITIVO DEL CÓDIGO REALMENTE EJECUTADO
// ============================================================

function diagnosticarCodigoComparadorPrecioRuntime() {

  Logger.log(
    "========================================"
  );

  Logger.log(
    "DIAGNÓSTICO DEFINITIVO DEL RUNTIME"
  );

  Logger.log(
    "========================================"
  );

  // ----------------------------------------------------------
  // MOSTRAR LA FUNCIÓN REAL QUE ESTÁ EJECUTANDO APPS SCRIPT
  // ----------------------------------------------------------

  Logger.log(
    "CÓDIGO REAL DE compararPrecioSimilar:"
  );

  Logger.log(
    compararPrecioSimilar.toString()
  );

  // ----------------------------------------------------------
  // PRUEBA USD / USD
  // ----------------------------------------------------------

  const resultadoUsdUsd =
    compararPrecioSimilar(
      {
        precio: 120000,
        moneda: "usd"
      },
      {
        precio: 130000,
        moneda: "usd"
      }
    );

  Logger.log(
    "========================================"
  );

  Logger.log(
    "RESULTADO USD / USD:"
  );

  Logger.log(
    JSON.stringify(
      resultadoUsdUsd,
      null,
      2
    )
  );

  // ----------------------------------------------------------
  // PRUEBA USD / ARS
  // ----------------------------------------------------------

  const resultadoUsdArs =
    compararPrecioSimilar(
      {
        precio: 120000,
        moneda: "usd"
      },
      {
        precio: 130000,
        moneda: "ars"
      }
    );

  Logger.log(
    "========================================"
  );

  Logger.log(
    "RESULTADO USD / ARS:"
  );

  Logger.log(
    JSON.stringify(
      resultadoUsdArs,
      null,
      2
    )
  );

  // ----------------------------------------------------------
  // COMPROBAR PROPIEDAD VALIDO
  // ----------------------------------------------------------

  Logger.log(
    "========================================"
  );

  Logger.log(
    "COMPROBACIÓN DE VALIDO:"
  );

  Logger.log(
    "USD/USD valido = " +
    resultadoUsdUsd.valido
  );

  Logger.log(
    "USD/ARS valido = " +
    resultadoUsdArs.valido
  );

  Logger.log(
    "USD/USD keys = " +
    JSON.stringify(
      Object.keys(resultadoUsdUsd)
    )
  );

  Logger.log(
    "USD/ARS keys = " +
    JSON.stringify(
      Object.keys(resultadoUsdArs)
    )
  );

  Logger.log(
    "========================================"
  );

  Logger.log(
    "FIN DIAGNÓSTICO"
  );

  Logger.log(
    "========================================"
  );

}
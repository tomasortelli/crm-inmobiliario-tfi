const CONFIG_DORMITORIOS = {

  nombre: "Dormitorios",

  puntajeMaximo: 20,

  diferencias: [

    {

      max: 0,

      porcentaje: 1.00

    },

    {

      max: 1,

      porcentaje: 0.80

    },

    {

      max: 2,

      porcentaje: 0.60

    },

    {

      max: 3,

      porcentaje: 0.30

    }

  ]

};

const CONFIG_BANOS = {

  nombre: "Baños",

  puntajeMaximo: 10,

  diferencias: [

    {

      max: 0,

      porcentaje: 1.00

    },

    {

      max: 1,

      porcentaje: 0.80

    },

    {

      max: 2,

      porcentaje: 0.40

    },

    {

      max: 3,

      porcentaje: 0.15

    }

  ]

};

const CONFIG_SUP_CUBIERTA = {

  nombre: "Sup. cubierta",

  puntajeMaximo: 10,

  diferencias: [

    {

      max: 0,

      porcentaje: 1.00

    },

    {

      max: 10,

      porcentaje: 0.90

    },

    {

      max: 20,

      porcentaje: 0.70

    },

    {

      max: 40,

      porcentaje: 0.40

    }

  ]

};

const CONFIG_SUP_TERRENO = {

  nombre: "Sup. terreno",

  puntajeMaximo: 10,

  diferencias: [

    {

      max: 0,

      porcentaje: 1.00

    },

    {

      max: 50,

      porcentaje: 0.90

    },

    {

      max: 100,

      porcentaje: 0.70

    },

    {

      max: 200,

      porcentaje: 0.40

    }

  ]

};

const CONFIG_COMODIDADES = {

  nombre: "Comodidades",

  puntajeMaximo: 10

};


const CONFIG_AMBIENTES = {

  nombre: "Ambientes",

  puntajeMaximo: 15

};



function compararAtributoNumerico(
  valorOrigen,
  valorDestino,
  config
) {

  valorOrigen =
    Number(valorOrigen || 0);

  valorDestino =
    Number(valorDestino || 0);

  const diferencia =
    Math.abs(
      valorOrigen -
      valorDestino
    );

  for (
    const regla
    of config.diferencias
  ) {

    if (
      diferencia <=
      regla.max
    ) {

      return {

        valido: true,

        porcentaje:
          regla.porcentaje,

        puntaje:
          Math.round(
            regla.porcentaje *
            config.puntajeMaximo
          ),

        motivo:
          diferencia === 0
            ? config.nombre + " iguales"
            : (
                valorDestino > valorOrigen
                ? "Tiene " +
                  diferencia +
                  " " +
                  config.nombre.toLowerCase() +
                  (diferencia > 1 ? " más" : " más")
                : "Tiene " +
                  diferencia +
                  " " +
                  config.nombre.toLowerCase() +
                  (diferencia > 1 ? " menos" : " menos")
              )

      };

    }

  }

  return {

    valido: true,

    porcentaje: 0,

    puntaje: 0,

    motivo:
      "Gran diferencia de " +
      config.nombre.toLowerCase()

  };

}


function compararLista(

  listaOrigen,

  listaDestino,

  nombre,

  puntajeMaximo

) {

  const origen =

    new Set(

      obtenerListaNormalizada(

        listaOrigen

      )

    );

  const destino =

    new Set(

      obtenerListaNormalizada(

        listaDestino

      )

    );

  if (

    origen.size === 0 ||

    destino.size === 0

  ) {

    return {

      puntaje: 0,

      motivo:

        nombre +

        ": sin comparar"

    };

  }

  const coinciden = [];

  for (

    const item

    of origen

  ) {

    if (

      destino.has(item)

    ) {

      coinciden.push(item);

    }

  }

  const porcentaje =

    coinciden.length /

    origen.size;

  const puntaje =

    Math.round(

      puntajeMaximo *

      porcentaje

    );

  let motivo;

  if (

    coinciden.length === 0

  ) {

    motivo =

      nombre +

      ": sin coincidencias";

  }

  else {

    motivo =

      nombre +

      ": " +

      coinciden.join(", ");

  }

  return {

    puntaje,

    motivo,

    cantidadCoinciden:

      coinciden.length,

    cantidadTotal:

      origen.size,

    coinciden

  };

}


// ========================================
// COMPARAR DORMITORIOS
// ========================================
//
// Lógica:
//
// 1. Si la propiedad no corresponde a un
//    tipo donde tengan sentido dormitorios,
//    no se comparan.
//
// 2. Si la demanda no solicita dormitorios,
//    no se comparan.
//
// 3. Si tiene exactamente los dormitorios
//    solicitados:
//    -> puntaje máximo.
//
// 4. Si tiene más dormitorios:
//    -> sigue siendo una coincidencia positiva,
//       pero con menor puntaje.
//
// 5. Si tiene menos dormitorios:
//    -> recibe una penalización proporcional.
//       En condiciones normales esto no debería
//       ocurrir porque el filtro obligatorio
//       ya debería haberla descartado.
//
// ========================================

function compararDormitorios(
  origen,
  destino
) {

  // --------------------------------
  // TIPOS DE PROPIEDAD DONDE
  // TIENE SENTIDO COMPARAR DORMITORIOS
  // --------------------------------

  const tiposComparables = [

    "casa",
    "casaquinta",
    "quinta",
    "departamento"

  ];


  // --------------------------------
  // OBTENER TIPOS DE LA PROPIEDAD
  // --------------------------------

  const tiposPropiedad =

    String(
      destino.tipo || ""
    )
      .toLowerCase()
      .split(",")
      .map(
        tipo =>
          tipo
            .trim()
            .replace(/\s+/g, " ")
      )
      .filter(Boolean);


  // --------------------------------
  // VERIFICAR SI LA PROPIEDAD
  // PERMITE COMPARAR DORMITORIOS
  // --------------------------------

  const correspondeComparar =

    tiposPropiedad.some(
      tipo =>
        tiposComparables.includes(
          tipo
        )
    );


  if (
    !correspondeComparar
  ) {

    return {

      valido: true,

      puntaje: 0,

      motivo:
        "Dormitorios: sin comparar"

    };

  }


  // --------------------------------
  // DORMITORIOS SOLICITADOS
  // --------------------------------

  const dormitoriosBuscados =

    Number(
      origen.dormitorios || 0
    );


  // --------------------------------
  // SI LA DEMANDA NO INDICA
  // DORMITORIOS, NO SE COMPARA
  // --------------------------------

  if (
    dormitoriosBuscados <= 0
  ) {

    return {

      valido: true,

      puntaje: 0,

      motivo:
        "Dormitorios: sin comparar"

    };

  }


  // --------------------------------
  // DORMITORIOS DE LA PROPIEDAD
  // --------------------------------

  const dormitoriosPropiedad =

    Number(
      destino.dormitorios || 0
    );


  // --------------------------------
  // DIFERENCIA
  // --------------------------------

  const diferencia =

    dormitoriosPropiedad -
    dormitoriosBuscados;


  // --------------------------------
  // EXACTAMENTE LOS SOLICITADOS
  // --------------------------------

  if (
    diferencia === 0
  ) {

    return {

      valido: true,

      puntaje:
        CONFIG_DORMITORIOS.puntajeMaximo,

      motivo:
        "Dormitorios iguales"

    };

  }


  // --------------------------------
  // TIENE MÁS DORMITORIOS
  // --------------------------------
  //
  // Es positivo, pero no obtiene
  // automáticamente el mismo puntaje
  // que una coincidencia exacta.
  //
  // --------------------------------

  if (
    diferencia > 0
  ) {

    if (
      diferencia === 1
    ) {

      return {

        valido: true,

        puntaje:
          Math.round(
            CONFIG_DORMITORIOS.puntajeMaximo *
            0.80
          ),

        motivo:
          "Tiene 1 dormitorio más"

      };

    }


    if (
      diferencia === 2
    ) {

      return {

        valido: true,

        puntaje:
          Math.round(
            CONFIG_DORMITORIOS.puntajeMaximo *
            0.60
          ),

        motivo:
          "Tiene 2 dormitorios más"

      };

    }


    if (
      diferencia === 3
    ) {

      return {

        valido: true,

        puntaje:
          Math.round(
            CONFIG_DORMITORIOS.puntajeMaximo *
            0.30
          ),

        motivo:
          "Tiene 3 dormitorios más"

      };

    }


    return {

      valido: true,

      puntaje: 0,

      motivo:
        "Tiene " +
        diferencia +
        " dormitorios más"

    };

  }


  // --------------------------------
  // TIENE MENOS DORMITORIOS
  // --------------------------------
  //
  // Normalmente esta situación debería
  // haber sido descartada antes por
  // validarFiltrosObligatorios().
  //
  // Se mantiene esta lógica como respaldo.
  //
  // --------------------------------

  const diferenciaAbsoluta =

    Math.abs(
      diferencia
    );


  return {

    valido: true,

    puntaje: 0,

    motivo:
      "Tiene " +
      diferenciaAbsoluta +
      " dormitorios menos"

  };

}


// ========================================
// COMPARAR BAÑOS
// ========================================
//
// Lógica:
//
// 1. Si la propiedad no corresponde a un
//    tipo donde tenga sentido comparar baños,
//    no se comparan.
//
// 2. Si la demanda no tiene un dato de baños,
//    no se comparan.
//
// 3. Igual cantidad:
//    -> puntaje máximo.
//
// 4. Más baños:
//    -> suma puntos, pero menos que una
//       coincidencia exacta.
//
// 5. Menos baños:
//    -> penalización.
//       En condiciones normales debería
//       ser descartado por el filtro si
//       en el futuro agregamos baños mínimos.
//
// ========================================

function compararBanos(
  origen,
  destino
) {

  // --------------------------------
  // TIPOS DE PROPIEDAD DONDE
  // TIENE SENTIDO COMPARAR BAÑOS
  // --------------------------------

  const tiposComparables = [

    "casa",
    "casaquinta",
    "quinta",
    "departamento"

  ];


  // --------------------------------
  // OBTENER TIPOS DE LA PROPIEDAD
  // --------------------------------

  const tiposPropiedad =

    String(
      destino.tipo || ""
    )
      .toLowerCase()
      .split(",")
      .map(
        tipo =>
          tipo
            .trim()
            .replace(/\s+/g, " ")
      )
      .filter(Boolean);


  // --------------------------------
  // VERIFICAR SI LA PROPIEDAD
  // PERMITE COMPARAR BAÑOS
  // --------------------------------

  const correspondeComparar =

    tiposPropiedad.some(
      tipo =>
        tiposComparables.includes(
          tipo
        )
    );


  if (
    !correspondeComparar
  ) {

    return {

      valido: true,

      puntaje: 0,

      motivo:
        "Baños: sin comparar"

    };

  }


  // --------------------------------
  // BAÑOS SOLICITADOS
  // --------------------------------

  const banosBuscados =

    Number(
      origen.banos || 0
    );


  // --------------------------------
  // SI LA DEMANDA NO INDICA
  // BAÑOS, NO SE COMPARA
  // --------------------------------

  if (
    banosBuscados <= 0
  ) {

    return {

      valido: true,

      puntaje: 0,

      motivo:
        "Baños: sin comparar"

    };

  }


  // --------------------------------
  // BAÑOS DE LA PROPIEDAD
  // --------------------------------

  const banosPropiedad =

    Number(
      destino.banos || 0
    );


  // --------------------------------
  // DIFERENCIA
  // --------------------------------

  const diferencia =

    banosPropiedad -
    banosBuscados;


  // --------------------------------
  // EXACTAMENTE LOS SOLICITADOS
  // --------------------------------

  if (
    diferencia === 0
  ) {

    return {

      valido: true,

      puntaje:
        CONFIG_BANOS.puntajeMaximo,

      motivo:
        "Baños iguales"

    };

  }


  // --------------------------------
  // TIENE MÁS BAÑOS
  // --------------------------------

  if (
    diferencia > 0
  ) {

    if (
      diferencia === 1
    ) {

      return {

        valido: true,

        puntaje:
          Math.round(
            CONFIG_BANOS.puntajeMaximo *
            0.80
          ),

        motivo:
          "Tiene 1 baño más"

      };

    }


    if (
      diferencia === 2
    ) {

      return {

        valido: true,

        puntaje:
          Math.round(
            CONFIG_BANOS.puntajeMaximo *
            0.40
          ),

        motivo:
          "Tiene 2 baños más"

      };

    }


    if (
      diferencia === 3
    ) {

      return {

        valido: true,

        puntaje:
          Math.round(
            CONFIG_BANOS.puntajeMaximo *
            0.15
          ),

        motivo:
          "Tiene 3 baños más"

      };

    }


    return {

      valido: true,

      puntaje: 0,

      motivo:
        "Tiene " +
        diferencia +
        " baños más"

    };

  }


  // --------------------------------
  // TIENE MENOS BAÑOS
  // --------------------------------

  const diferenciaAbsoluta =

    Math.abs(
      diferencia
    );


  return {

    valido: true,

    puntaje: 0,

    motivo:
      "Tiene " +
      diferenciaAbsoluta +
      " baños menos"

  };

}

function compararSuperficieCubierta(
  origen,
  destino
) {

  return compararAtributoNumerico(

    origen.superficieCubierta,

    destino.superficieCubierta,

    CONFIG_SUP_CUBIERTA

  );

}

function compararSuperficieTerreno(
  origen,
  destino
) {

  return compararAtributoNumerico(

    origen.superficieTerreno,

    destino.superficieTerreno,

    CONFIG_SUP_TERRENO

  );

}



function compararComodidades(
  origen,
  destino
) {

  const origenLista = [];

  const destinoLista = [];

  if (origen.patio)
    origenLista.push("Patio");

  if (origen.garage)
    origenLista.push("Garage");

  if (origen.pileta)
    origenLista.push("Pileta");

  if (destino.patio)
    destinoLista.push("Patio");

  if (destino.garage)
    destinoLista.push("Garage");

  if (destino.pileta)
    destinoLista.push("Pileta");

  return compararLista(

    origenLista.join(","),

    destinoLista.join(","),

    CONFIG_COMODIDADES.nombre,

    CONFIG_COMODIDADES.puntajeMaximo

  );

}


function compararAmbientes(
  origen,
  destino
) {

  return compararLista(

    origen.ambientes,

    destino.ambientes,

    CONFIG_AMBIENTES.nombre,

    CONFIG_AMBIENTES.puntajeMaximo

  );

}


function crearObjetoPropiedad(fila) {

  const precio =
    Number(fila[12] || 0);

  const comodidades =
    String(fila[22] || "")
      .toLowerCase();

  const servicios =
    String(fila[25] || "")
      .toLowerCase();

  return {

    id:
      String(fila[0] || "").trim(),

    titulo:
      String(fila[1] || "").trim(),

    operacion:
      String(fila[5] || "").trim(),

    tipo:
      String(fila[11] || "").trim(),

    precio:
      precio,

    precioMin:
      precio,

    precioMax:
      precio,

    moneda:
      String(fila[13] || "").trim(),

    dormitorios:
      Number(fila[15] || 0),

    banos:
      Number(fila[17] || 0),

    superficieCubierta:
      obtenerNumeroNormalizado(fila[18]),

    superficieTerreno:
      obtenerNumeroNormalizado(fila[19]),

    direccion:
      String(fila[26] || "").trim(),

    ciudad:
      String(fila[27] || "").trim(),

    permuta:
      String(fila[28] || "").trim(),

    publicado:
      String(fila[32] || "").trim(),

    link:
      String(fila[2] || "").trim(),

    patio:
      comodidades.includes("patio"),

    garage:
      comodidades.includes("garage"),

    pileta:
      comodidades.includes("pileta"),

    aptoCredito:

      servicios.includes("apta crédito") ||

      servicios.includes("apto crédito"),

  };

}


function crearObjetoDemanda(fila) {

  return {

    id:
      String(fila[0] || "").trim(),

    fecha:
      fila[1],

    idLead:
      String(fila[2] || "").trim(),

    nombre:
      String(fila[3] || "").trim(),

    operacion:
      String(fila[4] || "").trim(),

    tipo:
      String(fila[5] || "").trim(),

    ciudad:
      String(fila[6] || "").trim(),

    dormitorios:
      Number(fila[7] || 0),

    precioMin:
      Number(fila[8] || 0),

    precioMax:
      Number(fila[9] || 0),

    precio:
      Number(fila[9] || fila[8] || 0),

    moneda:
      String(fila[10] || "").trim(),

    patio:
      String(fila[11] || "").trim() === "Sí",

    garage:
      String(fila[12] || "").trim() === "Sí",

    aptoCredito:
      String(fila[13] || "").trim() === "Sí",

    estado:
      String(fila[14] || "").trim(),

    banios: 0,

    superficieCubierta: 0,

    superficieTerreno: 0,

    ambientes: "",

    pileta: false

  };

}

function validarFiltrosObligatorios(
  origen,
  destino
) {

  // --------------------------------
  // PROPIEDAD PUBLICADA
  // --------------------------------

  if (
    destino.publicado !==
    "Publicado"
  ) {

    return {

      valido: false,

      motivo:
        "No publicada"

    };

  }


  // --------------------------------
  // OPERACIÓN
  // --------------------------------

  if (
    origen.operacion !==
    destino.operacion
  ) {

    return {

      valido: false,

      motivo:
        "Operación distinta"

    };

  }


  // --------------------------------
  // CIUDAD
  // --------------------------------

  if (
    origen.ciudad !==
    destino.ciudad
  ) {

    return {

      valido: false,

      motivo:
        "Ciudad distinta"

    };

  }


// --------------------------------
// TIPO DE PROPIEDAD
// --------------------------------

const coincideTipo =
  tiposPropiedadCoinciden(
    origen.tipo,
    destino.tipo
  );

if (
  !coincideTipo
) {

  return {

    valido: false,

    motivo:
      "Tipo de propiedad no compatible"

  };

}


  // --------------------------------
  // MONEDA
  // --------------------------------

  const monedaOrigen =
    String(
      origen.moneda || ""
    )
      .trim()
      .toUpperCase();


  const monedaDestino =
    String(
      destino.moneda || ""
    )
      .trim()
      .toUpperCase();


  if (
    monedaOrigen &&
    monedaDestino &&
    monedaOrigen !==
    monedaDestino
  ) {

    return {

      valido: false,

      motivo:
        "Moneda distinta"

    };

  }


  // --------------------------------
  // PATIO
  // --------------------------------

  if (
    origen.patio === true &&
    destino.patio !== true
  ) {

    return {

      valido: false,

      motivo:
        "Sin patio"

    };

  }


  // --------------------------------
  // GARAGE
  // --------------------------------

  if (
    origen.garage === true &&
    destino.garage !== true
  ) {

    return {

      valido: false,

      motivo:
        "Sin garage"

    };

  }


  // --------------------------------
  // PILETA
  // --------------------------------

  if (
    origen.pileta === true &&
    destino.pileta !== true
  ) {

    return {

      valido: false,

      motivo:
        "Sin pileta"

    };

  }


  // --------------------------------
  // APTO CRÉDITO
  // --------------------------------

  if (
    origen.aptoCredito === true &&
    destino.aptoCredito !== true
  ) {

    return {

      valido: false,

      motivo:
        "No apto crédito"

    };

  }


  // --------------------------------
  // DORMITORIOS MÍNIMOS
  // --------------------------------

  // --------------------------------
  // DORMITORIOS MÍNIMOS
  // SOLO APLICA A PROPIEDADES HABITACIONALES
  // --------------------------------

  const tiposConDormitorios = [

    "casa",

    "departamento",

    "casaquinta",

    "quinta"

  ];

  const tiposDestino =
    String(
      destino.tipo || ""
    )
      .toLowerCase()
      .split(",")
      .map(
        tipo =>
          tipo
            .trim()
            .replace(/\s+/g, " ")
      )
      .filter(Boolean);

  const aplicaFiltroDormitorios =
    tiposDestino.some(
      tipo =>
        tiposConDormitorios.includes(
          tipo
        )
    );

  if (
    aplicaFiltroDormitorios &&
    origen.dormitorios > 0
  ) {

    if (
      destino.dormitorios <
      origen.dormitorios
    ) {

      return {

        valido: false,

        motivo:
          "Muy pocos dormitorios"

      };

    }

  }


  // --------------------------------
  // PRECIO
  // --------------------------------

  const resultadoPrecio =
    validarRangoPrecio(
      origen,
      destino
    );


  if (
    !resultadoPrecio.valido
  ) {

    return {

      valido: false,

      motivo:
        resultadoPrecio.motivo

    };

  }


  // --------------------------------
  // TODO OK
  // --------------------------------

  return {

    valido: true

  };

}

function tiposPropiedadCoinciden(
  tipoDemanda,
  tipoPropiedad
) {

  const tiposDemanda =
    String(tipoDemanda || "")
      .toLowerCase()
      .split(",")
      .map(tipo =>
        tipo
          .trim()
          .replace(/\s+/g, " ")
      )
      .filter(Boolean);

  const tiposPropiedad =
    String(tipoPropiedad || "")
      .toLowerCase()
      .split(",")
      .map(tipo =>
        tipo
          .trim()
          .replace(/\s+/g, " ")
      )
      .filter(Boolean);

  if (
    tiposDemanda.length === 0 ||
    tiposPropiedad.length === 0
  ) {

    return false;

  }

  return tiposDemanda.some(
    tipoDemandaActual =>
      tiposPropiedad.includes(
        tipoDemandaActual
      )
  );

}


function validarRangoPrecio(
  origen,
  destino
) {

  const precioPropiedad =
    Number(
      destino.precio || 0
    );


  // --------------------------------
  // SI LA PROPIEDAD NO TIENE PRECIO
  // --------------------------------

  if (
    precioPropiedad <= 0
  ) {

    return {

      valido: false,

      motivo:
        "Propiedad sin precio"

    };

  }


  const precioMin =
    Number(
      origen.precioMin || 0
    );


  const precioMax =
    Number(
      origen.precioMax || 0
    );


  // --------------------------------
  // PRECIO ÚNICO
  // SE INTERPRETA COMO "ALREDEDOR DE"
  // --------------------------------

  if (
    precioMin > 0 &&
    precioMax > 0 &&
    precioMin === precioMax
  ) {

    const porcentajeDiferencia =

      Math.abs(
        precioPropiedad -
        precioMin
      ) /
      precioMin *
      100;


    // --------------------------------
    // MÁS DE 25% DE DIFERENCIA
    // NO ES COMPATIBLE
    // --------------------------------

    if (
      porcentajeDiferencia >
      25
    ) {

      return {

        valido: false,

        motivo:
          "Precio demasiado alejado del valor buscado"

      };

    }


    return {

      valido: true

    };

  }


  // --------------------------------
  // RANGO DE PRECIOS
  // --------------------------------

  if (
    precioMin > 0 &&
    precioMax > 0
  ) {

    // --------------------------------
    // DENTRO DEL RANGO
    // --------------------------------

    if (
      precioPropiedad >=
      precioMin &&
      precioPropiedad <=
      precioMax
    ) {

      return {

        valido: true

      };

    }


    // --------------------------------
    // FUERA DEL RANGO
    // --------------------------------

    const distanciaFuera =

      precioPropiedad < precioMin

        ? precioMin -
          precioPropiedad

        : precioPropiedad -
          precioMax;


    const referencia =

      precioPropiedad < precioMin

        ? precioMin

        : precioMax;


    const porcentajeFuera =

      distanciaFuera /
      referencia *
      100;


    // --------------------------------
    // MÁS DE 20% FUERA
    // NO ES COMPATIBLE
    // --------------------------------

    if (
      porcentajeFuera >
      20
    ) {

      return {

        valido: false,

        motivo:
          "Precio demasiado fuera del rango buscado"

      };

    }


    // --------------------------------
    // HASTA 20% FUERA
    // SE PERMITE
    // CON MENOR PRIORIDAD
    // --------------------------------

    return {

      valido: true

    };

  }


  // --------------------------------
  // SOLO PRECIO MÍNIMO
  // --------------------------------

  if (
    precioMin > 0
  ) {

    const porcentajePorDebajo =

      (
        precioMin -
        precioPropiedad
      ) /
      precioMin *
      100;


    // Más de 10% por debajo
    // queda fuera

    if (
      precioPropiedad <
      precioMin &&
      porcentajePorDebajo >
      10
    ) {

      return {

        valido: false,

        motivo:
          "Precio por debajo del mínimo aceptable"

      };

    }


    return {

      valido: true

    };

  }


  // --------------------------------
  // SOLO PRECIO MÁXIMO
  // --------------------------------

  if (
    precioMax > 0
  ) {

    const porcentajePorEncima =

      (
        precioPropiedad -
        precioMax
      ) /
      precioMax *
      100;


    // Más de 10% por encima
    // queda fuera

    if (
      precioPropiedad >
      precioMax &&
      porcentajePorEncima >
      10
    ) {

      return {

        valido: false,

        motivo:
          "Precio por encima del máximo aceptable"

      };

    }


    return {

      valido: true

    };

  }


  // --------------------------------
  // SIN PRECIO EN LA DEMANDA
  // --------------------------------

  return {

    valido: true

  };

}


function compararPrecio(
  origen,
  destino
) {

  const precioDestino =
    Number(
      destino.precio || 0
    );

  // --------------------------------
  // SIN PRECIO EN LA DEMANDA
  // --------------------------------

  if (
    Number(origen.precioMin || 0) <= 0 &&
    Number(origen.precioMax || 0) <= 0 &&
    Number(origen.precio || 0) <= 0
  ) {

    return {

      valido: true,

      puntaje: 0,

      motivo:
        "Precio sin comparar"

    };

  }


  // --------------------------------
  // SIN PRECIO EN LA PROPIEDAD
  // --------------------------------

  if (
    precioDestino <= 0
  ) {

    return {

      valido: false,

      puntaje: 0,

      motivo:
        "Propiedad sin precio"

    };

  }


  const precioMin =
    Number(
      origen.precioMin || 0
    );

  const precioMax =
    Number(
      origen.precioMax || 0
    );

  const precioOrigen =
    Number(
      origen.precio || 0
    );


  // ==================================================
  // DEMANDA CON RANGO DE PRECIOS
  // ==================================================

  if (
    precioMin > 0 &&
    precioMax > 0 &&
    precioMin !== precioMax
  ) {

    // --------------------------------
    // DENTRO DEL RANGO
    // --------------------------------

    if (
      precioDestino >= precioMin &&
      precioDestino <= precioMax
    ) {

      const centroRango =
        (
          precioMin +
          precioMax
        ) / 2;

      const distanciaCentro =
        Math.abs(
          precioDestino -
          centroRango
        );

      const mitadRango =
        (
          precioMax -
          precioMin
        ) / 2;

      let puntaje = 45;

      let motivo =
        "Precio dentro del rango";


      // --------------------------------
      // PREMIO POR CERCANÍA AL CENTRO
      // --------------------------------

      if (
        mitadRango > 0
      ) {

        const porcentajeDistancia =
          distanciaCentro /
          mitadRango;


        // Muy cerca del centro
        if (
          porcentajeDistancia <= 0.25
        ) {

          puntaje = 50;

        }


        // Cerca del centro
        else if (
          porcentajeDistancia <= 0.50
        ) {

          puntaje = 48;

        }


        // Mitad exterior del rango
        else if (
          porcentajeDistancia <= 0.75
        ) {

          puntaje = 46;

        }

      }


      // --------------------------------
      // INDICAR SI ESTÁ EN UN EXTREMO
      // --------------------------------

      if (
        precioDestino === precioMin ||
        precioDestino === precioMax
      ) {

        motivo =
          "Precio dentro del rango (en el límite del rango)";

      }


      return {

        valido: true,

        puntaje,

        motivo

      };

    }


    // --------------------------------
    // FUERA DEL RANGO
    // --------------------------------

    const distanciaFuera =

      precioDestino < precioMin

        ? precioMin -
          precioDestino

        : precioDestino -
          precioMax;


    const referencia =

      precioDestino < precioMin

        ? precioMin

        : precioMax;


    const porcentajeFuera =

      distanciaFuera /
      referencia *
      100;


    // --------------------------------
    // MÁS DE 20% FUERA
    // NO APARECE
    // --------------------------------

    if (
      porcentajeFuera > 20
    ) {

      return {

        valido: false,

        puntaje: 0,

        motivo:

          "Precio más de 20% fuera del rango"

      };

    }


    // --------------------------------
    // ENTRE 10% Y 20% FUERA
    // PRIORIDAD BAJA
    // --------------------------------

    if (
      porcentajeFuera > 10
    ) {

      return {

        valido: true,

        puntaje: 15,

        motivo:

          "Precio " +

          (
            precioDestino <
            precioMin

              ? "-" +
                porcentajeFuera.toFixed(1) +
                "% fuera del rango"

              : "+" +
                porcentajeFuera.toFixed(1) +
                "% fuera del rango"

          )

      };

    }


    // --------------------------------
    // HASTA 10% FUERA
    // PRIORIDAD MEDIA
    // --------------------------------

    return {

      valido: true,

      puntaje: 25,

      motivo:

        "Precio " +

        (
          precioDestino <
          precioMin

            ? "-" +
              porcentajeFuera.toFixed(1) +
              "% fuera del rango"

            : "+" +
              porcentajeFuera.toFixed(1) +
              "% fuera del rango"

        )

    };

  }


  // ==================================================
  // PRECIO ÚNICO
  // SE INTERPRETA COMO "ALREDEDOR DE"
  // ==================================================

  const diferencia =

    Math.abs(
      precioDestino -
      precioOrigen
    );


  const porcentaje =

    diferencia /
    precioOrigen *
    100;


  // --------------------------------
  // HASTA 5%
  // EXCELENTE
  // --------------------------------

  if (
    porcentaje <= 5
  ) {

    return {

      valido: true,

      puntaje: 50,

      motivo:

        "Precio alrededor del valor buscado (" +

        (
          precioDestino >=
          precioOrigen

            ? "+" +
              porcentaje.toFixed(1) +
              "%"

            : "-" +
              porcentaje.toFixed(1) +
              "%"

        ) +

        ")"

    };

  }


  // --------------------------------
  // HASTA 10%
  // MUY BUENO
  // --------------------------------

  if (
    porcentaje <= 10
  ) {

    return {

      valido: true,

      puntaje: 42,

      motivo:

        "Precio cerca del valor buscado (" +

        (
          precioDestino >=
          precioOrigen

            ? "+" +
              porcentaje.toFixed(1) +
              "%"

            : "-" +
              porcentaje.toFixed(1) +
              "%"

        ) +

        ")"

    };

  }


  // --------------------------------
  // HASTA 15%
  // ACEPTABLE
  // --------------------------------

  if (
    porcentaje <= 15
  ) {

    return {

      valido: true,

      puntaje: 30,

      motivo:

        "Precio algo alejado del valor buscado (" +

        (
          precioDestino >=
          precioOrigen

            ? "+" +
              porcentaje.toFixed(1) +
              "%"

            : "-" +
              porcentaje.toFixed(1) +
              "%"

        ) +

        ")"

    };

  }


  // --------------------------------
  // HASTA 20%
  // BAJA PRIORIDAD
  // --------------------------------

  if (
    porcentaje <= 20
  ) {

    return {

      valido: true,

      puntaje: 15,

      motivo:

        "Precio alejado del valor buscado (" +

        (
          precioDestino >=
          precioOrigen

            ? "+" +
              porcentaje.toFixed(1) +
              "%"

            : "-" +
              porcentaje.toFixed(1) +
              "%"

        ) +

        ")"

    };

  }


  // --------------------------------
  // HASTA 25%
  // ÚLTIMO NIVEL ACEPTABLE
  // --------------------------------

  if (
    porcentaje <= 25
  ) {

    return {

      valido: true,

      puntaje: 5,

      motivo:

        "Precio muy alejado del valor buscado (" +

        (
          precioDestino >=
          precioOrigen

            ? "+" +
              porcentaje.toFixed(1) +
              "%"

            : "-" +
              porcentaje.toFixed(1) +
              "%"

        ) +

        ")"

    };

  }


  // --------------------------------
  // MÁS DE 25%
  // NO APARECE
  // --------------------------------

  return {

    valido: false,

    puntaje: 0,

    motivo:

      "Precio más de 25% alejado del valor buscado (" +

      (
        precioDestino >=
        precioOrigen

          ? "+" +
            porcentaje.toFixed(1) +
            "%"

          : "-" +
            porcentaje.toFixed(1) +
            "%"

      ) +

      ")"

  };

}


function comparar(
  origen,
  destino
) {

  // ========================================
  // 1. FILTROS OBLIGATORIOS
  // ========================================

  const filtro =
    validarFiltrosObligatorios(
      origen,
      destino
    );


  // ----------------------------------------
  // SI NO CUMPLE LOS FILTROS,
  // LA PROPIEDAD NO ES UNA COINCIDENCIA
  // ----------------------------------------

  if (
    !filtro.valido
  ) {

    return {

      valido: false,

      puntaje: 0,

      puntajeNormalizado: 0,

      motivos: [

        filtro.motivo

      ],

      resumen:
        filtro.motivo

    };

  }


  // ========================================
  // 2. CRITERIOS DE RANKING
  // ========================================
  //
  // Cada criterio tiene un puntaje máximo.
  //
  // El puntaje final se normaliza sobre 100
  // utilizando únicamente los criterios que
  // realmente pudieron ser evaluados.
  //
  // Esto evita penalizar una demanda cuando
  // un dato no está cargado.
  //
  // ========================================

  const criterios = [

    {
      comparar:
        compararPrecio,

      puntajeMaximo:
        50
    },

    {
      comparar:
        compararDormitorios,

      puntajeMaximo:
        CONFIG_DORMITORIOS.puntajeMaximo
    },

    {
      comparar:
        compararComodidades,

      puntajeMaximo:
        CONFIG_COMODIDADES.puntajeMaximo
    }

  ];


  // ========================================
  // 3. VARIABLES DEL RANKING
  // ========================================

  let puntajeObtenido = 0;

  let puntajeMaximoEvaluado = 0;

  const motivos = [];


  // ========================================
  // 4. EJECUTAR CRITERIOS
  // ========================================

  for (
    const criterio
    of criterios
  ) {

    const resultado =

      criterio.comparar(
        origen,
        destino
      );


    // --------------------------------------
    // SI EL CRITERIO NO DEVUELVE RESULTADO,
    // NO PARTICIPA DEL RANKING
    // --------------------------------------

    if (
      !resultado
    ) {

      continue;

    }


    // --------------------------------------
    // SI EL CRITERIO INDICA QUE NO PUEDE
    // EVALUARSE, NO SE SUMA A LA BASE
    // --------------------------------------
    //
    // Esto permite que un dato inexistente
    // no penalice artificialmente el ranking.
    //
    // --------------------------------------

    if (
      resultado.valido === false
    ) {

      continue;

    }


    // --------------------------------------
    // DETERMINAR SI EL CRITERIO REALMENTE
    // FUE COMPARADO
    // --------------------------------------
    //
    // Los motivos "sin comparar" indican
    // que ese criterio no debe formar parte
    // del denominador del ranking.
    //
    // --------------------------------------

    const motivoSinComparar =

      resultado.motivo &&

      resultado.motivo
        .toLowerCase()
        .includes(
          "sin comparar"
        );


    if (
      motivoSinComparar
    ) {

      // ------------------------------------
      // El criterio no se evalúa.
      // No suma puntos ni resta puntos.
      // ------------------------------------

      if (
        resultado.motivo
      ) {

        motivos.push(
          resultado.motivo
        );

      }

      continue;

    }


    // ======================================
    // SUMAR PUNTAJE OBTENIDO
    // ======================================

    puntajeObtenido +=

      Number(
        resultado.puntaje || 0
      );


    // ======================================
    // SUMAR MÁXIMO POSIBLE EVALUADO
    // ======================================

    puntajeMaximoEvaluado +=

      Number(
        criterio.puntajeMaximo || 0
      );


    // ======================================
    // GUARDAR MOTIVO
    // ======================================

    if (
      resultado.motivo &&
      resultado.motivo !== ""
    ) {

      motivos.push(
        resultado.motivo
      );

    }

  }


  // ========================================
  // 5. NORMALIZAR PUNTAJE A ESCALA 0-100
  // ========================================

  let puntajeNormalizado = 0;


  if (
    puntajeMaximoEvaluado > 0
  ) {

    puntajeNormalizado =

      Math.round(

        (
          puntajeObtenido /
          puntajeMaximoEvaluado
        ) *

        100

      );

  }


  // ========================================
  // 6. ASEGURAR RANGO 0-100
  // ========================================

  puntajeNormalizado =

    Math.max(

      0,

      Math.min(

        100,

        puntajeNormalizado

      )

    );


  // ========================================
  // 7. RESULTADO FINAL
  // ========================================

  return {

    valido: true,

    // --------------------------------------
    // Puntaje normalizado que se utilizará
    // para ordenar el ranking.
    // --------------------------------------

    puntaje:
      puntajeNormalizado,

    // --------------------------------------
    // Puntaje bruto, útil para diagnóstico
    // y futuras mejoras.
    // --------------------------------------

    puntajeBruto:
      puntajeObtenido,

    // --------------------------------------
    // Máximo posible de los criterios
    // realmente evaluados.
    // --------------------------------------

    puntajeMaximoEvaluado:
      puntajeMaximoEvaluado,

    // --------------------------------------
    // Porcentaje de coincidencia
    // --------------------------------------

    porcentajeCoincidencia:
      puntajeNormalizado,

    motivos,

    resumen:
      motivos.join(
        " | "
      )

  };

}

// ============================================================
// PROPIEDADES SIMILARES
// ============================================================
//
// Este módulo compara una propiedad publicada contra otras
// propiedades publicadas de la cartera.
//
// IMPORTANTE:
// - No utiliza los filtros obligatorios de Demandas.
// - No compara baños.
// - No compara superficies.
// - No compara ambientes todavía.
// - Genera un ranking de similitud.
// ============================================================


const CONFIG_SIMILARES = {

  precio: 50,

  dormitorios: 20,

  tipo: 20,

  comodidades: 10

};


// ============================================================
// COMPARAR TIPOS PARA PROPIEDADES SIMILARES
// ============================================================

function compararTipoSimilar(
  origen,
  destino
) {

  const tiposOrigen =
    String(
      origen.tipo || ""
    )
      .toLowerCase()
      .split(",")
      .map(
        tipo =>
          tipo
            .trim()
            .replace(/\s+/g, " ")
      )
      .filter(Boolean);


  const tiposDestino =
    String(
      destino.tipo || ""
    )
      .toLowerCase()
      .split(",")
      .map(
        tipo =>
          tipo
            .trim()
            .replace(/\s+/g, " ")
      )
      .filter(Boolean);


  if (
    tiposOrigen.length === 0 ||
    tiposDestino.length === 0
  ) {

    return {

      puntaje: 0,

      puntajeMaximo:
        CONFIG_SIMILARES.tipo,

      motivo:
        "Tipo: sin comparar"

    };

  }


  const coincidencias = [];


  for (
    const tipo
    of tiposOrigen
  ) {

    if (
      tiposDestino.includes(
        tipo
      )
    ) {

      coincidencias.push(
        tipo
      );

    }

  }


  if (
    coincidencias.length === 0
  ) {

    return {

      puntaje: 0,

      puntajeMaximo:
        CONFIG_SIMILARES.tipo,

      motivo:
        "Tipo de propiedad distinto"

    };

  }


  // Coincidencia exacta de tipo principal
  if (
    coincidencias.length ===
    tiposOrigen.length &&
    coincidencias.length ===
    tiposDestino.length
  ) {

    return {

      puntaje:
        CONFIG_SIMILARES.tipo,

      puntajeMaximo:
        CONFIG_SIMILARES.tipo,

      motivo:
        "Tipo de propiedad igual"

    };

  }


  // Existe coincidencia, pero una de las
  // propiedades tiene tipos adicionales.

  return {

    puntaje:
      Math.round(
        CONFIG_SIMILARES.tipo *
        0.70
      ),

    puntajeMaximo:
      CONFIG_SIMILARES.tipo,

    motivo:
      "Tipo compatible: " +
      coincidencias.join(", ")

  };

}


// ============================================================
// COMPARAR PRECIO PARA PROPIEDADES SIMILARES
// PUNTAJE MÁXIMO: 35
// ============================================================

function compararPrecioSimilar(
  origen,
  destino
) {

  // ----------------------------------------------------------
  // MONEDA
  // ----------------------------------------------------------

  const monedaOrigen =
    normalizarMonedaSimilar(
      origen.moneda
    );

  const monedaDestino =
    normalizarMonedaSimilar(
      destino.moneda
    );


  // ----------------------------------------------------------
  // MONEDA DESCONOCIDA
  // ----------------------------------------------------------

  if (
    monedaOrigen === "" ||
    monedaDestino === ""
  ) {

    return {

      valido: false,

      puntaje: 0,

      puntajeMaximo: 35,

      diferencia: null,

      motivo:
        "Moneda desconocida"

    };

  }


  // ----------------------------------------------------------
  // MONEDAS DIFERENTES
  // ----------------------------------------------------------

  if (
    monedaOrigen !==
    monedaDestino
  ) {

    return {

      valido: false,

      puntaje: 0,

      puntajeMaximo: 35,

      diferencia: null,

      motivo:
        "Moneda diferente: " +
        monedaOrigen +
        " vs " +
        monedaDestino

    };

  }


  // ----------------------------------------------------------
  // PRECIOS
  // ----------------------------------------------------------

  const precioOrigen =
    Number(
      origen.precio || 0
    );

  const precioDestino =
    Number(
      destino.precio || 0
    );


  // ----------------------------------------------------------
  // PRECIO INVÁLIDO
  // ----------------------------------------------------------

  if (
    !Number.isFinite(precioOrigen) ||
    !Number.isFinite(precioDestino) ||
    precioOrigen <= 0 ||
    precioDestino <= 0
  ) {

    return {

      valido: false,

      puntaje: 0,

      puntajeMaximo: 35,

      diferencia: null,

      motivo:
        "Precio: sin comparar"

    };

  }


  // ----------------------------------------------------------
  // DIFERENCIA PORCENTUAL
  // ----------------------------------------------------------

  const diferencia =
    Math.abs(
      precioDestino -
      precioOrigen
    );

  const porcentaje =
    (
      diferencia /
      precioOrigen
    ) * 100;


  // ----------------------------------------------------------
  // MÁS DE 35% → DESCARTAR
  // ----------------------------------------------------------

  if (
    porcentaje >
    35
  ) {

    return {

      valido: false,

      puntaje: 0,

      puntajeMaximo: 35,

      diferencia:
        porcentaje,

      motivo:
        "Precio " +
        (
          precioDestino >=
          precioOrigen
            ? "+"
            : "-"
        ) +
        porcentaje.toFixed(1) +
        "% fuera del rango"

    };

  }


  // ----------------------------------------------------------
  // PUNTAJE POR PROXIMIDAD
  // ----------------------------------------------------------

  let puntaje = 0;


  // 0% a 5%
  if (
    porcentaje <= 5
  ) {

    puntaje = 35;

  }

  // Más de 5% hasta 10%
  else if (
    porcentaje <= 10
  ) {

    puntaje = 31;

  }

  // Más de 10% hasta 15%
  else if (
    porcentaje <= 15
  ) {

    puntaje = 27;

  }

  // Más de 15% hasta 20%
  else if (
    porcentaje <= 20
  ) {

    puntaje = 24;

  }

  // Más de 20% hasta 30%
  else if (
    porcentaje <= 30
  ) {

    puntaje = 18;

  }

  // Más de 30% hasta 35%
  else {

    puntaje = 10;

  }


  // ----------------------------------------------------------
  // MOTIVO
  // ----------------------------------------------------------

  const signo =
    precioDestino >=
    precioOrigen
      ? "+"
      : "-";


  // ----------------------------------------------------------
  // RESULTADO
  // ----------------------------------------------------------

  return {

    valido: true,

    puntaje,

    puntajeMaximo: 35,

    diferencia:
      porcentaje,

    motivo:
      porcentaje === 0
        ? "Precio igual"
        : "Precio " +
          signo +
          porcentaje.toFixed(1) +
          "%"

  };

}

// ============================================================
// COMPARAR DORMITORIOS PARA PROPIEDADES SIMILARES
// ============================================================

function compararDormitoriosSimilar(
  origen,
  destino
) {

  const tiposComparables = [

    "casa",
    "casaquinta",
    "quinta",
    "departamento"

  ];


  const tiposOrigen =
    String(
      origen.tipo || ""
    )
      .toLowerCase()
      .split(",")
      .map(
        tipo =>
          tipo
            .trim()
            .replace(/\s+/g, " ")
      )
      .filter(Boolean);


  const tiposDestino =
    String(
      destino.tipo || ""
    )
      .toLowerCase()
      .split(",")
      .map(
        tipo =>
          tipo
            .trim()
            .replace(/\s+/g, " ")
      )
      .filter(Boolean);


  const origenEsComparable =
    tiposOrigen.some(
      tipo =>
        tiposComparables.includes(
          tipo
        )
    );


  const destinoEsComparable =
    tiposDestino.some(
      tipo =>
        tiposComparables.includes(
          tipo
        )
    );


  if (
    !origenEsComparable ||
    !destinoEsComparable
  ) {

    return {

      puntaje: 0,

      puntajeMaximo:
        CONFIG_SIMILARES.dormitorios,

      motivo:
        "Dormitorios: sin comparar"

    };

  }


  const dormitoriosOrigen =
    Number(
      origen.dormitorios || 0
    );


  const dormitoriosDestino =
    Number(
      destino.dormitorios || 0
    );


  if (
    dormitoriosOrigen <= 0 ||
    dormitoriosDestino <= 0
  ) {

    return {

      puntaje: 0,

      puntajeMaximo:
        CONFIG_SIMILARES.dormitorios,

      motivo:
        "Dormitorios: sin comparar"

    };

  }


  const diferencia =
    Math.abs(
      dormitoriosOrigen -
      dormitoriosDestino
    );


  if (
    diferencia === 0
  ) {

    return {

      puntaje:
        CONFIG_SIMILARES.dormitorios,

      puntajeMaximo:
        CONFIG_SIMILARES.dormitorios,

      motivo:
        "Dormitorios iguales"

    };

  }


  if (
    diferencia === 1
  ) {

    return {

      puntaje:
        Math.round(
          CONFIG_SIMILARES.dormitorios *
          0.70
        ),

      puntajeMaximo:
        CONFIG_SIMILARES.dormitorios,

      motivo:
        "Dormitorios con 1 de diferencia"

    };

  }


  if (
    diferencia === 2
  ) {

    return {

      puntaje:
        Math.round(
          CONFIG_SIMILARES.dormitorios *
          0.40
        ),

      puntajeMaximo:
        CONFIG_SIMILARES.dormitorios,

      motivo:
        "Dormitorios con 2 de diferencia"

    };

  }


  return {

    puntaje: 0,

    puntajeMaximo:
      CONFIG_SIMILARES.dormitorios,

    motivo:
      "Dormitorios muy diferentes"

  };

}


// ============================================================
// COMPARAR COMODIDADES PARA PROPIEDADES SIMILARES
// ============================================================

function compararComodidadesSimilar(
  origen,
  destino
) {

  const origenLista = [];


  const destinoLista = [];


  if (
    origen.patio
  ) {

    origenLista.push(
      "patio"
    );

  }


  if (
    origen.garage
  ) {

    origenLista.push(
      "garage"
    );

  }


  if (
    origen.pileta
  ) {

    origenLista.push(
      "pileta"
    );

  }


  if (
    destino.patio
  ) {

    destinoLista.push(
      "patio"
    );

  }


  if (
    destino.garage
  ) {

    destinoLista.push(
      "garage"
    );

  }


  if (
    destino.pileta
  ) {

    destinoLista.push(
      "pileta"
    );

  }


  if (
    origenLista.length === 0
  ) {

    return {

      puntaje:
        CONFIG_SIMILARES.comodidades,

      puntajeMaximo:
        CONFIG_SIMILARES.comodidades,

      motivo:
        "Comodidades: sin requerimientos"

    };

  }


  const coincidencias =
    origenLista.filter(
      comodidad =>
        destinoLista.includes(
          comodidad
        )
    );


  const porcentaje =
    coincidencias.length /
    origenLista.length;


  const puntaje =
    Math.round(
      CONFIG_SIMILARES.comodidades *
      porcentaje
    );


  if (
    coincidencias.length === 0
  ) {

    return {

      puntaje: 0,

      puntajeMaximo:
        CONFIG_SIMILARES.comodidades,

      motivo:
        "Comodidades: sin coincidencias"

    };

  }


  return {

    puntaje,

    puntajeMaximo:
      CONFIG_SIMILARES.comodidades,

    motivo:
      "Comodidades: " +
      coincidencias.join(", ")

  };

}


// ============================================================
// COMPARAR PROPIEDADES SIMILARES
// ============================================================

function compararPropiedadesSimilares(
  origen,
  destino
) {

  // --------------------------------
  // PROPIEDAD DE ORIGEN
  // --------------------------------

  if (
    !origen ||
    !origen.id
  ) {

    return {

      valido: false,

      puntaje: 0,

      motivo:
        "Propiedad de origen inválida"

    };

  }


  // --------------------------------
  // PROPIEDAD DESTINO
  // --------------------------------

  if (
    !destino ||
    !destino.id
  ) {

    return {

      valido: false,

      puntaje: 0,

      motivo:
        "Propiedad destino inválida"

    };

  }


  // --------------------------------
  // NO COMPARAR LA PROPIEDAD
  // CONSIGO MISMA
  // --------------------------------

  if (
    String(origen.id) ===
    String(destino.id)
  ) {

    return {

      valido: false,

      puntaje: 0,

      motivo:
        "Misma propiedad"

    };

  }


  // --------------------------------
  // SOLO PROPIEDADES PUBLICADAS
  // --------------------------------

  if (
    destino.publicado !==
    "Publicado"
  ) {

    return {

      valido: false,

      puntaje: 0,

      motivo:
        "No publicada"

    };

  }


  // --------------------------------
  // MISMA OPERACIÓN
  // --------------------------------

  if (
    origen.operacion !==
    destino.operacion
  ) {

    return {

      valido: false,

      puntaje: 0,

      motivo:
        "Operación distinta"

    };

  }


  // --------------------------------
  // MISMA CIUDAD
  // --------------------------------

  if (
    origen.ciudad !==
    destino.ciudad
  ) {

    return {

      valido: false,

      puntaje: 0,

      motivo:
        "Ciudad distinta"

    };

  }


  // --------------------------------
  // TIPO
  // --------------------------------

  const resultadoTipo =
    compararTipoSimilar(
      origen,
      destino
    );


  if (
    resultadoTipo.puntaje <= 0
  ) {

    return {

      valido: false,

      puntaje: 0,

      motivo:
        resultadoTipo.motivo

    };

  }


  // --------------------------------
  // COMPARADORES
  // --------------------------------

  const resultados = [

    compararPrecioSimilar(
      origen,
      destino
    ),

    compararDormitoriosSimilar(
      origen,
      destino
    ),

    compararComodidadesSimilar(
      origen,
      destino
    )

  ];


  let puntajeObtenido = 0;

  let puntajeMaximoEvaluado = 0;

  const motivos = [];


  for (
    const resultado
    of resultados
  ) {

    if (
      !resultado
    ) {

      continue;

    }


    const sinComparar =
      resultado.motivo &&
      resultado.motivo
        .toLowerCase()
        .includes(
          "sin comparar"
        );


    if (
      sinComparar
    ) {

      continue;

    }


    puntajeObtenido +=
      Number(
        resultado.puntaje || 0
      );


    puntajeMaximoEvaluado +=
      Number(
        resultado.puntajeMaximo || 0
      );


    if (
      resultado.motivo
    ) {

      motivos.push(
        resultado.motivo
      );

    }

  }


  // --------------------------------
  // SUMAR TIPO
  // --------------------------------

  puntajeObtenido +=
    resultadoTipo.puntaje;


  puntajeMaximoEvaluado +=
    resultadoTipo.puntajeMaximo;


  motivos.unshift(
    resultadoTipo.motivo
  );


  // --------------------------------
  // NORMALIZAR
  // --------------------------------

  let puntaje =
    0;


  if (
    puntajeMaximoEvaluado > 0
  ) {

    puntaje =
      Math.round(
        (
          puntajeObtenido /
          puntajeMaximoEvaluado
        ) *
        100
      );

  }


  puntaje =
    Math.max(
      0,
      Math.min(
        100,
        puntaje
      )
    );


  return {

    valido: true,

    puntaje,

    puntajeBruto:
      puntajeObtenido,

    puntajeMaximoEvaluado,

    motivos,

    resumen:
      motivos.join(
        " | "
      )

  };

}
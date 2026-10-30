function obtenerNumeroNormalizado(valor) {

  if (
    valor === null ||
    valor === undefined
  ) {

    return 0;

  }

  const texto =
    String(valor);

  const coincidencia =
    texto.match(
      /^\s*(\d+(?:[.,]\d+)?)/
    );

  if (
    !coincidencia
  ) {

    return 0;

  }

  const numero =
    Number(
      coincidencia[1]
        .replace(",", ".")
    );

  if (
    isNaN(numero)
  ) {

    return 0;

  }

  return Math.round(numero);

}

function obtenerListaNormalizada(valor) {

  if (
    valor === null ||
    valor === undefined
  ) {

    return [];

  }

  return String(valor)

    .toLowerCase()

    .replace(/\./g, ",")

    .split(",")

    .map(v => v.trim())

    .filter(v => v !== "");

}
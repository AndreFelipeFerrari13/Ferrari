export function carregarContas() {
  try {
    const dados = localStorage.getItem("ferrari_contas");
    return dados ? JSON.parse(dados) : [];
  } catch {
    return [];
  }
}

export function moeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatarData(data) {
  if (!data) return "-";

  const texto = String(data);

  if (texto.includes("-")) {
    const partes = texto.split("-");

    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
  }

  return texto;
}

export function normalizarTexto(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function paisCombina(contaPais, filtroPais) {
  if (filtroPais === "Todos") {
    return true;
  }

  const paisConta = normalizarTexto(contaPais);
  const filtro = normalizarTexto(filtroPais);

  if (filtro === "eua") {
    return (
      paisConta === "eua" ||
      paisConta === "estados unidos" ||
      paisConta === "usa"
    );
  }

  return paisConta === filtro;
}

export function valorDaLinha(linha, nomesPossiveis) {
  const mapa = {};

  Object.keys(linha).forEach((chave) => {
    mapa[normalizarTexto(chave)] = linha[chave];
  });

  for (const nome of nomesPossiveis) {
    const chaveNormalizada = normalizarTexto(nome);

    if (mapa[chaveNormalizada] !== undefined) {
      return String(mapa[chaveNormalizada] || "").trim();
    }
  }

  return "";
}

export function extrairAnoMes(data) {
  if (!data) {
    return null;
  }

  const texto = String(data).trim();

  if (texto.includes("/")) {
    const partes = texto.split("/");

    if (partes.length === 3) {
      const dia = Number(partes[0]);
      const mes = Number(partes[1]);
      const ano = Number(partes[2]);

      if (
        !Number.isNaN(dia) &&
        !Number.isNaN(mes) &&
        !Number.isNaN(ano)
      ) {
        return { ano, mes };
      }
    }
  }

  if (texto.includes("-")) {
    const partes = texto.split("-");

    if (partes.length === 3) {
      const ano = Number(partes[0]);
      const mes = Number(partes[1]);

      if (!Number.isNaN(ano) && !Number.isNaN(mes)) {
        return { ano, mes };
      }
    }
  }

  return null;
}

const PAGE_SIZE = 10; // Número de registros por página

/**
 * Registra uma nova doação, agora com um ID único.
 */
function registrarDoacao(dados) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      DOACOES_CADASTRO_SHEET_NAME
    );
    const novoId = Utilities.getUuid(); // Gera um ID único para a doação
    sheet.appendRow([
      dados.doacao,
      dados.dataRecebimento,
      dados.recebidoPorNome,
      dados.recebidoPorId,
      dados.dataEntrega,
      novoId,
    ]);
    return "Doação registrada com sucesso!";
  } catch (e) {
    /* ... */
  }
}

function consultarDoacoes(filtros) {
  try {
    filtros = filtros || {};
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      DOACOES_CADASTRO_SHEET_NAME
    );
    const allData = sheet.getDataRange().getValues();
    allData.shift(); // Remove o cabeçalho

    // 1. Filtragem por data e status de entrega
    let filteredData = allData.filter((row) => {
      // --- Date filtering (existing logic) ---
      if (!row[1]) return false; // Ignora linhas sem data de recebimento (Column B)
      const dataRecebimento = new Date(row[1]);
      if (isNaN(dataRecebimento.getTime())) return false;

      const startDate = filtros.startDate
        ? new Date(filtros.startDate + "T00:00:00")
        : null;
      const endDate = filtros.endDate
        ? new Date(filtros.endDate + "T23:59:59")
        : null;

      if (startDate && dataRecebimento < startDate) return false;
      if (endDate && dataRecebimento > endDate) return false;

      // --- NEW FILTER LOGIC FOR PENDING DELIVERIES ---
      // If the 'pendentes' checkbox is checked (true)...
      if (filtros.pendentes) {
        // ...and the delivery date column (Column E, index 4) has a value...
        if (row[4]) {
          // ...then filter this row OUT.
          return false;
        }
      }

      return true; // Keep the row if it passes all checks
    });

    const totalRecords = filteredData.length;

    // --- 2. Paginação e 3. Formatação (no changes needed here) ---
    const page = filtros.page || 1;
    const startIndex = (page - 1) * PAGE_SIZE;
    const pagedData = filteredData.slice(startIndex, startIndex + PAGE_SIZE);

    const doacoes = pagedData.map((row) => ({
      doacao: row[0],
      dataRecebimento: new Date(row[1]).toLocaleDateString("pt-BR"),
      recebidoPor: row[2],
      idUnicoResponsavel: row[3],
      dataEntrega: row[4]
        ? Utilities.formatDate(
            new Date(row[4]),
            Session.getScriptTimeZone(),
            "yyyy-MM-dd"
          )
        : "",
      id: row[5],
    }));

    Logger.log(doacoes);
    return {
      doacoes: doacoes,
      totalRecords: totalRecords,
      pageSize: PAGE_SIZE,
      currentPage: page,
    };
  } catch (e) {
    Logger.log("Erro em consultarDoacoes: " + e.message);
    return { error: "Erro no servidor ao consultar doações: " + e.message };
  }
}

/**
 * ✅ NOVA FUNÇÃO: Atualiza uma doação existente.
 */
function atualizarDoacao(dados) {
  if (!dados || !dados.doacaoId) {
    return "Erro: ID da doação não fornecido.";
  }
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      DOACOES_CADASTRO_SHEET_NAME
    );
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][5] === dados.doacaoId) {
        // Encontra a linha pelo ID da doação
        const linhaParaAtualizar = i + 1;
        // Atualiza as colunas: Recebido Por (Nome), ID_Unico (do Responsável), Data da Entrega
        sheet.getRange(linhaParaAtualizar, 3).setValue(dados.recebidoPorNome);
        sheet.getRange(linhaParaAtualizar, 4).setValue(dados.recebidoPorId);
        sheet.getRange(linhaParaAtualizar, 5).setValue(dados.dataEntrega);
        return "Registro atualizado com sucesso!";
      }
    }
    return "Erro: Registro de doação não encontrado.";
  } catch (e) {
    Logger.log("Erro em atualizarDoacao: " + e.message);
    return "Erro no servidor ao atualizar a doação.";
  }
}

/**
 * Lista todos os Responsáveis (nome e ID) de forma otimizada.
 * @returns {Array<{name: string, id: string}>}
 */
function listarResponsaveisComId() {
  try {
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
        ATENDIDOS_SHEET_NAME
      );
    const allData = sheet.getDataRange().getValues();
    allData.shift(); // Remove o cabeçalho

    const responsaveis = allData
      .map((row) => ({
        id: row[COLUMNS.ID_UNICO - 1],
        // FIX: Ensure the 'name' property is always a string before sorting
        name: String(row[COLUMNS.RESP_NOME_COMPLETO - 1]),
      }))
      .filter((r) => r.id && r.name)
      .sort((a, b) => a.name.localeCompare(b.name));

    Logger.log(responsaveis);
    return responsaveis;
  } catch (e) {
    Logger.log("Erro em listarResponsaveisComId: " + e.message);
    return [];
  }
}

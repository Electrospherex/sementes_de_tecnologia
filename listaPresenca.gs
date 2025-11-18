/**
 * Busca na planilha principal e retorna uma lista com os nomes de todos os ATENDIDOS
 * que estão marcados como "Ativo" na coluna 101.
 * @returns {Array<string>} Uma lista de nomes de atendidos ativos.
 */
function listarAtendidosAtivos() {
  try {
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
        ATENDIDOS_SHEET_NAME
      );
    const data = sheet.getDataRange().getValues();
    const atendidosAtivos = [];

    // Começa em i = 1 para pular o cabeçalho
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const isAtivo = row[145]; // Coluna 101 (índice 100) - ATIVO
      Logger.log("ATIVO: " + isAtivo);
      // ✅ Altere "Sim" se você usar outro valor para marcar um atendido como ativo (ex: TRUE)
      if (isAtivo === "S") {
        // Verifica as colunas de nome dos atendidos e adiciona à lista se não estiverem vazias
        if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_1 - 1])
          atendidosAtivos.push(row[COLUMNS.NOME_COMPLETO_ATENDIDO_1 - 1]);
        if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_2 - 1])
          atendidosAtivos.push(row[COLUMNS.NOME_COMPLETO_ATENDIDO_2 - 1]);
        if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_3 - 1])
          atendidosAtivos.push(row[COLUMNS.NOME_COMPLETO_ATENDIDO_3 - 1]);
        if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_4 - 1])
          atendidosAtivos.push(row[COLUMNS.NOME_COMPLETO_ATENDIDO_4 - 1]);
        if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_5 - 1])
          atendidosAtivos.push(row[COLUMNS.NOME_COMPLETO_ATENDIDO_5 - 1]);
      }
    }
    Logger.log([...new Set(atendidosAtivos)].sort());
    return [...new Set(atendidosAtivos)].sort();
  } catch (e) {
    Logger.log("Erro em listarAtendidosAtivos: " + e.message);
    return [];
  }
}

/**
 * Salva os dados da lista de presença, com validação para evitar duplicatas.
 */
// In your .gs file

function salvarPresenca(dados) {
  try {
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PRESENCA_SHEET_NAME);

    // Create a new Date object to get a standard timestamp
    const timestamp = new Date();

    // Loop through the filtered 'presencas' array
    dados.presencas.forEach((p) => {
      // Append the new row with the correct status
      // Assumes columns are: A: Data, B: Turno, C: Nome, D: Status
      sheet.appendRow([
        dados.date,
        p.name,
        p.status, // Use p.status directly
        dados.turno,
        p.observacoes,
      ]);
    });

    return "Presença salva com sucesso!";
  } catch (e) {
    Logger.log("Erro ao salvar presença: " + e.message);
    return "Erro: " + e.message;
  }
}

function consultarPresenca(consulta) {
  if (!consulta || !consulta.date || !consulta.turno) {
    return { error: "Dados inválidos para a consulta." };
  }

  try {
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PRESENCA_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const resultados = [];

    // ✅ SOLUÇÃO DEFINITIVA PARA DATAS
    // A data do formulário já vem como 'yyyy-MM-dd' (ex: '2025-10-15'). Vamos usá-la diretamente para a comparação.
    const dateToCompare = consulta.date;

    // Começa em 1 para pular o cabeçalho
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const dateFromSheet = new Date(row[0]); // Pega a data da Coluna A

      // Garante que a data da planilha é válida antes de formatar
      if (!isNaN(dateFromSheet.getTime())) {
        // Converte a data da planilha para o mesmo formato 'yyyy-MM-dd' usando o fuso horário UTC.
        // Isso remove qualquer influência do fuso horário local, garantindo uma comparação exata da data.
        const rowDateString = Utilities.formatDate(
          dateFromSheet,
          "UTC",
          "yyyy-MM-dd"
        );
        const rowTurno = row[3]; // Coluna D: Turno

        // Compara as duas strings de data
        if (rowDateString === dateToCompare && rowTurno === consulta.turno) {
          resultados.push({
            name: row[1], // Coluna B: Nome Completo
            status: row[2], // Coluna C: Presenca,
            observacoes: row[4],
          });
        }
      }
    }
    Logger.log(resultados);
    return resultados.sort((a, b) => a.name.localeCompare(b.name));
  } catch (e) {
    Logger.log("Erro em consultarPresenca: " + e.message);
    return { error: "Erro no servidor ao consultar a presença." };
  }
}

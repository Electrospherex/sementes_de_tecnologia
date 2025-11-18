/**
 * Lista todos os Responsáveis, incluindo os nomes dos seus atendidos na string de exibição.
 * @returns {Array<{displayName: string, searchName: string}>}
 */
function listarBeneficiarios() {
  try {
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
        ATENDIDOS_SHEET_NAME
      );
    const allData = sheet.getDataRange().getValues();
    allData.shift(); // Remove o cabeçalho

    const beneficiarios = allData
      .map((row) => {
        // FIX: Ensure the name from the sheet is always treated as a string
        const responsavelName = String(row[COLUMNS.RESP_NOME_COMPLETO - 1]);

        if (!responsavelName) {
          return null;
        }

        const atendidos = [];
        if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_1 - 1])
          atendidos.push(row[COLUMNS.NOME_COMPLETO_ATENDIDO_1 - 1]);
        if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_2 - 1])
          atendidos.push(row[COLUMNS.NOME_COMPLETO_ATENDIDO_2 - 1]);
        if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_3 - 1])
          atendidos.push(row[COLUMNS.NOME_COMPLETO_ATENDIDO_3 - 1]);
        if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_4 - 1])
          atendidos.push(row[COLUMNS.NOME_COMPLETO_ATENDIDO_4 - 1]);
        if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_5 - 1])
          atendidos.push(row[COLUMNS.NOME_COMPLETO_ATENDIDO_5 - 1]);

        let displayName = responsavelName;
        if (atendidos.length > 0) {
          displayName = `${responsavelName} (Atendidos: ${atendidos.join(
            ", "
          )})`;
        }

        return {
          displayName: displayName,
          searchName: responsavelName,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
    Logger.log(beneficiarios);
    return beneficiarios;
  } catch (e) {
    Logger.log("Erro em listarBeneficiarios: " + e.message);
    return [];
  }
}

// In your .gs file for atendidos

function buscarBeneficiario(nome) {
  Logger.log(`--- Iniciando busca para o nome: "${nome}" ---`);
  if (!nome) {
    return { error: "Nome não fornecido." };
  }

  try {
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
        ATENDIDOS_SHEET_NAME
      );
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const nomeNaPlanilha = row[COLUMNS.RESP_NOME_COMPLETO - 1];

      if (typeof nomeNaPlanilha === "string" && nomeNaPlanilha) {
        if (nomeNaPlanilha.trim().toLowerCase() === nome.trim().toLowerCase()) {
          Logger.log(
            `CORRESPONDÊNCIA ENCONTRADA na linha da planilha ${i + 1}.`
          );

          // --- THIS IS THE CORRECTED LOGIC ---
          const result = {};
          for (const key in COLUMNS) {
            // Use the map to find the correct HTML ID for the current column key
            const htmlId = COLUMNS_TO_HTML_IDS[key];

            // If a mapping exists, add the data to our result object
            if (htmlId) {
              const columnIndex = COLUMNS[key] - 1;
              let cellValue = row[columnIndex];

              // Format dates correctly for HTML date inputs
              if (cellValue instanceof Date) {
                // Assuming formatDate returns 'YYYY-MM-DD'
                result[htmlId] = Utilities.formatDate(
                  cellValue,
                  Session.getScriptTimeZone(),
                  "yyyy-MM-dd"
                );
              } else {
                result[htmlId] = cellValue;
              }
            }
          }

          // Add the ID_UNICO separately as it's crucial for updates but not a standard form field
          result.idUnico = row[COLUMNS.ID_UNICO - 1];

          Logger.log("--- FIM DA BUSCA. Objeto final a ser enviado: ---");
          return result;
        }
      }
    }

    Logger.log("Nenhuma correspondência encontrada para o nome.");
    return { error: "Responsável não encontrado." };
  } catch (e) {
    Logger.log("!!! ERRO GERAL na função buscarBeneficiario: " + e.message);
    return { error: "Ocorreu um erro no servidor: " + e.message };
  }
}

/**
 * Atualiza os dados de um beneficiário de forma dinâmica e correta,
 * usando o mapa COLUMNS_TO_HTML_IDS para encontrar as colunas certas.
 */
function atualizarBeneficiario(dados) {
  try {
    Logger.log(dados);
    if (!dados.idUnico) {
      // The client must send the unique ID
      return "Erro: ID_Unico do responsável não foi encontrado para atualização.";
    }

    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
        ATENDIDOS_SHEET_NAME
      );
    const idColumnValues = sheet
      .getRange(2, COLUMNS.ID_UNICO, sheet.getLastRow() - 1, 1)
      .getValues();
    let rowFound = -1;

    for (let i = 0; i < idColumnValues.length; i++) {
      if (idColumnValues[i][0] === dados.idUnico) {
        rowFound = i + 2; // +2 because sheet rows are 1-based and we started at row 2
        break;
      }
    }

    if (rowFound === -1) {
      return "Erro: Responsável não encontrado para atualização usando o ID_Unico.";
    }

    // --- Corrected Dynamic Update Loop ---
    // Loop through the mapping object to find the right columns.
    for (const snakeCaseKey in COLUMNS_TO_HTML_IDS) {
      const htmlId = COLUMNS_TO_HTML_IDS[snakeCaseKey];

      // Check if the incoming data object has a value for this htmlId
      if (dados.hasOwnProperty(htmlId)) {
        const valueToSet = dados[htmlId];
        const columnNumber = COLUMNS[snakeCaseKey];

        // Update the specific cell
        sheet.getRange(rowFound, columnNumber).setValue(valueToSet);
      }
    }

    return "Dados atualizados com sucesso!";
  } catch (e) {
    Logger.log("Erro em atualizarBeneficiario: " + e.message);
    return "Ocorreu um erro no servidor ao tentar atualizar: " + e.message;
  }
}

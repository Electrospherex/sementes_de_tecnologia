/**
 * Lista todos os voluntários (nome e ID) para popular o dropdown.
 * @returns {Array<{name: string, id: string}>}
 */
function listarVoluntarios() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      VOLUNTARIOS_SHEET_NAME
    );
    const lastRow = sheet.getLastRow();

    // ✅ SAFETY CHECK: If there are no data rows (only a header or empty), return an empty list immediately.
    if (lastRow < 2) {
      return [];
    }

    // Correctly calculate the number of data rows to read
    const numRows = lastRow - 1;
    // ✅ CORRIGIDO: Começa na coluna 2 (Nome) e lê 16 colunas para incluir a coluna 17 (ID).
    const range = sheet.getRange(
      2,
      VOLUNTARIO_COLUMNS.NOME_COMPLETO,
      numRows,
      17
    );
    const values = range.getValues();
    Logger.log("VOLUNTARIOS LOG: " + values);
    const voluntarios = values
      .map((row) => ({ id: row[16], name: row[0] }))
      .filter((v) => v.id && v.name)
      .sort((a, b) => String(a.name).localeCompare(String(b.name)));
    Logger.log("VOLUNTARIOS: " + voluntarios);
    return voluntarios;
  } catch (e) {
    Logger.log("Erro em listarVoluntarios: " + e.message);
    return [];
  }
}

/**
 * Função de teste para depurar a listagem de voluntários.
 */
function testarListagemDeVoluntarios() {
  // 1. Chama a sua função original
  const resultado = listarVoluntarios();

  // 2. Loga o resultado exato para a gente poder ver
  Logger.log("--- INÍCIO DO TESTE DE LISTAGEM DE VOLUNTÁRIOS ---");
  Logger.log("A função listarVoluntarios() retornou o seguinte:");
  Logger.log(JSON.stringify(resultado, null, 2)); // Mostra o resultado formatado

  // 3. Verifica o resultado e mostra um alerta
  if (resultado && resultado.length > 0) {
    Logger.log(
      "SUCESSO: A função encontrou " + resultado.length + " voluntários."
    );
    SpreadsheetApp.getUi().alert(
      "SUCESSO: A função encontrou " +
        resultado.length +
        " voluntários. Verifique o log para detalhes."
    );
  } else {
    Logger.log("FALHA: A função retornou uma lista vazia ou nula.");
    SpreadsheetApp.getUi().alert(
      "FALHA: A função não encontrou nenhum voluntário. Verifique os logs (Exibir > Registros) e confira os nomes das suas abas e colunas no arquivo Constants.gs."
    );
  }
  Logger.log("--- FIM DO TESTE ---");
}

/**
 * Busca os dados de um voluntário específico pelo seu ID único.
 * @param {string} id O ID único do voluntário.
 * @returns {object} Um objeto com os dados do voluntário ou um objeto de erro.
 */
function buscarVoluntarioPorId(id) {
  Logger.log("TESTEEEE");
  if (!id) {
    return { error: "ID do voluntário не foi fornecido." };
  }

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      VOLUNTARIOS_SHEET_NAME
    );
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][VOLUNTARIO_COLUMNS.ID_UNICO - 1] === id) {
        const row = data[i];
        return {
          voluntarioIdUnico: row[VOLUNTARIO_COLUMNS.ID_UNICO - 1],
          voluntarioNomeCompleto: row[VOLUNTARIO_COLUMNS.NOME_COMPLETO - 1],
          voluntarioCpf: row[VOLUNTARIO_COLUMNS.CPF - 1],
          voluntarioRg: row[VOLUNTARIO_COLUMNS.RG - 1],
          voluntarioNacionalidade: row[VOLUNTARIO_COLUMNS.NACIONALIDADE - 1],
          voluntarioAtividade: row[VOLUNTARIO_COLUMNS.ATIVIDADE - 1],
          voluntarioEndereco: row[VOLUNTARIO_COLUMNS.ENDERECO - 1],
          voluntarioBairro: row[VOLUNTARIO_COLUMNS.BAIRRO - 1],
          voluntarioCidade: row[VOLUNTARIO_COLUMNS.CIDADE - 1],
          voluntarioEstado: row[VOLUNTARIO_COLUMNS.ESTADO - 1],
          voluntarioDataNascimento: formatDate(
            row[VOLUNTARIO_COLUMNS.DATA_NASCIMENTO - 1]
          ),
          voluntarioJaFoi: row[VOLUNTARIO_COLUMNS.JA_FOI - 1],
          voluntarioDisponibilidade:
            row[VOLUNTARIO_COLUMNS.DISPONIBILIDADE - 1],
          voluntarioDias: row[VOLUNTARIO_COLUMNS.DIAS - 1],
          voluntarioEscolaridade: row[VOLUNTARIO_COLUMNS.ESCOLARIDADE - 1],
          voluntarioReligiao: row[VOLUNTARIO_COLUMNS.RELIGIAO - 1],
          voluntarioReligiao: row[VOLUNTARIO_COLUMNS.CONTRIBUICAO - 1],
          voluntarioAtivo: row[VOLUNTARIO_COLUMNS.ATIVO - 1],
        };
      }
    }
    return { error: "Voluntário não encontrado." };
  } catch (e) {
    Logger.log("Erro em buscarVoluntarioPorId: " + e.message);
    return { error: "Ocorreu um erro no servidor: " + e.message };
  }
}

/**
 * Atualiza os dados de um voluntário na planilha.
 * @param {object} dados Um objeto contendo todos os dados do formulário do voluntário.
 * @returns {string} Uma mensagem de sucesso ou erro.
 */
function atualizarVoluntario(dados) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      VOLUNTARIOS_SHEET_NAME
    );
    const data = sheet.getDataRange().getValues();
    let rowFound = -1;

    for (let i = 1; i < data.length; i++) {
      if (
        data[i][VOLUNTARIO_COLUMNS.ID_UNICO - 1] === dados.voluntarioIdUnico
      ) {
        rowFound = i + 1; // Linha da planilha é base 1
        break;
      }
    }

    if (rowFound === -1) {
      return "Erro: Voluntário não encontrado para atualização.";
    }

    // Atualiza cada célula correspondente
    sheet
      .getRange(rowFound, VOLUNTARIO_COLUMNS.NOME_COMPLETO)
      .setValue(dados.voluntarioNomeCompleto);
    sheet
      .getRange(rowFound, VOLUNTARIO_COLUMNS.CPF)
      .setValue(dados.voluntarioCpf);
    sheet
      .getRange(rowFound, VOLUNTARIO_COLUMNS.RG)
      .setValue(dados.voluntarioRg);
    sheet
      .getRange(rowFound, VOLUNTARIO_COLUMNS.NACIONALIDADE)
      .setValue(dados.voluntarioNacionalidade);
    sheet
      .getRange(rowFound, VOLUNTARIO_COLUMNS.ATIVIDADE)
      .setValue(dados.voluntarioAtividade);
    sheet
      .getRange(rowFound, VOLUNTARIO_COLUMNS.ENDERECO)
      .setValue(dados.voluntarioEndereco);
    sheet
      .getRange(rowFound, VOLUNTARIO_COLUMNS.BAIRRO)
      .setValue(dados.voluntarioBairro);
    sheet
      .getRange(rowFound, VOLUNTARIO_COLUMNS.CIDADE)
      .setValue(dados.voluntarioCidade);
    sheet
      .getRange(rowFound, VOLUNTARIO_COLUMNS.ESTADO)
      .setValue(dados.voluntarioEstado);
    sheet
      .getRange(rowFound, VOLUNTARIO_COLUMNS.DATA_NASCIMENTO)
      .setValue(dados.voluntarioDataNascimento);
    sheet
      .getRange(rowFound, VOLUNTARIO_COLUMNS.JA_FOI)
      .setValue(dados.voluntarioJaFoi);
    sheet
      .getRange(rowFound, VOLUNTARIO_COLUMNS.DISPONIBILIDADE)
      .setValue(dados.voluntarioDisponibilidade);
    sheet
      .getRange(rowFound, VOLUNTARIO_COLUMNS.DIAS)
      .setValue(dados.voluntarioDias);
    sheet
      .getRange(rowFound, VOLUNTARIO_COLUMNS.ESCOLARIDADE)
      .setValue(dados.voluntarioEscolaridade);
    sheet
      .getRange(rowFound, VOLUNTARIO_COLUMNS.RELIGIAO)
      .setValue(dados.voluntarioReligiao);
    sheet
      .getRange(rowFound, VOLUNTARIO_COLUMNS.CONTRIBUICAO)
      .setValue(dados.voluntarioContribuicao);
    sheet
      .getRange(rowFound, VOLUNTARIO_COLUMNS.ATIVO)
      .setValue(dados.voluntarioAtivo);

    return "Dados do voluntário atualizados com sucesso!";
  } catch (e) {
    Logger.log("Erro em atualizarVoluntario: " + e.message);
    return "Ocorreu um erro no servidor ao tentar atualizar: " + e.message;
  }
}

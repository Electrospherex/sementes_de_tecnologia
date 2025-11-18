/**
 * ESTA É A ÚNICA FUNÇÃO QUE SERÁ ACIONADA PELO GATILHO.
 * Ela funciona como um "recepcionista" que direciona a tarefa.
 */
function aoEnviarFormularioUnificado(e) {
  // Descobre em qual aba a nova linha foi adicionada
  const abaAtiva = e.range.getSheet().getName();

  // Verifica o nome da aba e chama a função correta
  if (abaAtiva === ATENDIDOS_SHEET_NAME) {
    Logger.log("Novo registro de ATENDIDO detectado. Gerando ID...");
    gerarIdParaAtendido(e);
  } else if (abaAtiva === VOLUNTARIOS_SHEET_NAME) {
    Logger.log("Novo registro de VOLUNTÁRIO detectado. Gerando ID...");
    gerarIdParaVoluntario(e);
  }
}

/**
 * Lógica para adicionar o ID único para um novo ATENDIDO.
 */
function gerarIdParaAtendido(e) {
  const sheet = e.source.getSheetByName(ATENDIDOS_SHEET_NAME);
  const linhaEditada = e.range.getRow();

  // Exemplo: Insere o UUID na coluna B (coluna 2)
  const idUnico = Utilities.getUuid();
  sheet.getRange(linhaEditada, 145).setValue(idUnico);
  sheet.getRange(linhaEditada, 146).setValue("S");
}

/**
 * Lógica para adicionar o ID único para um novo VOLUNTÁRIO.
 */
function gerarIdParaVoluntario(e) {
  const sheet = e.source.getSheetByName(VOLUNTARIOS_SHEET_NAME);
  const linhaEditada = e.range.getRow();

  // Exemplo: Insere o UUID na coluna A (coluna 1)
  const idUnico = Utilities.getUuid();
  sheet.getRange(linhaEditada, 18).setValue(idUnico);
  sheet.getRange(linhaEditada, 19).setValue("S");
}

/**
 * Permite incluir o conteúdo de um arquivo HTML dentro de outro (template).
 * @param {string} filename O nome do arquivo HTML a ser incluído.
 * @returns {string} O conteúdo do arquivo.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Formata um objeto de data de forma segura, tratando valores inválidos ou vazios.
 * @param {Date} dateValue O valor da célula da planilha.
 * @returns {string} A data formatada como 'yyyy-MM-dd' ou uma string vazia.
 */
function formatDate(dateValue) {
  // 1. Verifica se o valor existe e é um objeto do tipo Data
  if (dateValue && dateValue instanceof Date) {
    // 2. ✅ NOVA VERIFICAÇÃO: Garante que a data é válida e não um "Invalid Date"
    if (!isNaN(dateValue.getTime())) {
      // 3. Se for válida, formata e retorna
      return Utilities.formatDate(
        dateValue,
        Session.getScriptTimeZone(),
        "yyyy-MM-dd"
      );
    }
  }

  // 4. Se não for uma data válida em qualquer um dos casos, retorna uma string vazia.
  return "";
}

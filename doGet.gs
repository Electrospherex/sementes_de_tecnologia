function doGet(e) {
  // 1. Crie o template (pegue a massa do bolo)
  var template = HtmlService.createTemplateFromFile("index");

  // 2. Processe o template para obter o HTML final (asse o bolo)
  var output = template.evaluate();

  // 3. Configure o título e as tags no HTML final (decore o bolo)
  output.setTitle("Sistema da ONG");
  output.addMetaTag("viewport", "width=device-width, initial-scale=1");

  return output;
}

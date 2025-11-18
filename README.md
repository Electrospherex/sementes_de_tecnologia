Aqui está um arquivo README.md completo em português, com base no código que você forneceu.

Eu estruturei este README para explicar não apenas quais são os recursos, mas também como o projeto é construído, assumindo que ele é movido pelo Google Apps Script no backend (com base em nossa conversa anterior).

Sistema da ONG 🌟

Este projeto é um sistema de gerenciamento abrangente baseado na web para uma Organização Não Governamental (ONG). Ele é construído como um Aplicativo Web do Google Apps Script, usando o Google Sheets (Planilhas) como um banco de dados sem custo e sem servidor.

Toda a aplicação funciona como um aplicativo de página única (SPA - Single-Page App), fornecendo uma interface limpa, responsiva e amigável para gerenciar beneficiários, voluntários, presenças e doações.

🛠️ Stack de Tecnologia

    Frontend: HTML5, CSS3 (com variáveis), JavaScript puro (vanilla)

    Backend: Google Apps Script (arquivos .gs)

    Banco de Dados: Google Sheets (Planilhas Google)

    Visualização: Chart.js (para o dashboard)

✨ Recursos Principais

    Gerenciamento de Beneficiários (Buscar Atendidos):

        Pesquisa de beneficiários cadastrados (e seus responsáveis).

        Visualização e atualização de um formulário abrangente com dados pessoais, dependentes, informações familiares e detalhes socioeconômicos.

        Ativação ou desativação de cadastros.

    Gerenciamento de Voluntários (Buscar Voluntário):

        Pesquisa de voluntários cadastrados.

        Atualização de informações pessoais, endereço, disponibilidade e detalhes da atividade.

        Ativação ou desativação do status de voluntário.

    Controle de Presença (Lista de Presença):

        Registrar: Marcar a presença dos beneficiários com base em uma data e turno específicos (Manhã, Tarde, Noite).

        Consultar: Visualizar registros de presença anteriores, filtrando por data e turno.

    Registro de Doações (Cadastro de Doações):

        Registrar: Gravar novas doações recebidas, incluindo a descrição do item, a data e o responsável pelo recebimento.

        Consultar: Pesquisar e filtrar todas as doações por intervalo de datas ou pelo status "pendente de entrega".

    Painel Analítico (Dashboard):

        Exibe indicadores-chave de desempenho (KPIs) em tempo real.

        Mostra estatísticas de beneficiários totais/ativos, voluntários totais/ativos e total de doações.

        Calcula e exibe a média de presença para os turnos da manhã, tarde e noite.

        Inclui uma lista da contagem de presença individual dos beneficiários.

🏗️ Arquitetura (Como Funciona)

Este projeto utiliza a arquitetura de Aplicativo Web do Google Apps Script:

    Google Sheets (Banco de Dados): Uma ou mais planilhas (abas) em um arquivo do Google Sheets atuam como o banco de dados, armazenando todos os dados de beneficiários, voluntários, etc.

    Google Apps Script (Backend): Os arquivos .gs (como Code.gs) contêm toda a lógica do backend. Isso inclui:

        Uma função principal doGet() para servir o arquivo Index.html.

        Funções para ler dados do Google Sheets (ex: getBeneficiarios(), getDoacoes()).

        Funções para escrever dados no Google Sheets (ex: updateBeneficiario(), salvarPresenca()).

    HTML/JS (Frontend): Este arquivo Index.html é toda a interface do usuário. Ele usa JavaScript do lado do cliente para:

        Mostrar e ocultar diferentes seções para criar uma experiência de aplicativo de página única.

        Chamar funções do backend usando google.script.run.

        Lidar com mensagens de sucesso e erro retornadas do backend.

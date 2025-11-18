// In your .gs file

function getDonationSummary() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      DOACOES_CADASTRO_SHEET_NAME
    );
    const allData = sheet.getDataRange().getValues();
    allData.shift(); // Remove the header

    const counts = {}; // Use an object to store counts for each person

    allData.forEach((row) => {
      const receivedBy = row[2]; // Column C: 'Recebido por'
      if (receivedBy) {
        counts[receivedBy] = (counts[receivedBy] || 0) + 1;
      }
    });

    // Convert the counts object into separate labels and data arrays
    const labels = Object.keys(counts);
    const data = Object.values(counts);

    return { labels: labels, data: data };
  } catch (e) {
    Logger.log("Erro ao sumarizar doações: " + e.message);
    return { error: e.message };
  }
}

// In your .gs file

// In your .gs file

function getDashboardStats() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // --- Donations, Responsaveis, Atendidos, Voluntarios (No changes here) ---
    const doacoesSheet = ss.getSheetByName(DOACOES_CADASTRO_SHEET_NAME);
    const totalDonations =
      doacoesSheet.getLastRow() > 1 ? doacoesSheet.getLastRow() - 1 : 0;
    // ... (Your existing code for Responsaveis, Atendidos, and Voluntarios) ...
    // Make sure to include all variables from your last version (activeResponsaveis, etc.)
    const atendidosSheet = ss.getSheetByName(ATENDIDOS_SHEET_NAME);
    const atendidosData = atendidosSheet.getDataRange().getValues();
    atendidosData.shift();
    const totalResponsaveis = atendidosData.length;
    const activeResponsaveisData = atendidosData.filter(
      (row) => row[COLUMNS.ATIVO - 1] === "S"
    );
    const activeResponsaveis = activeResponsaveisData.length;
    let totalAtendidos = 0,
      activeAtendidos = 0;
    atendidosData.forEach((row) => {
      if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_1 - 1]) totalAtendidos++;
      if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_2 - 1]) totalAtendidos++;
      if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_3 - 1]) totalAtendidos++;
      if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_4 - 1]) totalAtendidos++;
      if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_5 - 1]) totalAtendidos++;
    });
    activeResponsaveisData.forEach((row) => {
      if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_1 - 1]) activeAtendidos++;
      if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_2 - 1]) activeAtendidos++;
      if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_3 - 1]) activeAtendidos++;
      if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_4 - 1]) activeAtendidos++;
      if (row[COLUMNS.NOME_COMPLETO_ATENDIDO_5 - 1]) activeAtendidos++;
    });
    const voluntariosSheet = ss.getSheetByName(VOLUNTARIOS_SHEET_NAME);
    const voluntariosData = voluntariosSheet.getDataRange().getValues();
    voluntariosData.shift();
    const totalVoluntarios = voluntariosData.length;
    const activeVoluntarios = voluntariosData.filter(
      (row) => row[VOLUNTARIO_COLUMNS.ATIVO - 1] === "S"
    ).length;

    // --- NEW: Expanded Attendance Calculations ---
    const presencaSheet = ss.getSheetByName(PRESENCA_SHEET_NAME);
    // *** CRITICAL CHANGE: Fetching 4 columns (A, B, C, D) instead of 3 ***
    const presencaData =
      presencaSheet.getLastRow() > 1
        ? presencaSheet
            .getRange(2, 1, presencaSheet.getLastRow() - 1, 4)
            .getValues()
        : [];
    Logger.log("TESTE: " + presencaData);
    let totaisTurno = {
      Manhã: { total: 0, presente: 0 },
      Tarde: { total: 0, presente: 0 },
      Noite: { total: 0, presente: 0 },
    };
    let totaisAtendido = {};

    presencaData.forEach((row) => {
      const turno = row[3]; // Column B: Turno
      const name = row[1]; // Column C: Name
      const status = row[2]; // Column D: Status

      // Initialize atendido if not present
      if (!totaisAtendido[name]) {
        totaisAtendido[name] = { total: 0, presente: 0 };
      }

      // Increment totals for the atendido
      totaisAtendido[name].total++;
      if (status && status.toLowerCase() === "presente") {
        totaisAtendido[name].presente++;
      }

      // Increment totals for the turno
      if (totaisTurno[turno]) {
        totaisTurno[turno].total++;
        if (status && status.toLowerCase() === "presente") {
          totaisTurno[turno].presente++;
        }
      }
    });
    Logger.log(totaisTurno);
    // Calculate Averages
    const getAvg = (presente, total) =>
      total > 0 ? ((presente / total) * 100).toFixed(1) : 0;
    Logger.log(getAvg);
    const avgManha = getAvg(
      totaisTurno["Manhã"].presente,
      totaisTurno["Manhã"].total
    );
    Logger.log(avgManha);
    const avgTarde = getAvg(
      totaisTurno["Tarde"].presente,
      totaisTurno["Tarde"].total
    );
    const avgNoite = getAvg(
      totaisTurno["Noite"].presente,
      totaisTurno["Noite"].total
    );
    const overallAvg = getAvg(
      totaisTurno["Manhã"].presente +
        totaisTurno["Tarde"].presente +
        totaisTurno["Noite"].presente,
      totaisTurno["Manhã"].total +
        totaisTurno["Tarde"].total +
        totaisTurno["Noite"].total
    );

    // Create the sorted list for atendido attendance
    const atendidoAttendanceList = Object.keys(totaisAtendido)
      .map((name) => {
        const stats = totaisAtendido[name];
        return {
          name: name,
          average: getAvg(stats.presente, stats.total),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    // --- Return all stats in one object ---
    return {
      // Your existing stats
      totalDonations,
      totalResponsaveis,
      activeResponsaveis,
      totalAtendidos,
      activeAtendidos,
      totalVoluntarios,
      activeVoluntarios,
      // New stats
      averageAttendance: overallAvg, // This is now the corrected overall average
      avgManha,
      avgTarde,
      avgNoite,
      atendidoAttendanceList,
    };
  } catch (e) {
    Logger.log("Erro em getDashboardStats: " + e.message);
    return { error: e.message };
  }
}

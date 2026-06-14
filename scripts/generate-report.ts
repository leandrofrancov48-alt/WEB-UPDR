import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando la recopilación de datos para el reporte...");

  // 1. Obtener datos de Usuarios
  console.log("Consultando usuarios...");
  const users = await prisma.user.findMany({
    include: {
      predictions: {
        include: {
          match: true
        }
      },
      stickers: {
        include: {
          sticker: true
        }
      },
      openedPacks: true,
      bandsOwned: true
    }
  });

  // 2. Obtener datos de Partidos y Predicciones
  console.log("Consultando partidos...");
  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
      tournament: true,
      predictions: true
    },
    orderBy: {
      matchDate: 'asc'
    }
  });

  // 3. Obtener datos de Figuritas
  console.log("Consultando figuritas...");
  const stickers = await prisma.sticker.findMany({
    include: {
      userStickers: true
    },
    orderBy: {
      number: 'asc'
    }
  });

  // 4. Obtener total de sobres abiertos
  const totalOpenedPacks = await prisma.openedPack.count();
  const openedPacksByType = await prisma.openedPack.groupBy({
    by: ['packType'],
    _count: {
      id: true
    }
  });

  console.log("Procesando datos para las planillas...");

  // ==========================================
  // PLANILLA 1: Resumen General
  // ==========================================
  const totalUsers = users.length;
  const totalPredictions = matches.reduce((acc, m) => acc + m.predictions.length, 0);
  const totalMusicians = users.filter(u => u.isMusician).length;
  const totalBands = await prisma.band.count();

  // Calcular plenos totales
  let totalPlenos = 0;
  users.forEach(u => {
    u.predictions.forEach(p => {
      if (p.points === 5) totalPlenos++;
    });
  });

  const generalSummary = [
    { Métrica: "Total de Usuarios Registrados", Valor: totalUsers },
    { Métrica: "Total de Predicciones Realizadas (PRODE)", Valor: totalPredictions },
    { Métrica: "Total de Sobres Abiertos", Valor: totalOpenedPacks },
    { Métrica: "Total de Plenos Acertados en el PRODE (5 pts)", Valor: totalPlenos },
    { Métrica: "Artistas Solistas Registrados", Valor: totalMusicians },
    { Métrica: "Bandas Registradas", Valor: totalBands },
    { Métrica: "Total de Figuritas en el Catálogo", Valor: stickers.length }
  ];

  // Desglose de sobres por tipo
  openedPacksByType.forEach(group => {
    generalSummary.push({
      Métrica: `Sobres Abiertos - Tipo: ${group.packType}`,
      Valor: group._count.id
    });
  });

  // ==========================================
  // PLANILLA 2: Usuarios y Progreso
  // ==========================================
  const usersData = users.map(u => {
    const totalPreds = u.predictions.length;
    const points = u.predictions.reduce((acc, p) => acc + p.points, 0);
    const plenos = u.predictions.filter(p => p.points === 5).length;
    
    const uniqueStickers = u.stickers.length;
    const totalStickers = u.stickers.reduce((acc, s) => acc + s.quantity, 0);
    const albumProgress = stickers.length > 0 ? ((uniqueStickers / stickers.length) * 100).toFixed(1) + "%" : "0%";

    return {
      "ID Usuario": u.id,
      "Nombre de Usuario": u.username || "",
      "Nombre": u.nombre,
      "Apellido": u.apellido,
      "Email": u.email,
      "Celular": u.celular || "",
      "DNI": u.dni || "",
      "Sobres Estándar (Inventario)": u.packBalance,
      "Sobres Dobles (Inventario)": u.pack2Balance,
      "Sobres Triples (Inventario)": u.pack3Balance,
      "Sobres Abiertos (Historial)": u.openedPacks.length,
      "Figuritas Únicas": uniqueStickers,
      "Figuritas Totales": totalStickers,
      "Progreso Álbum": albumProgress,
      "Puntos PRODE": points,
      "Predicciones Realizadas": totalPreds,
      "Plenos Acertados (5 pts)": plenos
    };
  }).sort((a, b) => b["Puntos PRODE"] - a["Puntos PRODE"]); // Ordenar por puntos prode de mayor a menor

  // ==========================================
  // PLANILLA 3: Estadísticas del Prode (Partidos)
  // ==========================================
  const matchesData = matches.map(m => {
    const totalMatchPreds = m.predictions.length;
    
    let plenos = 0;
    let aciertosTendencia = 0;

    if (m.homeScore !== null && m.awayScore !== null) {
      const realResult = m.homeScore > m.awayScore ? 1 : (m.homeScore < m.awayScore ? -1 : 0);
      m.predictions.forEach(p => {
        // Calcular puntos teóricos
        let pts = 0;
        if (p.homeScore === m.homeScore) pts += 1;
        if (p.awayScore === m.awayScore) pts += 1;
        const predResult = p.homeScore > p.awayScore ? 1 : (p.homeScore < p.awayScore ? -1 : 0);
        if (predResult === realResult) pts += 3;

        if (pts === 5) plenos++;
        if (predResult === realResult) aciertosTendencia++;
      });
    }

    const pctPleno = totalMatchPreds > 0 ? ((plenos / totalMatchPreds) * 100).toFixed(1) + "%" : "0%";
    const pctTendencia = totalMatchPreds > 0 ? ((aciertosTendencia / totalMatchPreds) * 100).toFixed(1) + "%" : "0%";

    return {
      "ID Partido": m.id,
      "Torneo": m.tournament.name,
      "Fase": m.phase,
      "Local": m.homeTeam?.name || "TBD",
      "Visitante": m.awayTeam?.name || "TBD",
      "Fecha (ART)": new Date(m.matchDate).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }),
      "Estado": m.status,
      "Goles Local": m.homeScore !== null ? m.homeScore : "-",
      "Goles Visitante": m.awayScore !== null ? m.awayScore : "-",
      "Total Predicciones": totalMatchPreds,
      "Aciertos Plenos (Resultado Exacto)": m.status === "FINISHED" ? plenos : "-",
      "% Acierto Pleno": m.status === "FINISHED" ? pctPleno : "-",
      "Aciertos Tendencia (Ganador/Empate)": m.status === "FINISHED" ? aciertosTendencia : "-",
      "% Acierto Tendencia": m.status === "FINISHED" ? pctTendencia : "-"
    };
  });

  // ==========================================
  // PLANILLA 4: Estadísticas de Álbum (Figuritas)
  // ==========================================
  const stickersData = stickers.map(s => {
    const totalInExistence = s.userStickers.reduce((acc, us) => acc + us.quantity, 0);
    const uniqueOwners = s.userStickers.length;

    return {
      "Número": s.number,
      "Nombre del Artista": s.name,
      "Rareza": s.rarity,
      "Categoría": s.category || "General",
      "Ruta de Imagen": s.image,
      "Copias Totales en Circulación": totalInExistence,
      "Coleccionistas Únicos": uniqueOwners,
      "% de Usuarios que la Tienen": totalUsers > 0 ? ((uniqueOwners / totalUsers) * 100).toFixed(1) + "%" : "0%"
    };
  });

  // ==========================================
  // Creación del archivo de Excel
  // ==========================================
  console.log("Generando el libro de Excel...");
  const wb = XLSX.utils.book_new();

  // Convertir arreglos de datos a hojas de Excel
  const wsSummary = XLSX.utils.json_to_sheet(generalSummary);
  const wsUsers = XLSX.utils.json_to_sheet(usersData);
  const wsMatches = XLSX.utils.json_to_sheet(matchesData);
  const wsStickers = XLSX.utils.json_to_sheet(stickersData);

  // Agregar las hojas al libro con nombres descriptivos
  XLSX.utils.book_append_sheet(wb, wsSummary, "Resumen General");
  XLSX.utils.book_append_sheet(wb, wsUsers, "Usuarios y Progreso");
  XLSX.utils.book_append_sheet(wb, wsMatches, "PRODE Partidos");
  XLSX.utils.book_append_sheet(wb, wsStickers, "Álbum Catálogo");

  // Ajustar anchos de columnas automáticamente para que se lea perfecto
  const sheets = [
    { name: "Resumen General", ws: wsSummary },
    { name: "Usuarios y Progreso", ws: wsUsers },
    { name: "PRODE Partidos", ws: wsMatches },
    { name: "Álbum Catálogo", ws: wsStickers }
  ];

  sheets.forEach(({ ws }) => {
    if (!ws['!ref']) return;
    const range = XLSX.utils.decode_range(ws['!ref']);
    const colsWidths: { wch: number }[] = [];
    
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxWidth = 10; // ancho mínimo
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
        if (cell && cell.v) {
          const cellWidth = cell.v.toString().length;
          if (cellWidth > maxWidth) maxWidth = cellWidth;
        }
      }
      colsWidths.push({ wch: maxWidth + 3 }); // Añadir margen
    }
    ws['!cols'] = colsWidths;
  });

  // Ruta de destino
  const reportFilename = "reporte_actividad_1pdr.xlsx";
  const workspaceDest = path.join(process.cwd(), reportFilename);
  const artifactsDest = path.join("C:\\Users\\Lean\\.gemini\antigravity\\brain\\5742f59e-12dd-43bf-bd1a-f9c9101a246b", reportFilename);

  console.log(`Guardando el reporte en ${workspaceDest}...`);
  XLSX.writeFile(wb, workspaceDest);

  // Intentar guardar en la carpeta de artefactos de Gemini también
  try {
    // Asegurar directorio existe
    const dir = path.dirname(artifactsDest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    console.log(`Copiando reporte a carpeta de artefactos: ${artifactsDest}`);
    fs.copyFileSync(workspaceDest, artifactsDest);
  } catch (err: any) {
    console.warn("No se pudo copiar a los artefactos:", err?.message || String(err));
  }

  console.log("¡Reporte generado exitosamente!");
}

main()
  .catch((e) => {
    console.error("Error al generar el reporte:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

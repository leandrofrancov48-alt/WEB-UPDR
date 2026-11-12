import { prisma } from "@/lib/db";
import { ShiftStatus, ShiftType, StaffSector } from "@prisma/client";

const MESES_NOMBRES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const SECTOR_LABELS: Record<StaffSector, string> = {
  SONIDO: "Sonido",
  VIDEO: "Video / Cámaras",
  PRODUCCION: "Producción",
  ILUMINACION: "Iluminación",
  STAGE: "Stage / Plomos",
  OTRO: "Otro Sector",
};

const MOTIVO_LABELS: Record<ShiftType, string> = {
  UPDR: "UPDR",
  TXLM: "TXLM",
  LA_BANDURRIA: "LA BANDURRIA",
  UPDF: "UPDF",
};

function formatDateDDMMYYYY(date: string | Date | null | undefined): string {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

function formatFullNameUpper(apellido?: string | null, nombre?: string | null): string {
  return `${(apellido || "").trim()} ${(nombre || "").trim()}`.trim().toUpperCase();
}

export async function syncMonthShiftsToGoogleSheets(mes: number, anio: number): Promise<{
  synced: boolean;
  reason?: string;
  count?: number;
}> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return { synced: false, reason: "GOOGLE_SHEETS_WEBHOOK_URL_NOT_SET" };
  }

  try {
    const startDate = new Date(Date.UTC(anio, mes - 1, 1, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(anio, mes, 0, 23, 59, 59, 999));

    const shifts = await prisma.staffShift.findMany({
      where: {
        fecha: { gte: startDate, lte: endDate },
      },
      include: {
        staffMember: {
          include: {
            user: {
              select: {
                dni: true,
                celular: true,
                birthDate: true,
              },
            },
          },
        },
      },
      orderBy: [{ fecha: "desc" }, { createdAt: "desc" }],
    });

    // Ordenar por N° OS correlativo
    const sortedShifts = [...shifts].sort((a, b) => {
      const osA = a.numeroOS || "ZZZZ";
      const osB = b.numeroOS || "ZZZZ";
      return osA.localeCompare(osB, undefined, { numeric: true });
    });

    const detalleHeaders = [
      "N° OS",
      "Fecha Prestación",
      "Fecha Carga",
      "Fecha Aprobación",
      "APELLIDO Y NOMBRE",
      "DNI",
      "CUIT",
      "Fecha de Nacimiento",
      "Teléfono",
      "Email",
      "Sector",
      "Motivo",
      "Detalle / Obs",
      "Monto ($)",
      "Estado",
      "CBU / Alias",
      "Aprobado Por",
      "Motivo Rechazo",
    ];

    const detalleRows: Array<Array<string | number>> = sortedShifts.map((s) => [
      s.numeroOS || "-",
      formatDateDDMMYYYY(s.fecha),
      formatDateDDMMYYYY(s.createdAt),
      s.status === ShiftStatus.APROBADO && s.fechaRevision
        ? formatDateDDMMYYYY(s.fechaRevision)
        : "-",
      formatFullNameUpper(s.staffMember.apellido, s.staffMember.nombre),
      s.staffMember.user?.dni || "-",
      s.staffMember.cuitCuil || "-",
      formatDateDDMMYYYY(s.staffMember.user?.birthDate),
      s.staffMember.telefono || s.staffMember.user?.celular || "-",
      s.staffMember.email,
      SECTOR_LABELS[s.staffMember.sector] || s.staffMember.sector,
      MOTIVO_LABELS[s.tipo] || s.tipo,
      s.descripcion || "-",
      s.monto,
      s.status,
      s.staffMember.cbuAlias || "-",
      s.aprobadoPor || "-",
      s.motivoRechazo || "-",
    ]);

    const totalMontoDetalle = sortedShifts.reduce((acc, s) => acc + s.monto, 0);
    detalleRows.push([
      "--- TOTAL",
      `(${sortedShifts.length} solicitudes)`,
      "-",
      "-",
      "---",
      "-",
      "-",
      "-",
      "-",
      "-",
      "-",
      "-",
      "-",
      totalMontoDetalle,
      "-",
      "-",
      "-",
      "-",
    ]);

    // Resumen por Persona
    const personaMap = new Map<
      string,
      {
        apellidoNombre: string;
        dni: string;
        cuit: string;
        fechaNacimiento: string;
        telefono: string;
        email: string;
        sector: string;
        cbu: string;
        cantJornadas: number;
        totalAprobado: number;
        totalPendiente: number;
        numerosOS: string[];
      }
    >();

    for (const s of sortedShifts) {
      const current = personaMap.get(s.staffMemberId) || {
        apellidoNombre: formatFullNameUpper(s.staffMember.apellido, s.staffMember.nombre),
        dni: s.staffMember.user?.dni || "-",
        cuit: s.staffMember.cuitCuil || "-",
        fechaNacimiento: formatDateDDMMYYYY(s.staffMember.user?.birthDate),
        telefono: s.staffMember.telefono || s.staffMember.user?.celular || "-",
        email: s.staffMember.email,
        sector: SECTOR_LABELS[s.staffMember.sector] || s.staffMember.sector,
        cbu: s.staffMember.cbuAlias || "-",
        cantJornadas: 0,
        totalAprobado: 0,
        totalPendiente: 0,
        numerosOS: [],
      };

      current.cantJornadas += 1;
      if (s.status === ShiftStatus.APROBADO) current.totalAprobado += s.monto;
      if (s.status === ShiftStatus.PENDIENTE) current.totalPendiente += s.monto;
      if (s.numeroOS && !current.numerosOS.includes(s.numeroOS)) {
        current.numerosOS.push(s.numeroOS);
      }

      personaMap.set(s.staffMemberId, current);
    }

    const resumenList = Array.from(personaMap.values()).sort((a, b) => {
      const osA = a.numerosOS[0] || "ZZZZ";
      const osB = b.numerosOS[0] || "ZZZZ";
      return osA.localeCompare(osB, undefined, { numeric: true });
    });

    const resumenHeaders = [
      "APELLIDO Y NOMBRE",
      "DNI",
      "CUIT",
      "Fecha de Nacimiento",
      "Teléfono",
      "Email",
      "Sector",
      "N° OS",
      "CBU / Alias Transferencia",
      "Cant. Jornadas",
      "Total Aprobado a Pagar ($)",
      "Total Pendiente ($)",
    ];

    const resumenRows: Array<Array<string | number>> = resumenList.map((p) => [
      p.apellidoNombre,
      p.dni,
      p.cuit,
      p.fechaNacimiento,
      p.telefono,
      p.email,
      p.sector,
      p.numerosOS.length > 0 ? p.numerosOS.join(", ") : "-",
      p.cbu,
      p.cantJornadas,
      p.totalAprobado,
      p.totalPendiente,
    ]);

    const totalAprobado = resumenList.reduce((acc, p) => acc + p.totalAprobado, 0);
    const totalPendiente = resumenList.reduce((acc, p) => acc + p.totalPendiente, 0);
    const totalJornadas = resumenList.reduce((acc, p) => acc + p.cantJornadas, 0);

    resumenRows.push([
      "--- TOTAL GENERAL ---",
      "-",
      "-",
      "-",
      "-",
      "-",
      "-",
      "-",
      "-",
      totalJornadas,
      totalAprobado,
      totalPendiente,
    ]);

    const mesLabel = MESES_NOMBRES[mes - 1] || `Mes ${mes}`;
    const sheetTitle = `${mesLabel} ${anio}`;
    const summaryTitle = `${mesLabel} ${anio} - Resumen`;

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.GOOGLE_SHEETS_WEBHOOK_SECRET || "",
        sheetTitle,
        summaryTitle,
        detalleHeaders,
        detalleRows,
        resumenHeaders,
        resumenRows,
      }),
      redirect: "follow",
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[GoogleSheetsSync] HTTP error:", res.status, errText);
      return { synced: false, reason: `HTTP_${res.status}` };
    }

    return { synced: true, count: sortedShifts.length };
  } catch (err: any) {
    console.error("[GoogleSheetsSync] Error:", err?.message || err);
    return { synced: false, reason: err?.message || "UNKNOWN_ERROR" };
  }
}

export async function syncMonthsFromDates(dates: Date[]): Promise<void> {
  if (!process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim()) return;

  const seen = new Set<string>();
  const targets: Array<{ mes: number; anio: number }> = [];

  for (const d of dates) {
    if (!d) continue;
    const dt = new Date(d);
    if (isNaN(dt.getTime())) continue;
    const mes = dt.getUTCMonth() + 1;
    const anio = dt.getUTCFullYear();
    const key = `${anio}-${mes}`;
    if (!seen.has(key)) {
      seen.add(key);
      targets.push({ mes, anio });
    }
  }

  for (const t of targets) {
    await syncMonthShiftsToGoogleSheets(t.mes, t.anio);
  }
}

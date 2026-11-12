"use server";

import { prisma } from "@/lib/db";
import { requireStaffMember, requireStaffAdmin, getStaffContext } from "@/lib/staff-auth";
import { StaffSector, StaffRole, ShiftType, ShiftStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// --- TARIFAS BASE POR DEFECTO (si no existen aún en DB) ---
const DEFAULT_RATES: Array<{ sector: StaffSector; tipo: ShiftType; monto: number }> = [
  // Sonido
  { sector: StaffSector.SONIDO, tipo: ShiftType.SHOW, monto: 85000 },
  { sector: StaffSector.SONIDO, tipo: ShiftType.JORNADA_ADICIONAL, monto: 55000 },
  { sector: StaffSector.SONIDO, tipo: ShiftType.MENSUAL, monto: 450000 },
  // Video
  { sector: StaffSector.VIDEO, tipo: ShiftType.SHOW, monto: 85000 },
  { sector: StaffSector.VIDEO, tipo: ShiftType.JORNADA_ADICIONAL, monto: 55000 },
  { sector: StaffSector.VIDEO, tipo: ShiftType.MENSUAL, monto: 450000 },
  // Producción
  { sector: StaffSector.PRODUCCION, tipo: ShiftType.SHOW, monto: 90000 },
  { sector: StaffSector.PRODUCCION, tipo: ShiftType.JORNADA_ADICIONAL, monto: 60000 },
  { sector: StaffSector.PRODUCCION, tipo: ShiftType.MENSUAL, monto: 480000 },
  // Iluminación
  { sector: StaffSector.ILUMINACION, tipo: ShiftType.SHOW, monto: 80000 },
  { sector: StaffSector.ILUMINACION, tipo: ShiftType.JORNADA_ADICIONAL, monto: 50000 },
  { sector: StaffSector.ILUMINACION, tipo: ShiftType.MENSUAL, monto: 400000 },
  // Stage
  { sector: StaffSector.STAGE, tipo: ShiftType.SHOW, monto: 75000 },
  { sector: StaffSector.STAGE, tipo: ShiftType.JORNADA_ADICIONAL, monto: 45000 },
  { sector: StaffSector.STAGE, tipo: ShiftType.MENSUAL, monto: 380000 },
  // Otro
  { sector: StaffSector.OTRO, tipo: ShiftType.SHOW, monto: 80000 },
  { sector: StaffSector.OTRO, tipo: ShiftType.JORNADA_ADICIONAL, monto: 50000 },
  { sector: StaffSector.OTRO, tipo: ShiftType.MENSUAL, monto: 400000 },
];

// ==========================================
// 1. TARIFAS
// ==========================================
export async function getStaffRates() {
  const ctx = await getStaffContext();
  if (!ctx.isStaff && !ctx.isAdminPagos) {
    throw new Error("UNAUTHORIZED");
  }

  let rates = await prisma.staffRate.findMany({
    orderBy: [{ sector: "asc" }, { tipo: "asc" }],
  });

  // Si aún no hay tarifas cargadas, sembramos las iniciales
  if (rates.length === 0) {
    for (const def of DEFAULT_RATES) {
      await prisma.staffRate.upsert({
        where: { sector_tipo: { sector: def.sector, tipo: def.tipo } },
        update: {},
        create: def,
      });
    }
    rates = await prisma.staffRate.findMany({
      orderBy: [{ sector: "asc" }, { tipo: "asc" }],
    });
  }

  return rates;
}

export async function updateStaffRate(sector: StaffSector, tipo: ShiftType, monto: number) {
  await requireStaffAdmin();

  const rate = await prisma.staffRate.upsert({
    where: { sector_tipo: { sector, tipo } },
    update: { monto },
    create: { sector, tipo, monto },
  });

  revalidatePath("/staff");
  revalidatePath("/control-updr-admin/jornadas");
  return rate;
}

// ==========================================
// 2. GESTIÓN DE MIEMBROS DE STAFF (ADMIN)
// ==========================================
export async function getStaffMembers(options?: {
  sector?: StaffSector;
  search?: string;
  activo?: boolean;
}) {
  await requireStaffAdmin();

  const where: any = {};
  if (options?.sector) where.sector = options.sector;
  if (typeof options?.activo === "boolean") where.activo = options.activo;

  if (options?.search?.trim()) {
    const q = options.search.trim();
    where.OR = [
      { nombre: { contains: q, mode: "insensitive" } },
      { apellido: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { cuitCuil: { contains: q, mode: "insensitive" } },
      { telefono: { contains: q, mode: "insensitive" } },
    ];
  }

  const members = await prisma.staffMember.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          nombre: true,
          apellido: true,
          celular: true,
          dni: true,
        },
      },
      shifts: {
        select: {
          id: true,
          status: true,
          monto: true,
          fecha: true,
        },
      },
    },
    orderBy: [{ sector: "asc" }, { apellido: "asc" }, { nombre: "asc" }],
  });

  return members.map((m) => {
    const totalAprobado = m.shifts
      .filter((s) => s.status === ShiftStatus.APROBADO)
      .reduce((acc, s) => acc + s.monto, 0);

    const totalPendiente = m.shifts
      .filter((s) => s.status === ShiftStatus.PENDIENTE)
      .reduce((acc, s) => acc + s.monto, 0);

    return {
      ...m,
      stats: {
        totalAprobado,
        totalPendiente,
        totalJornadas: m.shifts.length,
      },
    };
  });
}

export async function createStaffMember(data: {
  nombre: string;
  apellido: string;
  email: string;
  sector: StaffSector;
  rol?: StaffRole;
  cuitCuil?: string;
  cbuAlias?: string;
  telefono?: string;
}) {
  await requireStaffAdmin();

  const cleanEmail = data.email.trim().toLowerCase();

  // Verificar si ya existe en la lista de staff
  const existing = await prisma.staffMember.findUnique({
    where: { email: cleanEmail },
  });
  if (existing) {
    throw new Error(`Ya existe un miembro del staff registrado con el email ${cleanEmail}`);
  }

  // Buscar si ya tiene usuario registrado en la web
  const existingUser = await prisma.user.findFirst({
    where: { email: { equals: cleanEmail, mode: "insensitive" } },
  });

  const member = await prisma.staffMember.create({
    data: {
      nombre: data.nombre.trim(),
      apellido: data.apellido.trim(),
      email: cleanEmail,
      sector: data.sector,
      rol: data.rol || StaffRole.STAFF,
      cuitCuil: data.cuitCuil?.trim() || existingUser?.dni || null,
      cbuAlias: data.cbuAlias?.trim() || null,
      telefono: data.telefono?.trim() || existingUser?.celular || null,
      userId: existingUser ? existingUser.id : null,
      activo: true,
    },
  });

  revalidatePath("/control-updr-admin/jornadas");
  revalidatePath("/staff");
  return member;
}

export async function updateStaffMember(
  id: string,
  data: {
    nombre?: string;
    apellido?: string;
    email?: string;
    sector?: StaffSector;
    rol?: StaffRole;
    cuitCuil?: string | null;
    cbuAlias?: string | null;
    telefono?: string | null;
    activo?: boolean;
  }
) {
  await requireStaffAdmin();

  const cleanData: any = { ...data };
  if (cleanData.email) cleanData.email = cleanData.email.trim().toLowerCase();
  if (cleanData.nombre) cleanData.nombre = cleanData.nombre.trim();
  if (cleanData.apellido) cleanData.apellido = cleanData.apellido.trim();
  if (cleanData.telefono !== undefined) cleanData.telefono = cleanData.telefono?.trim() || null;
  if (cleanData.cuitCuil !== undefined) cleanData.cuitCuil = cleanData.cuitCuil?.trim() || null;
  if (cleanData.cbuAlias !== undefined) cleanData.cbuAlias = cleanData.cbuAlias?.trim() || null;

  const updated = await prisma.staffMember.update({
    where: { id },
    data: cleanData,
  });

  revalidatePath("/control-updr-admin/jornadas");
  revalidatePath("/staff");
  return updated;
}

export async function toggleStaffMemberActive(id: string, activo: boolean) {
  await requireStaffAdmin();

  const updated = await prisma.staffMember.update({
    where: { id },
    data: { activo },
  });

  revalidatePath("/control-updr-admin/jornadas");
  revalidatePath("/staff");
  return updated;
}

// ==========================================
// 3. JORNADAS DEL STAFF (PORTAL TÉCNICO / MIEMBRO)
// ==========================================
export async function getMyStaffData(options?: { mes?: number; anio?: number }) {
  const { staffMember, user, isAdminPagos } = await requireStaffMember();

  const now = new Date();
  const anio = options?.anio ?? now.getFullYear();
  let mes = options?.mes ?? now.getMonth() + 1; // 1-12

  // A partir de noviembre de 2026
  if (anio <= 2026 && mes < 11) {
    mes = 11;
  }

  // Rango de fechas para el mes seleccionado
  const startDate = new Date(anio, mes - 1, 1);
  const endDate = new Date(anio, mes, 0, 23, 59, 59, 999);

  const shifts = await prisma.staffShift.findMany({
    where: {
      staffMemberId: staffMember.id,
      fecha: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { fecha: "desc" },
  });

  // Métricas del mes
  const totalAprobado = shifts
    .filter((s) => s.status === ShiftStatus.APROBADO)
    .reduce((acc, s) => acc + s.monto, 0);

  const totalPendiente = shifts
    .filter((s) => s.status === ShiftStatus.PENDIENTE)
    .reduce((acc, s) => acc + s.monto, 0);

  const totalRechazado = shifts
    .filter((s) => s.status === ShiftStatus.RECHAZADO)
    .reduce((acc, s) => acc + s.monto, 0);

  return {
    staffMember,
    user,
    isAdminPagos,
    shifts,
    mes,
    anio,
    stats: {
      totalAprobado,
      totalPendiente,
      totalRechazado,
      totalJornadas: shifts.length,
      aprobadasCount: shifts.filter((s) => s.status === ShiftStatus.APROBADO).length,
      pendientesCount: shifts.filter((s) => s.status === ShiftStatus.PENDIENTE).length,
      rechazadasCount: shifts.filter((s) => s.status === ShiftStatus.RECHAZADO).length,
    },
  };
}

export async function createStaffShift(data: {
  fecha: string; // YYYY-MM-DD
  tipo: ShiftType;
  porcentaje?: number;
  canal?: string;
  titulo: string;
  descripcion?: string;
  monto: number;
  numeroOS?: string;
  numeroFactura?: string;
  comprobanteUrl?: string;
}) {
  const { staffMember } = await requireStaffMember();

  if (!data.fecha) throw new Error("La fecha es obligatoria");
  if (data.fecha < "2026-11-01") {
    throw new Error("El sistema de registro de jornadas está habilitado a partir del 1 de Noviembre de 2026.");
  }
  if (!data.titulo?.trim()) throw new Error("El evento es obligatorio");
  if (typeof data.monto !== "number" || isNaN(data.monto) || data.monto < 0) {
    throw new Error("El monto ingresado es inválido");
  }
  const porcentaje =
    typeof data.porcentaje === "number" && !isNaN(data.porcentaje) && data.porcentaje > 0
      ? Math.min(100, Math.max(1, data.porcentaje))
      : 100;

  // Parsear fecha asegurando mediodía UTC para evitar desfases de zona horaria
  const [year, month, day] = data.fecha.split("-").map(Number);
  const fechaObj = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  // Generar automáticamente el N° OS individual correlativo para cada jornada/solicitud
  let numeroOS = data.numeroOS?.trim();
  if (!numeroOS) {
    const allShiftsWithOS = await prisma.staffShift.findMany({
      where: { numeroOS: { not: null } },
      select: { numeroOS: true },
    });

    let maxNum = 0;
    for (const s of allShiftsWithOS) {
      if (!s.numeroOS) continue;
      const match = s.numeroOS.match(/\d+$/);
      if (match) {
        const n = parseInt(match[0], 10);
        if (n > maxNum) maxNum = n;
      }
    }

    const nextNum = maxNum + 1;
    numeroOS = `OS-${String(nextNum).padStart(4, "0")}`;
  }

  const shift = await prisma.staffShift.create({
    data: {
      staffMemberId: staffMember.id,
      fecha: fechaObj,
      tipo: data.tipo,
      porcentaje,
      canal: data.canal?.trim() || null,
      titulo: data.titulo.trim(),
      descripcion: data.descripcion?.trim() || null,
      monto: data.monto,
      numeroOS,
      numeroFactura: data.numeroFactura?.trim() || null,
      comprobanteUrl: data.comprobanteUrl?.trim() || null,
      status: ShiftStatus.PENDIENTE,
    },
  });

  revalidatePath("/staff");
  revalidatePath("/control-updr-admin/jornadas");
  return shift;
}

export async function deleteMyStaffShift(shiftId: string) {
  const { staffMember } = await requireStaffMember();

  const shift = await prisma.staffShift.findUnique({
    where: { id: shiftId },
  });

  if (!shift || shift.staffMemberId !== staffMember.id) {
    throw new Error("Jornada no encontrada");
  }

  if (shift.status !== ShiftStatus.PENDIENTE) {
    throw new Error("Solo puedes eliminar jornadas que aún se encuentren en estado Pendiente");
  }

  await prisma.staffShift.delete({ where: { id: shiftId } });

  revalidatePath("/staff");
  revalidatePath("/control-updr-admin/jornadas");
  return { success: true };
}

export async function adminDeleteStaffShift(shiftId: string) {
  await requireStaffAdmin();

  const deleted = await prisma.staffShift.delete({
    where: { id: shiftId },
  });

  revalidatePath("/staff");
  revalidatePath("/control-updr-admin/jornadas");
  return deleted;
}

export async function adminDeleteStaffSolicitud(shiftIds: string[]) {
  await requireStaffAdmin();

  if (!shiftIds.length) return { count: 0 };

  const res = await prisma.staffShift.deleteMany({
    where: { id: { in: shiftIds } },
  });

  revalidatePath("/staff");
  revalidatePath("/control-updr-admin/jornadas");
  return res;
}

// ==========================================
// 4. PANEL DE CONTROL DE PAGOS Y APROBACIONES (ADMIN)
// ==========================================
export async function getAdminShiftsOverview(options?: {
  sector?: StaffSector | "TODOS";
  staffMemberId?: string | "TODOS";
  tipo?: ShiftType | "TODOS";
  canal?: string | "TODOS";
  status?: ShiftStatus | "TODOS";
  mes?: number | "TODOS";
  anio?: number;
  search?: string;
}) {
  const ctx = await requireStaffAdmin();

  const now = new Date();
  const anio = options?.anio ?? now.getFullYear();

  const baseWhere: any = {};

  if (options?.sector && options.sector !== "TODOS") {
    baseWhere.staffMember = { sector: options.sector };
  }

  if (options?.staffMemberId && options.staffMemberId !== "TODOS") {
    baseWhere.staffMemberId = options.staffMemberId;
  }

  if (options?.tipo && options.tipo !== "TODOS") {
    baseWhere.tipo = options.tipo;
  }

  if (options?.canal && options.canal !== "TODOS") {
    baseWhere.canal = options.canal;
  }

  // Filtro por fecha / mes
  if (options?.mes && options.mes !== "TODOS") {
    const mesNum = Number(options.mes);
    const startDate = new Date(anio, mesNum - 1, 1);
    const endDate = new Date(anio, mesNum, 0, 23, 59, 59, 999);
    baseWhere.fecha = { gte: startDate, lte: endDate };
  } else if (anio) {
    const startMonth = anio <= 2026 ? 10 : 0; // Noviembre (index 10) para 2026
    const startDate = new Date(anio, startMonth, 1);
    const endDate = new Date(anio, 11, 31, 23, 59, 59, 999);
    baseWhere.fecha = { gte: startDate, lte: endDate };
  }

  if (options?.search?.trim()) {
    const q = options.search.trim();
    baseWhere.OR = [
      { titulo: { contains: q, mode: "insensitive" } },
      { canal: { contains: q, mode: "insensitive" } },
      { descripcion: { contains: q, mode: "insensitive" } },
      { numeroFactura: { contains: q, mode: "insensitive" } },
      { numeroOS: { contains: q, mode: "insensitive" } },
      { staffMember: { nombre: { contains: q, mode: "insensitive" } } },
      { staffMember: { apellido: { contains: q, mode: "insensitive" } } },
      { staffMember: { email: { contains: q, mode: "insensitive" } } },
      { staffMember: { cuitCuil: { contains: q, mode: "insensitive" } } },
      { staffMember: { telefono: { contains: q, mode: "insensitive" } } },
      { staffMember: { user: { dni: { contains: q, mode: "insensitive" } } } },
      { staffMember: { user: { celular: { contains: q, mode: "insensitive" } } } },
    ];
  }

  // Consultar todas las jornadas del período para calcular métricas globales y conteos reales por estado
  const allShifts = await prisma.staffShift.findMany({
    where: baseWhere,
    include: {
      staffMember: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
          sector: true,
          cuitCuil: true,
          cbuAlias: true,
          telefono: true,
          user: {
            select: {
              id: true,
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

  // Métricas agregadas globales del período
  let totalAprobado = 0;
  let totalPendiente = 0;
  let totalRechazado = 0;

  const sectorBreakdown: Record<StaffSector, { count: number; totalAprobado: number; totalPendiente: number }> = {
    [StaffSector.VIDEO]: { count: 0, totalAprobado: 0, totalPendiente: 0 },
    [StaffSector.SONIDO]: { count: 0, totalAprobado: 0, totalPendiente: 0 },
    [StaffSector.PRODUCCION]: { count: 0, totalAprobado: 0, totalPendiente: 0 },
    [StaffSector.ILUMINACION]: { count: 0, totalAprobado: 0, totalPendiente: 0 },
    [StaffSector.STAGE]: { count: 0, totalAprobado: 0, totalPendiente: 0 },
    [StaffSector.OTRO]: { count: 0, totalAprobado: 0, totalPendiente: 0 },
  };

  const tipoBreakdown: Record<ShiftType, { count: number; totalAprobado: number; totalPendiente: number }> = {
    [ShiftType.SHOW]: { count: 0, totalAprobado: 0, totalPendiente: 0 },
    [ShiftType.JORNADA_ADICIONAL]: { count: 0, totalAprobado: 0, totalPendiente: 0 },
    [ShiftType.MENSUAL]: { count: 0, totalAprobado: 0, totalPendiente: 0 },
  };

  for (const s of allShifts) {
    if (s.status === ShiftStatus.APROBADO) {
      totalAprobado += s.monto;
      if (sectorBreakdown[s.staffMember.sector]) {
        sectorBreakdown[s.staffMember.sector].totalAprobado += s.monto;
      }
      if (tipoBreakdown[s.tipo]) {
        tipoBreakdown[s.tipo].totalAprobado += s.monto;
      }
    } else if (s.status === ShiftStatus.PENDIENTE) {
      totalPendiente += s.monto;
      if (sectorBreakdown[s.staffMember.sector]) {
        sectorBreakdown[s.staffMember.sector].totalPendiente += s.monto;
      }
      if (tipoBreakdown[s.tipo]) {
        tipoBreakdown[s.tipo].totalPendiente += s.monto;
      }
    } else if (s.status === ShiftStatus.RECHAZADO) {
      totalRechazado += s.monto;
    }

    if (sectorBreakdown[s.staffMember.sector]) {
      sectorBreakdown[s.staffMember.sector].count += 1;
    }
    if (tipoBreakdown[s.tipo]) {
      tipoBreakdown[s.tipo].count += 1;
    }
  }

  const pendientesCount = allShifts.filter((s) => s.status === ShiftStatus.PENDIENTE).length;
  const aprobadasCount = allShifts.filter((s) => s.status === ShiftStatus.APROBADO).length;
  const rechazadasCount = allShifts.filter((s) => s.status === ShiftStatus.RECHAZADO).length;

  // Filtrar jornadas a retornar según el estado seleccionado (o todas si es TODOS)
  const returnedShifts =
    options?.status && options.status !== "TODOS"
      ? allShifts.filter((s) => s.status === options.status)
      : allShifts;

  return {
    shifts: returnedShifts,
    metrics: {
      totalAprobado,
      totalPendiente,
      totalRechazado,
      totalJornadas: allShifts.length,
      pendientesCount,
      aprobadasCount,
      rechazadasCount,
    },
    sectorBreakdown,
    tipoBreakdown,
  };
}

export async function reviewStaffShift(
  shiftId: string,
  status: ShiftStatus,
  motivoRechazo?: string
) {
  const ctx = await requireStaffAdmin();

  const reviewerName = ctx.user
    ? `${ctx.user.nombre} ${ctx.user.apellido}`.trim()
    : "Admin Pagos";

  const updated = await prisma.staffShift.update({
    where: { id: shiftId },
    data: {
      status,
      motivoRechazo: status === ShiftStatus.RECHAZADO ? motivoRechazo?.trim() || "No especificado" : null,
      aprobadoPor: reviewerName,
      fechaRevision: new Date(),
    },
  });

  revalidatePath("/control-updr-admin/jornadas");
  revalidatePath("/staff");
  return updated;
}

export async function batchReviewStaffShifts(
  shiftIds: string[],
  status: ShiftStatus,
  motivoRechazo?: string
) {
  const ctx = await requireStaffAdmin();

  if (!shiftIds.length) return { count: 0 };

  const reviewerName = ctx.user
    ? `${ctx.user.nombre} ${ctx.user.apellido}`.trim()
    : "Admin Pagos";

  const res = await prisma.staffShift.updateMany({
    where: { id: { in: shiftIds } },
    data: {
      status,
      motivoRechazo: status === ShiftStatus.RECHAZADO ? motivoRechazo?.trim() || "No especificado" : null,
      aprobadoPor: reviewerName,
      fechaRevision: new Date(),
    },
  });

  revalidatePath("/control-updr-admin/jornadas");
  revalidatePath("/staff");
  return res;
}

// ==========================================
// 5. JORNADAS PREVIAS (HISTORIAL AGRUPADO POR MES Y USUARIO)
// ==========================================
const MESES_NOMBRES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export async function getAdminJornadasPrevias() {
  await requireStaffAdmin();

  const allShifts = await prisma.staffShift.findMany({
    include: {
      staffMember: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
          telefono: true,
          cuitCuil: true,
          sector: true,
          cbuAlias: true,
          activo: true,
          user: {
            select: {
              dni: true,
              celular: true,
            },
          },
        },
      },
    },
    orderBy: [{ fecha: "desc" }, { createdAt: "desc" }],
  });

  const monthMap = new Map<string, {
    key: string;
    anio: number;
    mes: number;
    mesNombre: string;
    totalMonto: number;
    totalAprobado: number;
    totalPendiente: number;
    totalRechazado: number;
    totalJornadas: number;
    userMap: Map<string, {
      staffMemberId: string;
      nombre: string;
      apellido: string;
      email: string;
      dniCuit: string;
      telefono: string;
      sector: StaffSector;
      cbuAlias: string | null;
      totalMonto: number;
      totalAprobado: number;
      totalPendiente: number;
      totalRechazado: number;
      cantJornadas: number;
      status: ShiftStatus;
      numerosOS: string[];
      facturas: string[];
      shifts: typeof allShifts;
    }>;
  }>();

  for (const s of allShifts) {
    const d = new Date(s.fecha);
    const anio = d.getUTCFullYear();
    const mes = d.getUTCMonth() + 1;
    const key = `${anio}-${String(mes).padStart(2, "0")}`;

    if (!monthMap.has(key)) {
      monthMap.set(key, {
        key,
        anio,
        mes,
        mesNombre: MESES_NOMBRES[mes - 1] || `Mes ${mes}`,
        totalMonto: 0,
        totalAprobado: 0,
        totalPendiente: 0,
        totalRechazado: 0,
        totalJornadas: 0,
        userMap: new Map(),
      });
    }

    const mGroup = monthMap.get(key)!;
    mGroup.totalMonto += s.monto;
    mGroup.totalJornadas += 1;
    if (s.status === ShiftStatus.APROBADO) mGroup.totalAprobado += s.monto;
    else if (s.status === ShiftStatus.PENDIENTE) mGroup.totalPendiente += s.monto;
    else if (s.status === ShiftStatus.RECHAZADO) mGroup.totalRechazado += s.monto;

    const mem = s.staffMember;
    const dniCuit = mem.cuitCuil || (mem as any).user?.dni || "-";
    const telefono = (mem as any).telefono || (mem as any).user?.celular || "-";

    if (!mGroup.userMap.has(mem.id)) {
      mGroup.userMap.set(mem.id, {
        staffMemberId: mem.id,
        nombre: mem.nombre,
        apellido: mem.apellido,
        email: mem.email,
        dniCuit,
        telefono,
        sector: mem.sector,
        cbuAlias: mem.cbuAlias || null,
        totalMonto: s.monto,
        totalAprobado: s.status === ShiftStatus.APROBADO ? s.monto : 0,
        totalPendiente: s.status === ShiftStatus.PENDIENTE ? s.monto : 0,
        totalRechazado: s.status === ShiftStatus.RECHAZADO ? s.monto : 0,
        cantJornadas: 1,
        status: s.status,
        numerosOS: s.numeroOS ? [s.numeroOS] : [],
        facturas: s.numeroFactura ? [s.numeroFactura] : [],
        shifts: [s],
      });
    } else {
      const u = mGroup.userMap.get(mem.id)!;
      u.shifts.push(s);
      u.totalMonto += s.monto;
      if (s.status === ShiftStatus.APROBADO) u.totalAprobado += s.monto;
      else if (s.status === ShiftStatus.PENDIENTE) u.totalPendiente += s.monto;
      else if (s.status === ShiftStatus.RECHAZADO) u.totalRechazado += s.monto;
      u.cantJornadas += 1;
      if (s.numeroOS && !u.numerosOS.includes(s.numeroOS)) {
        u.numerosOS.push(s.numeroOS);
      }
      if (s.numeroFactura && !u.facturas.includes(s.numeroFactura)) {
        u.facturas.push(s.numeroFactura);
      }
    }
  }

  const result = Array.from(monthMap.values()).map((mg) => {
    const usuarios = Array.from(mg.userMap.values()).map((u) => {
      const hasPending = u.shifts.some((s) => s.status === ShiftStatus.PENDIENTE);
      const allApproved = u.shifts.every((s) => s.status === ShiftStatus.APROBADO);
      const allRejected = u.shifts.every((s) => s.status === ShiftStatus.RECHAZADO);
      let status: ShiftStatus = ShiftStatus.PENDIENTE;
      if (allApproved) status = ShiftStatus.APROBADO;
      else if (allRejected) status = ShiftStatus.RECHAZADO;
      else if (hasPending) status = ShiftStatus.PENDIENTE;

      return {
        ...u,
        status,
      };
    });

    usuarios.sort((a, b) => {
      const osA = a.numerosOS[0] || "ZZZZ";
      const osB = b.numerosOS[0] || "ZZZZ";
      return osA.localeCompare(osB, undefined, { numeric: true });
    });

    for (const u of usuarios) {
      u.shifts.sort((a, b) => {
        const osA = a.numeroOS || "ZZZZ";
        const osB = b.numeroOS || "ZZZZ";
        const cmp = osA.localeCompare(osB, undefined, { numeric: true });
        if (cmp !== 0) return cmp;
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      });
    }

    return {
      key: mg.key,
      anio: mg.anio,
      mes: mg.mes,
      mesNombre: mg.mesNombre,
      totalMonto: mg.totalMonto,
      totalAprobado: mg.totalAprobado,
      totalPendiente: mg.totalPendiente,
      totalRechazado: mg.totalRechazado,
      totalJornadas: mg.totalJornadas,
      usuarios,
    };
  });

  return result;
}

export async function updateStaffShiftFactura(shiftId: string, numeroFactura: string) {
  const { staffMember, isAdminPagos } = await requireStaffMember();

  const shift = await prisma.staffShift.findUnique({
    where: { id: shiftId },
  });
  if (!shift) throw new Error("Jornada no encontrada");

  if (!isAdminPagos && shift.staffMemberId !== staffMember.id) {
    throw new Error("No tienes permisos para editar esta factura");
  }

  const updated = await prisma.staffShift.update({
    where: { id: shiftId },
    data: {
      numeroFactura: numeroFactura.trim() || null,
    },
  });

  revalidatePath("/staff");
  revalidatePath("/control-updr-admin/jornadas");
  return updated;
}

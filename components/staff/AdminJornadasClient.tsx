"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Download,
  UserPlus,
  Users,
  Search,
  DollarSign,
  Briefcase,
  AlertCircle,
  FileSpreadsheet,
  Settings,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckSquare,
  Square,
  SlidersHorizontal,
  ExternalLink,
  Edit2,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Layers,
  FileText,
  Sparkles,
  Hash,
  BadgeCheck,
} from "lucide-react";
import { StaffSector, StaffRole, ShiftType, ShiftStatus } from "@prisma/client";
import {
  getAdminShiftsOverview,
  reviewStaffShift,
  batchReviewStaffShifts,
  getStaffMembers,
  createStaffMember,
  updateStaffMember,
  toggleStaffMemberActive,
  getStaffRates,
  updateStaffRate,
} from "@/lib/actions/staffActions";
import * as XLSX from "xlsx";

const SECTORS: Array<{ value: StaffSector; label: string; icon: string }> = [
  { value: StaffSector.VIDEO, label: "Técnica de Video", icon: "📹" },
  { value: StaffSector.SONIDO, label: "Técnica de Sonido", icon: "🎧" },
  { value: StaffSector.PRODUCCION, label: "Producción", icon: "🎬" },
  { value: StaffSector.ILUMINACION, label: "Iluminación", icon: "💡" },
  { value: StaffSector.STAGE, label: "Stage / Plomos", icon: "🎸" },
  { value: StaffSector.OTRO, label: "Otro Sector", icon: "⚡" },
];

const TIPO_LABELS: Record<ShiftType, string> = {
  SHOW: "Show",
  PROGRAMA_EXTRA: "Programa Extra",
  ENSAYO: "Ensayo",
  OTRO: "Otro",
};

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const ALL_MONTHS = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

function getAvailableMonths(year: number) {
  if (year <= 2026) {
    // A partir de noviembre de 2026
    return ALL_MONTHS.filter((m) => m.value >= 11);
  }
  return ALL_MONTHS;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleDateString("es-AR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

type AdminJornadasClientProps = {
  initialOverview: Awaited<ReturnType<typeof getAdminShiftsOverview>>;
  initialMembers: Awaited<ReturnType<typeof getStaffMembers>>;
  initialRates: Awaited<ReturnType<typeof getStaffRates>>;
};

export default function AdminJornadasClient({
  initialOverview,
  initialMembers,
  initialRates,
}: AdminJornadasClientProps) {
  const [activeTab, setActiveTab] = useState<"APROBACIONES" | "STAFF" | "TARIFAS">("APROBACIONES");
  const [isPending, startTransition] = useTransition();

  // Estados de datos
  const [shiftsData, setShiftsData] = useState(initialOverview);
  const [members, setMembers] = useState(initialMembers);
  const [rates, setRates] = useState(initialRates);

  // Filtros de jornadas
  const [filterSector, setFilterSector] = useState<StaffSector | "TODOS">("TODOS");
  const [filterStatus, setFilterStatus] = useState<ShiftStatus | "TODOS">("TODOS");
  const [filterMemberId, setFilterMemberId] = useState<string>("TODOS");
  const [filterMonth, setFilterMonth] = useState<number | "TODOS">(() => {
    const curMonth = new Date().getMonth() + 1;
    return new Date().getFullYear() <= 2026 && curMonth < 11 ? 11 : curMonth;
  });
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState("");

  // Modo de visualización: Consolidada por Solicitud de Usuario vs Desglose Individual
  const [viewMode, setViewMode] = useState<"SOLICITUDES" | "DETALLADA">("SOLICITUDES");
  const [expandedSolicitudIds, setExpandedSolicitudIds] = useState<string[]>([]);

  // Selección múltiple para aprobación en lote
  const [selectedShiftIds, setSelectedShiftIds] = useState<string[]>([]);

  // Modal para Desaprobar / Rechazar con motivo (puede ser 1 o varias jornadas)
  const [rejectingShiftIds, setRejectingShiftIds] = useState<string[]>([]);
  const [rejectReason, setRejectReason] = useState("");

  // Modal para Nuevo Miembro de Staff
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [newMemberNombre, setNewMemberNombre] = useState("");
  const [newMemberApellido, setNewMemberApellido] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberTelefono, setNewMemberTelefono] = useState("");
  const [newMemberSector, setNewMemberSector] = useState<StaffSector>(StaffSector.SONIDO);
  const [newMemberRol, setNewMemberRol] = useState<StaffRole>(StaffRole.STAFF);
  const [newMemberCuit, setNewMemberCuit] = useState("");
  const [newMemberCbu, setNewMemberCbu] = useState("");
  const [memberFormError, setMemberFormError] = useState<string | null>(null);
  const [savingMember, setSavingMember] = useState(false);

  // Modal para Exportar por Mes a Excel
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportMonth, setExportMonth] = useState<number | "TODOS">(() => {
    const curMonth = new Date().getMonth() + 1;
    return new Date().getFullYear() <= 2026 && curMonth < 11 ? 11 : curMonth;
  });
  const [exportYear, setExportYear] = useState<number>(new Date().getFullYear());
  const [exportSector, setExportSector] = useState<StaffSector | "TODOS">("TODOS");
  const [exportStatus, setExportStatus] = useState<ShiftStatus | "TODOS">(ShiftStatus.APROBADO);
  const [isExporting, setIsExporting] = useState(false);

  // Agrupar jornadas por persona para la vista "1 Solicitud por Usuario por Mes"
  const solicitudesMensuales = useMemo(() => {
    const map = new Map<string, {
      staffMemberId: string;
      nombre: string;
      apellido: string;
      email: string;
      dniCuit: string;
      telefono: string;
      sector: StaffSector;
      cbuAlias: string | null;
      shifts: typeof shiftsData.shifts;
      totalMonto: number;
      totalAprobado: number;
      totalPendiente: number;
      cantJornadas: number;
      status: ShiftStatus;
      facturas: string[];
    }>();

    for (const s of shiftsData.shifts) {
      const mem = s.staffMember;
      const dniCuit = mem.cuitCuil || (mem as any).user?.dni || "-";
      const telefono = (mem as any).telefono || (mem as any).user?.celular || "-";

      const existing = map.get(mem.id);
      if (!existing) {
        map.set(mem.id, {
          staffMemberId: mem.id,
          nombre: mem.nombre,
          apellido: mem.apellido,
          email: mem.email,
          dniCuit,
          telefono,
          sector: mem.sector,
          cbuAlias: mem.cbuAlias || null,
          shifts: [s],
          totalMonto: s.monto,
          totalAprobado: s.status === ShiftStatus.APROBADO ? s.monto : 0,
          totalPendiente: s.status === ShiftStatus.PENDIENTE ? s.monto : 0,
          cantJornadas: 1,
          status: s.status,
          facturas: s.numeroFactura ? [s.numeroFactura] : [],
        });
      } else {
        existing.shifts.push(s);
        existing.totalMonto += s.monto;
        if (s.status === ShiftStatus.APROBADO) {
          existing.totalAprobado += s.monto;
        } else if (s.status === ShiftStatus.PENDIENTE) {
          existing.totalPendiente += s.monto;
        }
        existing.cantJornadas += 1;
        if (s.numeroFactura && !existing.facturas.includes(s.numeroFactura)) {
          existing.facturas.push(s.numeroFactura);
        }
      }
    }

    for (const sol of map.values()) {
      const hasPending = sol.shifts.some((s) => s.status === ShiftStatus.PENDIENTE);
      const allApproved = sol.shifts.every((s) => s.status === ShiftStatus.APROBADO);
      const allRejected = sol.shifts.every((s) => s.status === ShiftStatus.RECHAZADO);

      if (hasPending) {
        sol.status = ShiftStatus.PENDIENTE;
      } else if (allApproved) {
        sol.status = ShiftStatus.APROBADO;
      } else if (allRejected) {
        sol.status = ShiftStatus.RECHAZADO;
      } else {
        sol.status = ShiftStatus.PENDIENTE;
      }
    }

    return Array.from(map.values());
  }, [shiftsData.shifts]);

  const toggleExpandSolicitud = (id: string) => {
    setExpandedSolicitudIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleExpandAll = () => {
    if (expandedSolicitudIds.length === solicitudesMensuales.length) {
      setExpandedSolicitudIds([]);
    } else {
      setExpandedSolicitudIds(solicitudesMensuales.map((s) => s.staffMemberId));
    }
  };

  // Recargar jornadas aplicando los filtros actuales
  const applyFilters = (overrides?: {
    sector?: StaffSector | "TODOS";
    status?: ShiftStatus | "TODOS";
    staffMemberId?: string;
    mes?: number | "TODOS";
    search?: string;
  }) => {
    startTransition(async () => {
      try {
        const sector = overrides?.sector !== undefined ? overrides.sector : filterSector;
        const status = overrides?.status !== undefined ? overrides.status : filterStatus;
        const staffMemberId = overrides?.staffMemberId !== undefined ? overrides.staffMemberId : filterMemberId;
        const mes = overrides?.mes !== undefined ? overrides.mes : filterMonth;
        const search = overrides?.search !== undefined ? overrides.search : searchQuery;

        const refreshed = await getAdminShiftsOverview({
          sector,
          status,
          staffMemberId,
          mes,
          anio: filterYear,
          search,
        });
        setShiftsData(refreshed);
        setSelectedShiftIds([]);
      } catch (err: any) {
        console.error("Error al filtrar:", err);
      }
    });
  };

  // Acciones sobre una jornada o solicitud
  const handleApprove = async (shiftId: string) => {
    startTransition(async () => {
      try {
        await reviewStaffShift(shiftId, ShiftStatus.APROBADO);
        applyFilters();
      } catch (err: any) {
        alert(err.message || "Error al aprobar");
      }
    });
  };

  const handleApproveSolicitud = async (shiftIds: string[], personName: string) => {
    if (!confirm(`¿Confirmar y aprobar la Solicitud completa de ${personName} (${shiftIds.length} jornadas extras)?`)) return;
    startTransition(async () => {
      try {
        await batchReviewStaffShifts(shiftIds, ShiftStatus.APROBADO);
        applyFilters();
      } catch (err: any) {
        alert(err.message || "Error al aprobar solicitud");
      }
    });
  };

  const handleOpenRejectModal = (shiftIds: string[] | string) => {
    const ids = Array.isArray(shiftIds) ? shiftIds : [shiftIds];
    setRejectingShiftIds(ids);
    setRejectReason("");
  };

  const handleConfirmReject = async () => {
    if (!rejectingShiftIds.length) return;
    startTransition(async () => {
      try {
        await batchReviewStaffShifts(rejectingShiftIds, ShiftStatus.RECHAZADO, rejectReason);
        setRejectingShiftIds([]);
        applyFilters();
      } catch (err: any) {
        alert(err.message || "Error al desaprobar");
      }
    });
  };

  // Aprobación masiva
  const handleBatchApprove = async () => {
    if (!selectedShiftIds.length) return;
    if (!confirm(`¿Aprobar las ${selectedShiftIds.length} jornadas seleccionadas?`)) return;

    startTransition(async () => {
      try {
        await batchReviewStaffShifts(selectedShiftIds, ShiftStatus.APROBADO);
        applyFilters();
      } catch (err: any) {
        alert(err.message || "Error en aprobación masiva");
      }
    });
  };

  // Selección de todas las filas pendientes
  const handleToggleSelectAll = () => {
    const pendingIds = shiftsData.shifts
      .filter((s) => s.status === ShiftStatus.PENDIENTE)
      .map((s) => s.id);

    if (selectedShiftIds.length === pendingIds.length && pendingIds.length > 0) {
      setSelectedShiftIds([]);
    } else {
      setSelectedShiftIds(pendingIds);
    }
  };

  const handleToggleShiftSelection = (id: string) => {
    setSelectedShiftIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Exportar a Excel por Mes
  const executeExportToExcel = async () => {
    setIsExporting(true);
    try {
      // Obtenemos los datos exactos del período seleccionado
      const data = await getAdminShiftsOverview({
        mes: exportMonth,
        anio: exportYear,
        sector: exportSector,
        status: exportStatus,
      });

      if (!data.shifts.length) {
        alert("No se encontraron jornadas para el mes y filtros seleccionados.");
        return;
      }

      // 1. Agrupar por persona para la Hoja de Liquidación
      const personaMap = new Map<string, {
        nombre: string;
        apellido: string;
        sector: string;
        email: string;
        cuit: string;
        telefono: string;
        cbu: string;
        cantJornadas: number;
        totalAprobado: number;
        totalPendiente: number;
        totalGeneral: number;
      }>();

      for (const s of data.shifts) {
        const id = s.staffMember.id;
        const mem = s.staffMember;
        const dniCuit = mem.cuitCuil || (mem as any).user?.dni || "-";
        const telefono = (mem as any).telefono || (mem as any).user?.celular || "-";

        const current = personaMap.get(id) || {
          nombre: mem.nombre,
          apellido: mem.apellido,
          sector: SECTORS.find((sec) => sec.value === mem.sector)?.label || mem.sector,
          email: mem.email,
          cuit: dniCuit,
          telefono: telefono,
          cbu: mem.cbuAlias || "-",
          cantJornadas: 0,
          totalAprobado: 0,
          totalPendiente: 0,
          totalGeneral: 0,
        };

        current.cantJornadas += 1;
        if (s.status === ShiftStatus.APROBADO) {
          current.totalAprobado += s.monto;
        } else if (s.status === ShiftStatus.PENDIENTE) {
          current.totalPendiente += s.monto;
        }
        current.totalGeneral += s.monto;
        personaMap.set(id, current);
      }

      const rowsResumen = Array.from(personaMap.values()).map((p) => ({
        "Nombre": p.nombre,
        "Apellido": p.apellido,
        "DNI / CUIT": p.cuit,
        "Teléfono": p.telefono,
        "Email": p.email,
        "Sector": p.sector,
        "CBU / Alias Transferencia": p.cbu,
        "Cant. Jornadas": p.cantJornadas,
        "Total Aprobado a Pagar ($)": p.totalAprobado,
        "Total Pendiente ($)": p.totalPendiente,
      }));

      // Agregar fila de Totales al final del resumen
      const totalGeneralAprobado = rowsResumen.reduce((acc, r) => acc + r["Total Aprobado a Pagar ($)"], 0);
      const totalGeneralPendiente = rowsResumen.reduce((acc, r) => acc + r["Total Pendiente ($)"], 0);
      const totalJornadasCount = rowsResumen.reduce((acc, r) => acc + r["Cant. Jornadas"], 0);

      rowsResumen.push({
        "Nombre": "--- TOTAL",
        "Apellido": "GENERAL ---",
        "DNI / CUIT": "-",
        "Teléfono": "-",
        "Email": "-",
        "Sector": "-",
        "CBU / Alias Transferencia": "-",
        "Cant. Jornadas": totalJornadasCount,
        "Total Aprobado a Pagar ($)": totalGeneralAprobado,
        "Total Pendiente ($)": totalGeneralPendiente,
      });

      // 2. Detalle individual de cada jornada
      const rowsDetalle: Array<Record<string, any>> = data.shifts.map((s) => ({
        "Fecha": formatDate(s.fecha),
        "Sector": SECTORS.find((sec) => sec.value === s.staffMember.sector)?.label || s.staffMember.sector,
        "Nombre": s.staffMember.nombre,
        "Apellido": s.staffMember.apellido,
        "DNI / CUIT": s.staffMember.cuitCuil || (s.staffMember as any).user?.dni || "-",
        "Teléfono": (s.staffMember as any).telefono || (s.staffMember as any).user?.celular || "-",
        "Email": s.staffMember.email,
        "CBU / Alias": s.staffMember.cbuAlias || "-",
        "Tipo de Jornada": TIPO_LABELS[s.tipo] || s.tipo,
        "Evento / Lugar": s.titulo,
        "Detalle / Obs": s.descripcion || "-",
        "N° Factura": s.numeroFactura || "-",
        "Monto ($)": s.monto,
        "Estado": s.status as string,
        "Aprobado Por": s.aprobadoPor || "-",
        "Motivo Rechazo": s.motivoRechazo || "-",
      }));

      rowsDetalle.push({
        "Fecha": "-",
        "Sector": "-",
        "Nombre": "--- TOTAL",
        "Apellido": "---",
        "DNI / CUIT": "-",
        "Teléfono": "-",
        "Email": "-",
        "CBU / Alias": "-",
        "Tipo de Jornada": "-",
        "Evento / Lugar": "-",
        "Detalle / Obs": "-",
        "N° Factura": "-",
        "Monto ($)": data.metrics.totalAprobado + data.metrics.totalPendiente,
        "Estado": "-",
        "Aprobado Por": "-",
        "Motivo Rechazo": "-",
      });

      const workbook = XLSX.utils.book_new();

      // Hoja 1: Liquidación por Persona
      const wsResumen = XLSX.utils.json_to_sheet(rowsResumen);
      wsResumen["!cols"] = [
        { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 24 },
        { wch: 18 }, { wch: 24 }, { wch: 14 }, { wch: 24 }, { wch: 18 },
      ];
      XLSX.utils.book_append_sheet(workbook, wsResumen, "Liquidacion por Persona");

      // Hoja 2: Detalle de Jornadas
      const wsDetalle = XLSX.utils.json_to_sheet(rowsDetalle);
      wsDetalle["!cols"] = [
        { wch: 12 }, { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 16 },
        { wch: 16 }, { wch: 24 }, { wch: 18 }, { wch: 16 }, { wch: 25 },
        { wch: 25 }, { wch: 16 }, { wch: 14 }, { wch: 12 }, { wch: 18 }, { wch: 22 },
      ];
      XLSX.utils.book_append_sheet(workbook, wsDetalle, "Detalle de Jornadas");

      const mesNombre = exportMonth === "TODOS" ? "Periodo_Completo" : MESES[Number(exportMonth) - 1];
      const sectorNombre = exportSector === "TODOS" ? "Todos_Sectores" : exportSector;
      const fileName = `Liquidacion_Staff_${mesNombre}_${exportYear}_${sectorNombre}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      setIsExportModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Error al generar el archivo Excel");
    } finally {
      setIsExporting(false);
    }
  };

  // Crear nuevo miembro de staff
  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberNombre.trim() || !newMemberApellido.trim() || !newMemberEmail.trim()) {
      setMemberFormError("Nombre, apellido y email son requeridos");
      return;
    }

    setSavingMember(true);
    setMemberFormError(null);

    try {
      await createStaffMember({
        nombre: newMemberNombre,
        apellido: newMemberApellido,
        email: newMemberEmail,
        sector: newMemberSector,
        rol: newMemberRol,
        cuitCuil: newMemberCuit || undefined,
        cbuAlias: newMemberCbu || undefined,
        telefono: newMemberTelefono || undefined,
      });

      const refreshed = await getStaffMembers();
      setMembers(refreshed);
      setIsMemberModalOpen(false);

      // Limpiar formulario
      setNewMemberNombre("");
      setNewMemberApellido("");
      setNewMemberEmail("");
      setNewMemberTelefono("");
      setNewMemberCuit("");
      setNewMemberCbu("");
    } catch (err: any) {
      setMemberFormError(err.message || "Error al agregar miembro");
    } finally {
      setSavingMember(false);
    }
  };

  // Toggle estado activo de miembro
  const handleToggleMemberActive = async (memberId: string, currentStatus: boolean) => {
    startTransition(async () => {
      try {
        await toggleStaffMemberActive(memberId, !currentStatus);
        const refreshed = await getStaffMembers();
        setMembers(refreshed);
      } catch (err: any) {
        alert(err.message || "Error al cambiar estado");
      }
    });
  };

  // Guardar tarifa
  const handleSaveRate = async (sector: StaffSector, tipo: ShiftType, monto: number) => {
    startTransition(async () => {
      try {
        await updateStaffRate(sector, tipo, monto);
        const refreshed = await getStaffRates();
        setRates(refreshed);
        alert("Tarifa actualizada exitosamente");
      } catch (err: any) {
        alert(err.message || "Error al actualizar tarifa");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#050b1a] text-white p-4 sm:p-6 md:p-10 font-sans relative overflow-hidden">
      {/* Luces sutiles de fondo */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-yellow/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full relative z-10 space-y-8">
        {/* Header Superior */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow text-xs font-bold mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Administración de Pagos & Liquidaciones</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wide">
              Gestión de Staff y Jornadas
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Aprobación de shows, programas extras y ensayos por sector (Video, Sonido, Producción).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/staff"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs sm:text-sm font-semibold transition-colors"
            >
              <span>Ver mi portal staff</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/control-updr-admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-yellow/10 hover:bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30 text-xs sm:text-sm font-semibold transition-colors"
            >
              <span>← Panel Admin General</span>
            </Link>
          </div>
        </header>

        {/* Pestañas de Navegación del Módulo */}
        <div className="flex border-b border-white/10 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("APROBACIONES")}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "APROBACIONES"
                ? "border-brand-yellow text-brand-yellow bg-brand-yellow/5"
                : "border-transparent text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Aprobación de Jornadas</span>
            {shiftsData.metrics.pendientesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-mono border border-amber-500/40">
                {shiftsData.metrics.pendientesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("STAFF")}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "STAFF"
                ? "border-brand-yellow text-brand-yellow bg-brand-yellow/5"
                : "border-transparent text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Miembros del Staff</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 text-[11px] font-mono">
              {members.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("TARIFAS")}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "TARIFAS"
                ? "border-brand-yellow text-brand-yellow bg-brand-yellow/5"
                : "border-transparent text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Tarifario Base</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: APROBACIÓN DE JORNADAS Y LIQUIDACIÓN             */}
        {/* ======================================================== */}
        {activeTab === "APROBACIONES" && (
          <div className="space-y-6">
            {/* Tarjetas de Resumen General */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 backdrop-blur-md">
                <div className="flex items-center justify-between text-emerald-400 mb-1">
                  <span className="text-xs uppercase font-bold tracking-wider">Total Aprobado</span>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-300">
                  {formatCurrency(shiftsData.metrics.totalAprobado)}
                </div>
                <p className="text-[11px] text-emerald-400/80 mt-1">
                  {shiftsData.metrics.aprobadasCount} jornada(s) lista(s) para pagar
                </p>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 backdrop-blur-md">
                <div className="flex items-center justify-between text-amber-400 mb-1">
                  <span className="text-xs uppercase font-bold tracking-wider">Total Pendiente</span>
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-300">
                  {formatCurrency(shiftsData.metrics.totalPendiente)}
                </div>
                <p className="text-[11px] text-amber-400/80 mt-1">
                  {shiftsData.metrics.pendientesCount} jornada(s) por revisar
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                <div className="flex items-center justify-between text-neutral-400 mb-1">
                  <span className="text-xs uppercase font-bold tracking-wider">Desglose Sonido</span>
                  <span>🎧</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {formatCurrency(shiftsData.sectorBreakdown.SONIDO.totalAprobado)}
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  {shiftsData.sectorBreakdown.SONIDO.count} jornadas registradas
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                <div className="flex items-center justify-between text-neutral-400 mb-1">
                  <span className="text-xs uppercase font-bold tracking-wider">Desglose Video</span>
                  <span>📹</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {formatCurrency(shiftsData.sectorBreakdown.VIDEO.totalAprobado)}
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  {shiftsData.sectorBreakdown.VIDEO.count} jornadas registradas
                </p>
              </div>
            </div>

            {/* Barra de Filtros */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-yellow uppercase tracking-wider">
                  <Filter className="w-4 h-4" />
                  <span>Filtros de Búsqueda</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setExportMonth(filterMonth);
                      setExportSector(filterSector);
                      setIsExportModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all shadow-sm hover:scale-[1.02]"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Exportar a Excel por Mes</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* Filtro Sector */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-400 mb-1">
                    Sector
                  </label>
                  <select
                    value={filterSector}
                    onChange={(e) => {
                      const val = e.target.value as StaffSector | "TODOS";
                      setFilterSector(val);
                      applyFilters({ sector: val });
                    }}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                  >
                    <option value="TODOS">Todos los sectores</option>
                    {SECTORS.map((sec) => (
                      <option key={sec.value} value={sec.value} className="bg-neutral-900">
                        {sec.icon} {sec.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro Estado */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-400 mb-1">
                    Estado
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => {
                      const val = e.target.value as ShiftStatus | "TODOS";
                      setFilterStatus(val);
                      applyFilters({ status: val });
                    }}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                  >
                    <option value="TODOS">Todos los estados</option>
                    <option value={ShiftStatus.PENDIENTE} className="bg-neutral-900 text-amber-300">
                      🟡 Solo Pendientes ({shiftsData.metrics.pendientesCount})
                    </option>
                    <option value={ShiftStatus.APROBADO} className="bg-neutral-900 text-emerald-300">
                      🟢 Aprobados ({shiftsData.metrics.aprobadasCount})
                    </option>
                    <option value={ShiftStatus.RECHAZADO} className="bg-neutral-900 text-red-300">
                      🔴 Desaprobados ({shiftsData.metrics.rechazadasCount})
                    </option>
                  </select>
                </div>

                {/* Filtro Mes */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-400 mb-1">
                    Mes
                  </label>
                  <select
                    value={filterMonth}
                    onChange={(e) => {
                      const val = e.target.value === "TODOS" ? "TODOS" : Number(e.target.value);
                      setFilterMonth(val);
                      applyFilters({ mes: val });
                    }}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                  >
                    <option value="TODOS">
                      {filterYear <= 2026 ? `Período ${filterYear} (Nov - Dic)` : `Todo el año ${filterYear}`}
                    </option>
                    {getAvailableMonths(filterYear).map((m) => (
                      <option key={m.value} value={m.value} className="bg-neutral-900">
                        {m.label} {filterYear}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Buscador de Persona / Título */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-400 mb-1">
                    Buscar
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nombre, lugar o factura..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        applyFilters({ search: e.target.value });
                      }}
                      className="w-full bg-black/40 border border-white/15 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-brand-yellow"
                    />
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Selector de Modo de Vista */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="inline-flex p-1 bg-black/40 border border-white/10 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setViewMode("SOLICITUDES")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    viewMode === "SOLICITUDES"
                      ? "bg-brand-yellow text-black shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>1 Solicitud por Usuario ({solicitudesMensuales.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("DETALLADA")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    viewMode === "DETALLADA"
                      ? "bg-brand-yellow text-black shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Desglose por Jornada ({shiftsData.shifts.length})</span>
                </button>
              </div>

              {viewMode === "SOLICITUDES" && solicitudesMensuales.length > 0 && (
                <button
                  type="button"
                  onClick={handleToggleExpandAll}
                  className="text-xs text-neutral-400 hover:text-brand-yellow transition-colors font-semibold flex items-center gap-1 self-end sm:self-center"
                >
                  <span>
                    {expandedSolicitudIds.length === solicitudesMensuales.length
                      ? "Contraer todos los desgloses"
                      : "Expandir todos los desgloses"}
                  </span>
                  {expandedSolicitudIds.length === solicitudesMensuales.length ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {/* VISTA 1: 1 SOLICITUD POR USUARIO POR MES (CONSOLIDADA) */}
            {viewMode === "SOLICITUDES" && (
              <div className="space-y-4">
                {solicitudesMensuales.length === 0 ? (
                  <div className="bg-white/5 border border-dashed border-white/15 rounded-3xl p-10 text-center text-neutral-400 text-xs">
                    No se encontraron solicitudes con los filtros seleccionados.
                  </div>
                ) : (
                  solicitudesMensuales.map((sol) => {
                    const isExpanded = expandedSolicitudIds.includes(sol.staffMemberId);
                    const secInfo = SECTORS.find((s) => s.value === sol.sector);
                    const pendingShifts = sol.shifts.filter((s) => s.status === ShiftStatus.PENDIENTE);
                    const hasPending = pendingShifts.length > 0;

                    return (
                      <div
                        key={sol.staffMemberId}
                        className={`bg-white/5 border rounded-2xl overflow-hidden backdrop-blur-md transition-all ${
                          hasPending
                            ? "border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.06)]"
                            : sol.status === ShiftStatus.APROBADO
                            ? "border-emerald-500/20"
                            : "border-white/10"
                        }`}
                      >
                        {/* Ficha Principal de la Solicitud */}
                        <div className="p-4 sm:p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-5 bg-gradient-to-r from-white/[0.03] to-transparent">
                          {/* Datos del Técnico / Solicitante */}
                          <div className="space-y-3 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/15 border border-brand-yellow/40 text-brand-yellow text-xs font-bold">
                                <span>{secInfo?.icon || "⚡"}</span>
                                <span>{secInfo?.label || sol.sector}</span>
                              </span>

                              {sol.status === ShiftStatus.APROBADO && (
                                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>SOLICITUD APROBADA</span>
                                </span>
                              )}
                              {sol.status === ShiftStatus.PENDIENTE && (
                                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                                  <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                  <span>SOLICITUD PENDIENTE</span>
                                </span>
                              )}
                              {sol.status === ShiftStatus.RECHAZADO && (
                                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/30 text-[11px] font-bold">
                                  <XCircle className="w-3.5 h-3.5 text-red-400" />
                                  <span>SOLICITUD DESAPROBADA</span>
                                </span>
                              )}

                              <span className="text-xs text-neutral-400">
                                • {sol.cantJornadas} jornada{sol.cantJornadas === 1 ? "" : "s"} extra{sol.cantJornadas === 1 ? "" : "s"}
                              </span>
                            </div>

                            {/* Datos Requeridos: NOMBRE, APELLIDO, DNI o CUIT, NUM TELÉFONO, CORREO ELECTRÓNICO */}
                            <div className="bg-black/40 border border-white/10 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-xs">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                                  NOMBRE:
                                </span>
                                <span className="text-white font-bold text-sm tracking-wide">
                                  {sol.nombre}
                                </span>
                              </div>

                              <div>
                                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                                  APELLIDO:
                                </span>
                                <span className="text-white font-bold text-sm tracking-wide">
                                  {sol.apellido}
                                </span>
                              </div>

                              <div>
                                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                                  DNI o CUIT:
                                </span>
                                <span className="text-brand-yellow font-mono font-semibold text-xs">
                                  {sol.dniCuit}
                                </span>
                              </div>

                              <div>
                                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                                  NUM TELÉFONO:
                                </span>
                                <span className="text-emerald-400 font-mono font-semibold text-xs flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-neutral-400" />
                                  <span>{sol.telefono}</span>
                                </span>
                              </div>

                              <div className="sm:col-span-2">
                                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                                  CORREO ELECTRÓNICO:
                                </span>
                                <span className="text-neutral-200 font-mono text-xs flex items-center gap-1 truncate">
                                  <Mail className="w-3 h-3 text-neutral-400 shrink-0" />
                                  <span>{sol.email}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Resumen Económico y Acciones para Florencia */}
                          <div className="flex flex-col sm:flex-row xl:flex-col items-start sm:items-center xl:items-end justify-between xl:justify-center gap-4 pt-3 xl:pt-0 border-t xl:border-t-0 border-white/10 shrink-0">
                            <div className="text-left xl:text-right">
                              <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
                                Total de la Solicitud
                              </div>
                              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                {formatCurrency(sol.totalMonto)}
                              </div>
                              <div className="text-[11px] text-neutral-400 mt-0.5">
                                {sol.totalPendiente > 0 && (
                                  <span className="text-amber-400 font-semibold mr-2">
                                    Pendiente: {formatCurrency(sol.totalPendiente)}
                                  </span>
                                )}
                                {sol.totalAprobado > 0 && (
                                  <span className="text-emerald-400 font-semibold">
                                    Aprobado: {formatCurrency(sol.totalAprobado)}
                                  </span>
                                )}
                              </div>
                              {sol.cbuAlias && (
                                <div className="text-[10px] font-mono text-neutral-400 mt-1">
                                  CBU/Alias: {sol.cbuAlias}
                                </div>
                              )}
                              {sol.facturas.length > 0 ? (
                                <div className="text-[10px] text-brand-yellow font-mono mt-0.5">
                                  Fac: {sol.facturas.join(", ")}
                                </div>
                              ) : (
                                <div className="text-[10px] text-neutral-500 italic mt-0.5">
                                  Sin factura emitida aún
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                              {hasPending && (
                                <button
                                  onClick={() =>
                                    handleApproveSolicitud(
                                      pendingShifts.map((s) => s.id),
                                      `${sol.nombre} ${sol.apellido}`
                                    )
                                  }
                                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs transition-all shadow-md active:scale-95"
                                  title="Aprobar todas las jornadas pendientes de esta solicitud"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Aprobar Solicitud Completa</span>
                                </button>
                              )}

                              {sol.shifts.some((s) => s.status !== ShiftStatus.RECHAZADO) && (
                                <button
                                  onClick={() => handleOpenRejectModal(sol.shifts.map((s) => s.id))}
                                  className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-colors"
                                  title="Desaprobar solicitud"
                                >
                                  <XCircle className="w-4 h-4" />
                                  <span>Desaprobar</span>
                                </button>
                              )}

                              <button
                                onClick={() => toggleExpandSolicitud(sol.staffMemberId)}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 text-xs font-semibold transition-colors"
                              >
                                <span>{isExpanded ? "Ocultar Desglose" : `Ver Desglose (${sol.cantJornadas})`}</span>
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Desglose Expandible */}
                        {isExpanded && (
                          <div className="p-4 sm:p-5 bg-black/40 border-t border-white/10 space-y-3">
                            <div className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 flex items-center justify-between">
                              <span>Desglose de las {sol.cantJornadas} jornadas extras incluidas:</span>
                              <span className="text-white font-mono">{formatCurrency(sol.totalMonto)}</span>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-black/30 border-b border-white/10 uppercase tracking-wider text-[10px] text-neutral-400">
                                  <tr>
                                    <th className="p-2.5">Fecha</th>
                                    <th className="p-2.5">Tipo & Evento</th>
                                    <th className="p-2.5">Observaciones</th>
                                    <th className="p-2.5">N° Factura</th>
                                    <th className="p-2.5 text-right">Monto</th>
                                    <th className="p-2.5 text-center">Estado</th>
                                    <th className="p-2.5 text-center pr-3">Acción</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                  {sol.shifts.map((s) => (
                                    <tr key={s.id} className="hover:bg-white/5 transition-colors">
                                      <td className="p-2.5 whitespace-nowrap font-medium text-neutral-300">
                                        {formatDate(s.fecha)}
                                      </td>
                                      <td className="p-2.5">
                                        <span className="font-bold text-white mr-1.5">{s.titulo}</span>
                                        <span className="text-[10px] text-brand-yellow font-mono">
                                          [{TIPO_LABELS[s.tipo] || s.tipo}]
                                        </span>
                                      </td>
                                      <td className="p-2.5 text-neutral-300 max-w-xs truncate">
                                        {s.descripcion || "-"}
                                      </td>
                                      <td className="p-2.5 font-mono text-neutral-300">
                                        {s.numeroFactura || (
                                          <span className="text-neutral-500 italic">Pendiente</span>
                                        )}
                                      </td>
                                      <td className="p-2.5 text-right font-black text-white">
                                        {formatCurrency(s.monto)}
                                      </td>
                                      <td className="p-2.5 text-center">
                                        {s.status === ShiftStatus.APROBADO && (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                                            <CheckCircle2 className="w-3 h-3" /> Aprobada
                                          </span>
                                        )}
                                        {s.status === ShiftStatus.PENDIENTE && (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                                            <Clock className="w-3 h-3" /> Pendiente
                                          </span>
                                        )}
                                        {s.status === ShiftStatus.RECHAZADO && (
                                          <span
                                            title={`Motivo: ${s.motivoRechazo || "Sin motivo"}`}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold cursor-help"
                                          >
                                            <XCircle className="w-3 h-3" /> Rechazada
                                          </span>
                                        )}
                                      </td>
                                      <td className="p-2.5 text-center pr-3">
                                        <div className="flex items-center justify-center gap-1">
                                          {s.status !== ShiftStatus.APROBADO && (
                                            <button
                                              onClick={() => handleApprove(s.id)}
                                              title="Aprobar esta jornada"
                                              className="p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                            >
                                              <CheckCircle2 className="w-3.5 h-3.5" />
                                            </button>
                                          )}
                                          {s.status !== ShiftStatus.RECHAZADO && (
                                            <button
                                              onClick={() => handleOpenRejectModal(s.id)}
                                              title="Desaprobar esta jornada"
                                              className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                                            >
                                              <XCircle className="w-3.5 h-3.5" />
                                            </button>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* VISTA 2: DESGLOSE DETALLADO POR JORNADA */}
            {viewMode === "DETALLADA" && (
              <>
                {/* Barra de Acciones Masivas */}
                {selectedShiftIds.length > 0 && (
                  <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 px-4 backdrop-blur-md animate-fadeIn">
                    <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
                      <CheckSquare className="w-4 h-4" />
                      <span>{selectedShiftIds.length} jornada(s) pendiente(s) seleccionada(s)</span>
                    </div>
                    <button
                      onClick={handleBatchApprove}
                      className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs transition-all shadow-md"
                    >
                      ✓ Aprobar todas las seleccionadas
                    </button>
                  </div>
                )}

                {/* Tabla de Jornadas */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-black/40 border-b border-white/10 uppercase tracking-wider text-[11px] text-neutral-400 font-semibold">
                        <tr>
                          <th className="p-3.5 pl-4 w-10">
                            <button
                              type="button"
                              onClick={handleToggleSelectAll}
                              title="Seleccionar todas las pendientes"
                              className="text-neutral-400 hover:text-white"
                            >
                              <CheckSquare className="w-4 h-4" />
                            </button>
                          </th>
                          <th className="p-3.5">Fecha</th>
                          <th className="p-3.5">Staff / Persona</th>
                          <th className="p-3.5">DNI/CUIT & Teléfono</th>
                          <th className="p-3.5">Sector</th>
                          <th className="p-3.5">Tipo & Evento</th>
                          <th className="p-3.5">Factura</th>
                          <th className="p-3.5 text-right">Monto</th>
                          <th className="p-3.5 text-center">Estado</th>
                          <th className="p-3.5 text-center pr-4">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {shiftsData.shifts.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="p-8 text-center text-neutral-400 text-xs">
                              No se encontraron jornadas con los filtros seleccionados.
                            </td>
                          </tr>
                        ) : (
                          shiftsData.shifts.map((shift) => {
                            const isPendingShift = shift.status === ShiftStatus.PENDIENTE;
                            const isSelected = selectedShiftIds.includes(shift.id);
                            const secInfo = SECTORS.find((s) => s.value === shift.staffMember.sector);
                            const dniCuit = shift.staffMember.cuitCuil || (shift.staffMember as any).user?.dni || "-";
                            const telefono = (shift.staffMember as any).telefono || (shift.staffMember as any).user?.celular || "-";

                            return (
                              <tr
                                key={shift.id}
                                className={`hover:bg-white/5 transition-colors ${
                                  isSelected ? "bg-amber-500/5" : ""
                                }`}
                              >
                                <td className="p-3.5 pl-4">
                                  {isPendingShift ? (
                                    <button
                                      type="button"
                                      onClick={() => handleToggleShiftSelection(shift.id)}
                                      className="text-neutral-400 hover:text-white"
                                    >
                                      {isSelected ? (
                                        <CheckSquare className="w-4 h-4 text-brand-yellow" />
                                      ) : (
                                        <Square className="w-4 h-4" />
                                      )}
                                    </button>
                                  ) : (
                                    <span className="w-4 h-4 inline-block text-neutral-600">-</span>
                                  )}
                                </td>

                                <td className="p-3.5 whitespace-nowrap font-medium text-neutral-300">
                                  {formatDate(shift.fecha)}
                                </td>

                                <td className="p-3.5 whitespace-nowrap">
                                  <div className="font-bold text-white">
                                    {shift.staffMember.apellido}, {shift.staffMember.nombre}
                                  </div>
                                  <div className="text-[11px] text-neutral-400">
                                    {shift.staffMember.email}
                                  </div>
                                </td>

                                <td className="p-3.5 whitespace-nowrap font-mono text-[11px] text-neutral-300">
                                  <div className="text-brand-yellow font-semibold">
                                    CUIT/DNI: {dniCuit}
                                  </div>
                                  <div className="text-neutral-400 flex items-center gap-1 text-[10px]">
                                    <Phone className="w-2.5 h-2.5" />
                                    <span>{telefono}</span>
                                  </div>
                                </td>

                                <td className="p-3.5 whitespace-nowrap">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-neutral-300">
                                    <span>{secInfo?.icon || "⚡"}</span>
                                    <span>{secInfo?.label || shift.staffMember.sector}</span>
                                  </span>
                                </td>

                                <td className="p-3.5 max-w-xs">
                                  <div className="font-semibold text-white">
                                    {shift.titulo}
                                  </div>
                                  <div className="text-[11px] text-neutral-400">
                                    <span className="font-medium text-brand-yellow mr-1">
                                      [{TIPO_LABELS[shift.tipo] || shift.tipo}]
                                    </span>
                                    {shift.descripcion || ""}
                                  </div>
                                </td>

                                <td className="p-3.5 whitespace-nowrap text-neutral-400 font-mono text-[11px]">
                                  {shift.numeroFactura ? (
                                    <div className="text-white font-medium">
                                      {shift.numeroFactura}
                                    </div>
                                  ) : (
                                    <span className="text-neutral-500">Sin factura</span>
                                  )}
                                </td>

                                <td className="p-3.5 whitespace-nowrap text-right font-black text-white text-sm">
                                  {formatCurrency(shift.monto)}
                                </td>

                                <td className="p-3.5 whitespace-nowrap text-center">
                                  {shift.status === ShiftStatus.APROBADO && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                                      <CheckCircle2 className="w-3 h-3" /> Aprobado
                                    </span>
                                  )}
                                  {shift.status === ShiftStatus.PENDIENTE && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-bold">
                                      <Clock className="w-3 h-3" /> Pendiente
                                    </span>
                                  )}
                                  {shift.status === ShiftStatus.RECHAZADO && (
                                    <span
                                      title={`Motivo: ${shift.motivoRechazo || "Sin motivo"}`}
                                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-[11px] font-bold cursor-help"
                                    >
                                      <XCircle className="w-3 h-3" /> Desaprobado
                                    </span>
                                  )}
                                </td>

                                <td className="p-3.5 whitespace-nowrap text-center pr-4">
                                  <div className="flex items-center justify-center gap-1.5">
                                    {shift.status !== ShiftStatus.APROBADO && (
                                      <button
                                        onClick={() => handleApprove(shift.id)}
                                        title="Aprobar jornada"
                                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                                      >
                                        <CheckCircle2 className="w-4 h-4" />
                                      </button>
                                    )}

                                    {shift.status !== ShiftStatus.RECHAZADO && (
                                      <button
                                        onClick={() => handleOpenRejectModal(shift.id)}
                                        title="Desaprobar / Rechazar"
                                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: GESTIÓN DE STAFF (WHITELIST / LISTA BLANCA)       */}
        {/* ======================================================== */}
        {activeTab === "STAFF" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-yellow" />
                  <span>Personal Autorizado de Staff</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Solo los integrantes activos en esta lista blanca pueden entrar al panel confidencial de jornadas.
                </p>
              </div>

              <button
                onClick={() => {
                  setMemberFormError(null);
                  setIsMemberModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-yellow to-yellow-500 text-black font-bold text-xs transition-all hover:scale-[1.02] shadow-md shadow-brand-yellow/20"
              >
                <UserPlus className="w-4 h-4 stroke-[3]" />
                <span>Agregar Miembro de Staff</span>
              </button>
            </div>

            {/* Tabla de Miembros */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/40 border-b border-white/10 uppercase tracking-wider text-[11px] text-neutral-400 font-semibold">
                    <tr>
                      <th className="p-3.5 pl-4">Persona</th>
                      <th className="p-3.5">Email (Acceso)</th>
                      <th className="p-3.5">Sector</th>
                      <th className="p-3.5">Rol</th>
                      <th className="p-3.5">Datos Fiscales / CBU</th>
                      <th className="p-3.5 text-right">Aprobado Acum.</th>
                      <th className="p-3.5 text-center">Estado Acceso</th>
                      <th className="p-3.5 text-center pr-4">Habilitar / Deshabilitar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {members.map((m) => {
                      const secInfo = SECTORS.find((s) => s.value === m.sector);
                      return (
                        <tr key={m.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3.5 pl-4 whitespace-nowrap">
                            <div className="font-bold text-white text-sm">
                              {m.nombre} {m.apellido}
                            </div>
                            <div className="text-[11px] text-neutral-500">
                              {m.user ? `Usuario vinculado: @${m.user.username}` : "Esperando primer login con email"}
                            </div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap font-mono text-neutral-300">
                            {m.email}
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-neutral-300">
                              <span>{secInfo?.icon || "⚡"}</span>
                              <span>{secInfo?.label || m.sector}</span>
                            </span>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            {m.rol === StaffRole.ADMIN_PAGOS ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-brand-yellow border border-brand-yellow/30 text-[10px] font-bold">
                                👑 Admin Pagos
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/10 text-[10px]">
                                Staff
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 whitespace-nowrap font-mono text-[11px] text-neutral-300">
                            <div>CUIT/DNI: {m.cuitCuil || (m as any).user?.dni || "-"}</div>
                            <div className="text-emerald-400">Tel: {(m as any).telefono || (m as any).user?.celular || "-"}</div>
                            <div className="text-neutral-400">CBU: {m.cbuAlias || "-"}</div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap text-right font-black text-emerald-400 text-sm">
                            {formatCurrency(m.stats.totalAprobado)}
                          </td>

                          <td className="p-3.5 whitespace-nowrap text-center">
                            {m.activo ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                                <UserCheck className="w-3.5 h-3.5" /> Habilitado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-[11px] font-bold">
                                <UserX className="w-3.5 h-3.5" /> Bloqueado
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 whitespace-nowrap text-center pr-4">
                            <button
                              onClick={() => handleToggleMemberActive(m.id, m.activo)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                                m.activo
                                  ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                                  : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              }`}
                            >
                              {m.activo ? "Desactivar" : "Activar"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: TARIFARIO BASE CONFIGURABLE                       */}
        {/* ======================================================== */}
        {activeTab === "TARIFAS" && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-brand-yellow" />
                <span>Tarifario Base de Jornadas Extras</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Estos montos se autocompletan automáticamente cuando un técnico o productor de cada sector carga una jornada. Podés modificarlos en cualquier momento sin tocar código.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SECTORS.map((sec) => {
                const sectorRates = rates.filter((r) => r.sector === sec.value);
                return (
                  <div key={sec.value} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                      <span className="text-xl">{sec.icon}</span>
                      <h3 className="font-bold text-white text-sm">{sec.label}</h3>
                    </div>

                    <div className="space-y-3">
                      {(["SHOW", "PROGRAMA_EXTRA", "ENSAYO"] as ShiftType[]).map((tipo) => {
                        const currentRate = sectorRates.find((r) => r.tipo === tipo)?.monto ?? 0;
                        return (
                          <div key={tipo} className="flex items-center justify-between gap-3 text-xs">
                            <span className="text-neutral-300 font-medium">{TIPO_LABELS[tipo]}:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-brand-yellow">
                                {formatCurrency(currentRate)}
                              </span>
                              <button
                                onClick={() => {
                                  const nuevo = prompt(`Nuevo monto para ${sec.label} - ${TIPO_LABELS[tipo]}:`, currentRate.toString());
                                  if (nuevo !== null && !isNaN(Number(nuevo)) && Number(nuevo) >= 0) {
                                    handleSaveRate(sec.value, tipo, Number(nuevo));
                                  }
                                }}
                                className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white"
                                title="Editar tarifa"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL PARA DESAPROBAR / RECHAZAR CON MOTIVO */}
      {rejectingShiftIds.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-red-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Desaprobar Solicitud / Jornada</h3>
                <p className="text-xs text-neutral-400">
                  {rejectingShiftIds.length > 1
                    ? `Se desaprobarán ${rejectingShiftIds.length} jornadas de la solicitud`
                    : "Indica el motivo para que el técnico lo visualice"}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1.5">
                Motivo del rechazo
              </label>
              <textarea
                rows={3}
                placeholder="Ej: Fecha no coincide, no autorizada por producción, duplicada, etc."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-red-400 placeholder:text-neutral-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setRejectingShiftIds([])}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-all shadow-md"
              >
                Confirmar Desaprobación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA AGREGAR MIEMBRO DE STAFF */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Nuevo Miembro de Staff</h3>
                  <p className="text-xs text-neutral-400">Autorizar acceso a carga de jornadas</p>
                </div>
              </div>
              <button
                onClick={() => setIsMemberModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Martín"
                    value={newMemberNombre}
                    onChange={(e) => setNewMemberNombre(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-yellow"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: González"
                    value={newMemberApellido}
                    onChange={(e) => setNewMemberApellido(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1">
                  Email (Con el que iniciará sesión)
                </label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@gmail.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-yellow font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1">
                    Sector
                  </label>
                  <select
                    value={newMemberSector}
                    onChange={(e) => setNewMemberSector(e.target.value as StaffSector)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                  >
                    {SECTORS.map((s) => (
                      <option key={s.value} value={s.value} className="bg-neutral-900">
                        {s.icon} {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1">
                    Rol en el sistema
                  </label>
                  <select
                    value={newMemberRol}
                    onChange={(e) => setNewMemberRol(e.target.value as StaffRole)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                  >
                    <option value={StaffRole.STAFF} className="bg-neutral-900">
                      Staff (Solo carga sus jornadas)
                    </option>
                    <option value={StaffRole.ADMIN_PAGOS} className="bg-neutral-900 text-brand-yellow font-bold">
                      Admin Pagos (Aprueba y liquida)
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1">
                    DNI o CUIT (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="20-xxxxxxxx-x o DNI"
                    value={newMemberCuit}
                    onChange={(e) => setNewMemberCuit(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-yellow font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1">
                    NUM TELÉFONO (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="11-xxxx-xxxx"
                    value={newMemberTelefono}
                    onChange={(e) => setNewMemberTelefono(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-yellow font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1">
                    CBU / Alias (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="mi.alias.mp"
                    value={newMemberCbu}
                    onChange={(e) => setNewMemberCbu(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-yellow font-mono"
                  />
                </div>
              </div>

              {memberFormError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                  {memberFormError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingMember}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-brand-yellow to-yellow-500 text-black font-bold text-xs transition-all hover:scale-[1.02] shadow-md shadow-brand-yellow/20 disabled:opacity-50"
                >
                  {savingMember ? "Guardando..." : "Dar de Alta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PARA EXPORTAR A EXCEL POR MES */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Exportar a Excel por Mes</h3>
                  <p className="text-xs text-neutral-400">Generá la planilla de liquidación</p>
                </div>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Selector de Mes */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1">
                  Mes a liquidar
                </label>
                <select
                  value={exportMonth}
                  onChange={(e) => setExportMonth(e.target.value === "TODOS" ? "TODOS" : Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow font-semibold"
                >
                  <option value="TODOS">
                    {exportYear <= 2026 ? `Todo el Período ${exportYear} (Nov - Dic)` : `Todo el año ${exportYear}`}
                  </option>
                  {getAvailableMonths(exportYear).map((m) => (
                    <option key={m.value} value={m.value} className="bg-neutral-900">
                      {m.label} {exportYear}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector de Sector */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1">
                  Sector
                </label>
                <select
                  value={exportSector}
                  onChange={(e) => setExportSector(e.target.value as StaffSector | "TODOS")}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                >
                  <option value="TODOS">Todos los sectores (General)</option>
                  {SECTORS.map((s) => (
                    <option key={s.value} value={s.value} className="bg-neutral-900">
                      {s.icon} {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector de Estado */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1">
                  Estado de las Jornadas
                </label>
                <select
                  value={exportStatus}
                  onChange={(e) => setExportStatus(e.target.value as ShiftStatus | "TODOS")}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                >
                  <option value={ShiftStatus.APROBADO} className="bg-neutral-900 text-emerald-300">
                    🟢 Solo Aprobadas (Recomendado para pagar)
                  </option>
                  <option value="TODOS" className="bg-neutral-900">
                    Todas las jornadas (Aprobadas, Pendientes y Rechazadas)
                  </option>
                  <option value={ShiftStatus.PENDIENTE} className="bg-neutral-900 text-amber-300">
                    🟡 Solo Pendientes
                  </option>
                </select>
              </div>

              {/* Info de formato */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-neutral-300 space-y-1">
                <p className="font-semibold text-emerald-400">📊 El archivo Excel contendrá 2 solapas:</p>
                <p>1. <strong>Liquidación por Persona:</strong> Total a pagar por cada técnico con su CUIT y CBU/Alias.</p>
                <p>2. <strong>Detalle de Jornadas:</strong> Lista desglosada fecha por fecha de cada show o ensayo.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isExporting}
                onClick={executeExportToExcel}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? "Generando planilla..." : "Descargar Excel (.xlsx)"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

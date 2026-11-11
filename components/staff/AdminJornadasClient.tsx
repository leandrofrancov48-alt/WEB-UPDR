"use client";

import { useState, useTransition } from "react";
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
  const [filterMonth, setFilterMonth] = useState<number | "TODOS">(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState("");

  // Selección múltiple para aprobación en lote
  const [selectedShiftIds, setSelectedShiftIds] = useState<string[]>([]);

  // Modal para Desaprobar / Rechazar con motivo
  const [rejectingShiftId, setRejectingShiftId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Modal para Nuevo Miembro de Staff
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [newMemberNombre, setNewMemberNombre] = useState("");
  const [newMemberApellido, setNewMemberApellido] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberSector, setNewMemberSector] = useState<StaffSector>(StaffSector.SONIDO);
  const [newMemberRol, setNewMemberRol] = useState<StaffRole>(StaffRole.STAFF);
  const [newMemberCuit, setNewMemberCuit] = useState("");
  const [newMemberCbu, setNewMemberCbu] = useState("");
  const [memberFormError, setMemberFormError] = useState<string | null>(null);
  const [savingMember, setSavingMember] = useState(false);

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

  // Acciones sobre una jornada
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

  const handleOpenRejectModal = (shiftId: string) => {
    setRejectingShiftId(shiftId);
    setRejectReason("");
  };

  const handleConfirmReject = async () => {
    if (!rejectingShiftId) return;
    startTransition(async () => {
      try {
        await reviewStaffShift(rejectingShiftId, ShiftStatus.RECHAZADO, rejectReason);
        setRejectingShiftId(null);
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

  // Exportar a Excel
  const handleExportToExcel = () => {
    if (!shiftsData.shifts.length) {
      alert("No hay registros para exportar con los filtros actuales");
      return;
    }

    const rows = shiftsData.shifts.map((s) => ({
      "Fecha": formatDate(s.fecha),
      "Sector": SECTORS.find((sec) => sec.value === s.staffMember.sector)?.label || s.staffMember.sector,
      "Técnico / Staff": `${s.staffMember.apellido}, ${s.staffMember.nombre}`,
      "Email": s.staffMember.email,
      "CUIT / CUIL": s.staffMember.cuitCuil || "-",
      "CBU / Alias": s.staffMember.cbuAlias || "-",
      "Tipo de Jornada": TIPO_LABELS[s.tipo] || s.tipo,
      "Evento / Lugar": s.titulo,
      "Detalle / Obs": s.descripcion || "-",
      "N° Factura": s.numeroFactura || "-",
      "Monto": s.monto,
      "Estado": s.status,
      "Aprobado Por": s.aprobadoPor || "-",
      "Motivo Rechazo": s.motivoRechazo || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Liquidaciones Staff");

    // Autoajustar ancho de columnas aproximado
    worksheet["!cols"] = [
      { wch: 12 }, { wch: 18 }, { wch: 22 }, { wch: 24 },
      { wch: 16 }, { wch: 20 }, { wch: 16 }, { wch: 25 },
      { wch: 25 }, { wch: 16 }, { wch: 14 }, { wch: 12 },
      { wch: 18 }, { wch: 22 },
    ];

    const fileName = `Liquidacion_Staff_${filterMonth === "TODOS" ? "Anual" : MESES[Number(filterMonth) - 1]}_${filterYear}.xlsx`;
    XLSX.writeFile(workbook, fileName);
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
      });

      const refreshed = await getStaffMembers();
      setMembers(refreshed);
      setIsMemberModalOpen(false);

      // Limpiar formulario
      setNewMemberNombre("");
      setNewMemberApellido("");
      setNewMemberEmail("");
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
                    onClick={handleExportToExcel}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar a Excel (.xlsx)</span>
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
                    <option value="TODOS">Todo el año {filterYear}</option>
                    {MESES.map((nombre, idx) => (
                      <option key={idx + 1} value={idx + 1} className="bg-neutral-900">
                        {nombre} {filterYear}
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
                      <th className="p-3.5">Sector</th>
                      <th className="p-3.5">Tipo & Evento</th>
                      <th className="p-3.5">Factura / CUIT</th>
                      <th className="p-3.5 text-right">Monto</th>
                      <th className="p-3.5 text-center">Estado</th>
                      <th className="p-3.5 text-center pr-4">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {shiftsData.shifts.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-neutral-400 text-xs">
                          No se encontraron jornadas con los filtros seleccionados.
                        </td>
                      </tr>
                    ) : (
                      shiftsData.shifts.map((shift) => {
                        const isPendingShift = shift.status === ShiftStatus.PENDIENTE;
                        const isSelected = selectedShiftIds.includes(shift.id);
                        const secInfo = SECTORS.find((s) => s.value === shift.staffMember.sector);

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
                              {shift.staffMember.cuitCuil && (
                                <div className="text-[10px] text-neutral-400">
                                  CUIT: {shift.staffMember.cuitCuil}
                                </div>
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

                          <td className="p-3.5 whitespace-nowrap font-mono text-[11px] text-neutral-400">
                            <div>CUIT: {m.cuitCuil || "-"}</div>
                            <div>CBU/Alias: {m.cbuAlias || "-"}</div>
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
      {rejectingShiftId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-red-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Desaprobar Jornada</h3>
                <p className="text-xs text-neutral-400">Indica el motivo para que el técnico lo visualice</p>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1.5">
                Motivo del rechazo
              </label>
              <textarea
                rows={3}
                placeholder="Ej: Fecha duplicada, horario no coincide con la producción, etc."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-red-400 placeholder:text-neutral-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setRejectingShiftId(null)}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1">
                    CUIT / CUIL (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="20-xxxxxxxx-x"
                    value={newMemberCuit}
                    onChange={(e) => setNewMemberCuit(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-yellow"
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
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-yellow"
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
    </div>
  );
}

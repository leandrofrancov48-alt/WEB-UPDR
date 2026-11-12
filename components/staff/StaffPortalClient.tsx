"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  DollarSign,
  Briefcase,
  Shield,
  FileText,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Receipt,
  User,
  ShieldCheck,
  Sparkles,
  Info,
  FolderArchive,
} from "lucide-react";
import { StaffSector, ShiftType, ShiftStatus } from "@prisma/client";
import {
  createStaffShift,
  deleteMyStaffShift,
  getMyStaffData,
  updateStaffShiftFactura,
} from "@/lib/actions/staffActions";

const SECTOR_LABELS: Record<StaffSector, { label: string; icon: string; color: string }> = {
  VIDEO: { label: "Técnica de Video", icon: "📹", color: "from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  SONIDO: { label: "Técnica de Sonido", icon: "🎧", color: "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30" },
  PRODUCCION: { label: "Producción", icon: "🎬", color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30" },
  ILUMINACION: { label: "Iluminación", icon: "💡", color: "from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30" },
  STAGE: { label: "Stage / Plomos", icon: "🎸", color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30" },
  OTRO: { label: "Sector General", icon: "⚡", color: "from-neutral-500/20 to-zinc-500/20 text-neutral-300 border-neutral-500/30" },
};

const TIPO_LABELS: Record<ShiftType, { label: string; icon: string; badge: string }> = {
  UPDR: { label: "UPDR", icon: "📺", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  TXLM: { label: "TXLM", icon: "🎬", badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" },
  LA_BANDURRIA: { label: "LA BANDURRIA", icon: "🎸", badge: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  UPDF: { label: "UPDF", icon: "⚡", badge: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
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
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

type StaffPortalProps = {
  initialData: Awaited<ReturnType<typeof getMyStaffData>>;
  rates: Array<{ sector: StaffSector; tipo: ShiftType; monto: number }>;
};

export default function StaffPortalClient({ initialData, rates }: StaffPortalProps) {
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [selectedMonth, setSelectedMonth] = useState(initialData.mes);
  const [selectedYear, setSelectedYear] = useState(initialData.anio);

  // Modal de nueva jornada
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTipo, setFormTipo] = useState<ShiftType>(ShiftType.UPDR);
  const [formFecha, setFormFecha] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    return today < "2026-11-01" ? "2026-11-01" : today;
  });
  const [formDescripcion, setFormDescripcion] = useState("");
  const [formMonto, setFormMonto] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const sortedShifts = useMemo(() => {
    return [...data.shifts].sort((a, b) => {
      const osA = (a as any).numeroOS || "ZZZZ";
      const osB = (b as any).numeroOS || "ZZZZ";
      const cmp = osA.localeCompare(osB, undefined, { numeric: true });
      if (cmp !== 0) return cmp;
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
    });
  }, [data.shifts]);

  // Cambio de mes
  const handleMonthChange = (newMonth: number) => {
    setSelectedMonth(newMonth);
    startTransition(async () => {
      try {
        const refreshed = await getMyStaffData({ mes: newMonth, anio: selectedYear });
        setData(refreshed);
      } catch (err: any) {
        console.error("Error al cargar mes:", err);
      }
    });
  };

  const handleOpenModal = () => {
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const montoNum = Number(formMonto);
    if (!formMonto || isNaN(montoNum) || montoNum <= 0) {
      setErrorMsg("El monto a facturar debe ser mayor a $0");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      await createStaffShift({
        fecha: formFecha,
        tipo: formTipo,
        titulo: TIPO_LABELS[formTipo].label,
        descripcion: formDescripcion,
        monto: montoNum,
      });

      // Refrescar lista
      const refreshed = await getMyStaffData({ mes: selectedMonth, anio: selectedYear });
      setData(refreshed);
      setIsModalOpen(false);
      // Resetear campos
      setFormMonto("");
      setFormDescripcion("");
    } catch (err: any) {
      setErrorMsg(err.message || "Error al registrar la jornada");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteShift = async (shiftId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta jornada pendiente?")) return;

    startTransition(async () => {
      try {
        await deleteMyStaffShift(shiftId);
        const refreshed = await getMyStaffData({ mes: selectedMonth, anio: selectedYear });
        setData(refreshed);
      } catch (err: any) {
        alert(err.message || "Error al eliminar jornada");
      }
    });
  };

  const sectorInfo = SECTOR_LABELS[data.staffMember.sector] || SECTOR_LABELS.OTRO;

  return (
    <div className="min-h-screen bg-[#050b1a] text-white p-4 sm:p-6 md:p-10 font-sans relative overflow-hidden">
      {/* Luces sutiles de fondo */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-yellow/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto w-full relative z-10 space-y-8">
        {/* Barra superior de navegación / identidad */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-gradient-to-r ${sectorInfo.color}`}>
                <span>{sectorInfo.icon}</span>
                <span>{sectorInfo.label}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-400">
                <User className="w-3 h-3 text-neutral-400" />
                <span>{data.staffMember.nombre} {data.staffMember.apellido}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wide">
              Panel de Jornadas Extras
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Carga tus shows, programas extras y ensayos para la liquidación mensual.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {data.isAdminPagos && (
              <Link
                href="/control-updr-admin/jornadas"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-yellow to-yellow-500 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-xs shadow-md shadow-brand-yellow/20 transition-all hover:scale-105"
              >
                <span>👑 Panel Aprobación de Extras</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 text-xs transition-colors"
            >
              <span>← Web</span>
            </Link>
          </div>
        </div>

        {/* Banner para Administradora de Extras */}
        {data.isAdminPagos && (
          <div className="bg-gradient-to-r from-amber-500/20 via-brand-yellow/15 to-amber-500/10 border border-brand-yellow/40 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/20 text-brand-yellow text-xs font-bold border border-brand-yellow/40">
                <span>👑</span>
                <span>Rol Administradora de Extras y Pagos</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Revisión, Aprobación y Gestión de Solicitudes
              </h2>
              <p className="text-xs text-neutral-300 max-w-xl">
                Tenés permisos especiales para revisar las jornadas cargadas por todo el personal de staff, aprobar o rechazar solicitudes, ver los montos consolidados y exportar a Excel.
              </p>
            </div>
            <Link
              href="/control-updr-admin/jornadas"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-yellow hover:bg-yellow-400 text-black font-black text-xs transition-all hover:scale-105 shadow-md shadow-brand-yellow/20 shrink-0"
            >
              <span>Abrir Panel de Revisión</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Selector de Mes y Botón de Cargar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-brand-yellow" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Período:</span>
              <select
                value={selectedMonth}
                onChange={(e) => handleMonthChange(Number(e.target.value))}
                className="bg-black/40 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white font-semibold focus:outline-none focus:border-brand-yellow"
              >
                {getAvailableMonths(selectedYear).map((m) => (
                  <option key={m.value} value={m.value} className="bg-neutral-900 text-white">
                    {m.label} {selectedYear}
                  </option>
                ))}
              </select>
            </div>
            {isPending && (
              <span className="text-xs text-brand-yellow animate-pulse flex items-center gap-1">
                <Clock className="w-3 h-3" /> Cargando...
              </span>
            )}
          </div>

          <button
            onClick={handleOpenModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-yellow to-yellow-500 text-black font-bold text-sm transition-all hover:scale-[1.02] shadow-lg shadow-brand-yellow/20 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Cargar Nueva Jornada</span>
          </button>
        </div>

        {/* Tarjetas de Resumen Mensual (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Aprobado */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-bold">Total Aprobado</span>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300">
              {formatCurrency(data.stats.totalAprobado)}
            </div>
            <p className="text-[11px] text-emerald-400/80 mt-1">
              {data.stats.aprobadasCount} jornada{data.stats.aprobadasCount === 1 ? "" : "s"} confirmada{data.stats.aprobadasCount === 1 ? "" : "s"} para liquidar
            </p>
          </div>

          {/* Total Pendiente */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-bold">En Revisión</span>
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300">
              {formatCurrency(data.stats.totalPendiente)}
            </div>
            <p className="text-[11px] text-amber-400/80 mt-1">
              {data.stats.pendientesCount} jornada{data.stats.pendientesCount === 1 ? "" : "s"} pendiente{data.stats.pendientesCount === 1 ? "" : "s"} de aprobación
            </p>
          </div>

          {/* Total Rechazado o Estadísticas */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-bold">Total Cargadas</span>
              <Briefcase className="w-5 h-5 text-neutral-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {data.stats.totalJornadas}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              {MESES[selectedMonth - 1]} {selectedYear}
            </p>
          </div>
        </div>

        {/* Guía Oficial: Circuito de Aprobación de Jornadas / OS */}
        <div className="bg-gradient-to-br from-[#09132c]/95 via-[#0c1836]/90 to-[#070e20]/95 border border-brand-yellow/30 rounded-3xl p-5 sm:p-6 backdrop-blur-md relative overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/40 flex items-center justify-center text-brand-yellow shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white tracking-wide flex items-center gap-2">
                  <span>Circuito de Aprobación de Jornadas Extras / OS</span>
                  <span className="text-[10px] font-mono text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                    Oficial
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Flujo de auditoría, revisión administrativa y facturación mensual de extras
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-xs font-semibold text-brand-yellow w-fit">
              <span>👑 Rol Administrador:</span>
              <span className="text-white font-bold">Florencia</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4">
            {/* Etapa 1: Revisión y Aprobación */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 hover:border-brand-yellow/30 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-widest text-brand-yellow bg-brand-yellow/15 px-2 py-0.5 rounded-full font-bold">
                  AUDITORÍA
                </span>
                <Clock className="w-4 h-4 text-brand-yellow" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Revisión y Aprobación
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                El usuario quedará a la espera de la revisión y aprobación de <strong className="text-brand-yellow font-semibold">Florencia</strong> (quien tendrá Rol de Administrador).
              </p>
            </div>

            {/* Etapa 2: Estado Pendiente */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 hover:border-amber-500/30 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full font-bold">
                  ESTADO EN ESPERA
                </span>
                <AlertCircle className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Modo Pendiente
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                El usuario visualizará el estado de su OS en modo <strong className="text-amber-300 font-semibold">PENDIENTE</strong>, hasta que Florencia la apruebe y quede en estado <strong className="text-emerald-400 font-semibold">APROBADA</strong>.
              </p>
            </div>

            {/* Etapa 3: Emisión de Factura */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 hover:border-emerald-500/30 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full font-bold">
                  FACTURACIÓN
                </span>
                <Receipt className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Emisión de Factura
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Cuando el Usuario vea su OS en estado <strong className="text-emerald-400 font-semibold">APROBADA</strong> podrá generar la Factura.
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Jornadas del Mes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-yellow" />
              <span>Jornadas de {MESES[selectedMonth - 1]}</span>
            </h2>
            <span className="text-xs text-neutral-400">
              {data.shifts.length} registro{data.shifts.length === 1 ? "" : "s"}
            </span>
          </div>

          {data.shifts.length === 0 ? (
            <div className="bg-white/5 border border-dashed border-white/15 rounded-3xl p-10 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-neutral-400">
                <Calendar className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-semibold text-white">No tenés jornadas cargadas en este mes</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Tocá el botón "Cargar Nueva Jornada" para registrar tus shows, ensayos o coberturas extras realizadas en {MESES[selectedMonth - 1]}.
                </p>
              </div>
              <button
                onClick={handleOpenModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-yellow/10 hover:bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30 text-xs font-bold transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Cargar primera jornada</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {sortedShifts.map((shift) => {
                const tipoInfo = TIPO_LABELS[shift.tipo] || TIPO_LABELS.UPDR;
                return (
                  <div
                    key={shift.id}
                    className={`bg-white/5 border rounded-2xl p-4 sm:p-5 backdrop-blur-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      shift.status === ShiftStatus.APROBADO
                        ? "border-emerald-500/20 hover:border-emerald-500/40"
                        : shift.status === ShiftStatus.RECHAZADO
                        ? "border-red-500/30 hover:border-red-500/50 bg-red-500/5"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    {/* Info principal */}
                    <div className="flex items-start gap-4">
                      {/* Fecha box */}
                      <div className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-center min-w-[70px] shrink-0">
                        <div className="text-[10px] uppercase font-bold text-neutral-400">
                          {formatDate(shift.fecha).split(" ")[0]}
                        </div>
                        <div className="text-base sm:text-lg font-black text-white">
                          {new Date(shift.fecha).getUTCDate()}
                        </div>
                        <div className="text-[10px] uppercase text-brand-yellow font-semibold">
                          {MESES[new Date(shift.fecha).getUTCMonth()].slice(0, 3)}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${tipoInfo.badge}`}>
                            {tipoInfo.icon} {tipoInfo.label}
                          </span>
                          {(shift as any).numeroOS && (
                            <span className="inline-flex items-center gap-1 text-[11px] bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow px-2 py-0.5 rounded-md font-mono font-bold">
                              <span>N° OS: {(shift as any).numeroOS}</span>
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white">
                          {shift.titulo}
                        </h3>

                        {shift.descripcion && (
                          <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
                            {shift.descripcion}
                          </p>
                        )}

                        {/* Motivo de rechazo si aplica */}
                        {shift.status === ShiftStatus.RECHAZADO && (
                          <div className="inline-flex items-start gap-1.5 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 mt-2">
                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">Motivo de rechazo:</span> {shift.motivoRechazo || "Sin observaciones adicionales"}
                            </div>
                          </div>
                        )}

                        {/* Detalle de aprobación si aplica */}
                        {shift.status === ShiftStatus.APROBADO && shift.aprobadoPor && (
                          <div className="text-[11px] text-emerald-400/80 flex items-center gap-1 pt-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Aprobado por {shift.aprobadoPor}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Monto y Estado */}
                    <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/10 shrink-0">
                      <div className="text-right">
                        <div className="text-lg sm:text-xl font-black text-white tracking-tight">
                          {formatCurrency(shift.monto)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {shift.status === ShiftStatus.APROBADO && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Aprobado
                          </span>
                        )}

                        {shift.status === ShiftStatus.PENDIENTE && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            En Revisión
                          </span>
                        )}

                        {shift.status === ShiftStatus.RECHAZADO && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold">
                            <XCircle className="w-3.5 h-3.5 text-red-400" />
                            Desaprobado
                          </span>
                        )}

                        {/* Botón borrar solo si está pendiente */}
                        {shift.status === ShiftStatus.PENDIENTE && (
                          <button
                            onClick={() => handleDeleteShift(shift.id)}
                            title="Eliminar jornada pendiente"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* SECCIÓN: JORNADAS PREVIAS (HISTORIAL)                    */}
        {/* ======================================================== */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/40 flex items-center justify-center text-brand-yellow shrink-0">
                <FolderArchive className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>Jornadas Previas (Historial)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-semibold uppercase">
                    Meses Cerrados
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Archivo histórico de tus órdenes de servicio (OS) y facturas de meses anteriores.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 border border-white/10 text-center space-y-2">
            <p className="text-xs text-neutral-300">
              📌 El nuevo circuito de Órdenes de Servicio (OS) y Facturación comenzó en <strong>Noviembre de 2026</strong>.
            </p>
            <p className="text-[11px] text-neutral-400">
              A medida que transcurran los meses, cada período cerrado se archivará aquí automáticamente organizado por mes con su <strong>N° OS</strong>, <strong>Factura</strong> y detalle de liquidación.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL DE CARGA DE JORNADA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Cargar Jornada Extra</h2>
                  <p className="text-xs text-neutral-400">{sectorInfo.label}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Aviso de Circuito */}
            <div className="p-3.5 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/30 text-xs text-neutral-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-brand-yellow">
                <Info className="w-4 h-4 text-brand-yellow" />
                <span>Circuito de Aprobación y N° OS:</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Esta solicitud se asociará a tu <strong>Orden de Servicio (N° OS)</strong> mensual. Quedará en estado <strong>PENDIENTE</strong> a la espera de la revisión y aprobación de <strong>Florencia</strong> (Administradora). Una vez <strong>APROBADA</strong> podrás generar la factura.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Motivo */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1.5">
                  Motivo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(TIPO_LABELS) as ShiftType[]).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setFormTipo(t)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                        formTipo === t
                          ? "bg-brand-yellow text-black border-brand-yellow shadow-md"
                          : "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10"
                      }`}
                    >
                      {TIPO_LABELS[t].icon} {TIPO_LABELS[t].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1.5">
                  Fecha de prestación
                </label>
                <input
                  type="date"
                  value={formFecha}
                  min="2026-11-01"
                  onChange={(e) => setFormFecha(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-yellow"
                  required
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  Habilitado para registrar a partir del 1 de Noviembre de 2026.
                </p>
              </div>

              {/* Monto a Facturar */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1.5">
                  Monto a Facturar ($)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 font-bold">
                    $
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Ingresá el monto"
                    value={formMonto}
                    onChange={(e) => setFormMonto(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm font-semibold focus:outline-none focus:border-brand-yellow placeholder:text-neutral-500"
                    required
                  />
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1.5">
                  Observaciones o Detalles (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles de la tarea realizada, horario especial, etc."
                  value={formDescripcion}
                  onChange={(e) => setFormDescripcion(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-brand-yellow placeholder:text-neutral-500"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-yellow to-yellow-500 text-black font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {submitting ? "Cargando..." : "Confirmar y Enviar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

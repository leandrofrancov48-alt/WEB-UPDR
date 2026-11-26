"use client";

import React, { useState, useTransition, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Trash2,
  Search,
  Filter,
  X,
  CheckCircle2,
  AlertTriangle,
  Mail,
  ShieldAlert,
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  DollarSign,
  AlertOctagon,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { StaffSector, StaffRole } from "@prisma/client";
import {
  getStaffMembers,
  addStaffMemberByEmail,
  toggleStaffMemberActive,
  deleteStaffMember,
  searchRegisteredUsersForStaff,
} from "@/lib/actions/staffActions";

interface MemberItem {
  id: string;
  userId: string | null;
  email: string;
  nombre: string;
  apellido: string;
  sector: StaffSector;
  rol: StaffRole;
  cuitCuil: string | null;
  cbuAlias: string | null;
  telefono: string | null;
  activo: boolean;
  createdAt: Date;
  user: {
    id: string;
    username: string;
    email: string;
    nombre: string;
    apellido: string;
    celular: string | null;
    dni: string | null;
  } | null;
  stats: {
    totalAprobado: number;
    totalPendiente: number;
    totalJornadas: number;
  };
}

interface StaffAdminClientProps {
  initialMembers: any[];
  isSuperAdmin: boolean;
}

const SECTORS: Array<{ value: StaffSector; label: string; icon: string }> = [
  { value: StaffSector.SONIDO, label: "Sonido", icon: "🎚️" },
  { value: StaffSector.VIDEO, label: "Video / Cámaras", icon: "🎥" },
  { value: StaffSector.PRODUCCION, label: "Producción", icon: "🎬" },
  { value: StaffSector.ILUMINACION, label: "Iluminación", icon: "💡" },
  { value: StaffSector.STAGE, label: "Stage / Plomos", icon: "🎸" },
  { value: StaffSector.OTRO, label: "Otro Sector", icon: "⚡" },
];

export default function StaffAdminClient({ initialMembers, isSuperAdmin }: StaffAdminClientProps) {
  const [members, setMembers] = useState<MemberItem[]>(initialMembers);
  const [isPending, startTransition] = useTransition();

  // Formulario de Alta por Email
  const [emailInput, setEmailInput] = useState("");
  const [sectorInput, setSectorInput] = useState<StaffSector>(StaffSector.SONIDO);
  const [rolInput, setRolInput] = useState<StaffRole>(StaffRole.STAFF);
  const [formFeedback, setFormFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sugerencias de búsqueda de usuarios registrados
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [selectedUserPreview, setSelectedUserPreview] = useState<any | null>(null);

  // Filtros de la lista
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSector, setFilterSector] = useState<StaffSector | "TODOS">("TODOS");
  const [filterStatus, setFilterStatus] = useState<"TODOS" | "ACTIVO" | "BLOQUEADO">("TODOS");

  // Modal de confirmación para eliminar
  const [deletingMember, setDeletingMember] = useState<MemberItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback de copiado
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Búsqueda con debounce de usuarios registrados mientras se escribe el email
  useEffect(() => {
    const trimmed = emailInput.trim();
    if (trimmed.length < 2) {
      setSuggestedUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingUsers(true);
        const results = await searchRegisteredUsersForStaff(trimmed);
        setSuggestedUsers(results);
      } catch (err) {
        console.error("Error buscando usuarios registrados:", err);
      } finally {
        setIsSearchingUsers(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [emailInput]);

  // Refrescar lista de miembros
  const reloadMembers = async () => {
    try {
      const updated = await getStaffMembers();
      setMembers(updated as any);
    } catch (err) {
      console.error("Error recargando staff:", err);
    }
  };

  // Manejar submit del alta
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setFormFeedback({ type: "error", message: "Ingresá una dirección de correo electrónico válida." });
      return;
    }

    setIsSubmitting(true);
    try {
      await addStaffMemberByEmail({
        email: cleanEmail,
        sector: sectorInput,
        rol: rolInput,
        nombre: selectedUserPreview?.nombre,
        apellido: selectedUserPreview?.apellido,
        telefono: selectedUserPreview?.celular,
        cuitCuil: selectedUserPreview?.dni,
      });

      setFormFeedback({
        type: "success",
        message: `¡Acceso concedido exitosamente a ${cleanEmail}! Ya puede ingresar a la sección /staff.`,
      });
      setEmailInput("");
      setSelectedUserPreview(null);
      setSuggestedUsers([]);
      await reloadMembers();
    } catch (err: any) {
      setFormFeedback({
        type: "error",
        message: err?.message || "Ocurrió un error al otorgar el acceso.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Seleccionar usuario sugerido
  const handleSelectUser = (user: any) => {
    setEmailInput(user.email);
    setSelectedUserPreview(user);
    setSuggestedUsers([]);
  };

  // Toggle activo / pausado
  const handleToggleActive = async (id: string, currentActive: boolean) => {
    startTransition(async () => {
      try {
        await toggleStaffMemberActive(id, !currentActive);
        await reloadMembers();
      } catch (err: any) {
        alert(err?.message || "Error al modificar estado.");
      }
    });
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!deletingMember) return;
    setIsDeleting(true);
    try {
      await deleteStaffMember(deletingMember.id);
      setDeletingMember(null);
      await reloadMembers();
    } catch (err: any) {
      alert(err?.message || "Error al eliminar miembro.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Copiar email al portapapeles
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Miembros filtrados
  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return members.filter((m) => {
      // Filtro sector
      if (filterSector !== "TODOS" && m.sector !== filterSector) return false;
      // Filtro estado
      if (filterStatus === "ACTIVO" && !m.activo) return false;
      if (filterStatus === "BLOQUEADO" && m.activo) return false;

      // Filtro texto
      if (!q) return true;
      const fullName = `${m.nombre} ${m.apellido}`.toLowerCase();
      const email = m.email.toLowerCase();
      const username = m.user?.username?.toLowerCase() || "";
      const dni = m.user?.dni?.toLowerCase() || "";
      const cuit = m.cuitCuil?.toLowerCase() || "";
      const tel = m.telefono?.toLowerCase() || "";

      return (
        fullName.includes(q) ||
        email.includes(q) ||
        username.includes(q) ||
        dni.includes(q) ||
        cuit.includes(q) ||
        tel.includes(q)
      );
    });
  }, [members, searchQuery, filterSector, filterStatus]);

  // Métricas
  const totalActivos = members.filter((m) => m.activo).length;
  const totalBloqueados = members.filter((m) => !m.activo).length;

  return (
    <main className="min-h-screen bg-[#050b1a] text-white p-4 sm:p-8 md:p-12 font-sans relative overflow-x-hidden">
      {/* Luces de fondo */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-yellow/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-brand-yellow/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Barra superior de navegación */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link
              href="/control-updr-admin"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs text-white/80 hover:text-brand-yellow hover:border-brand-yellow/40 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la Consola Admin</span>
            </Link>

            <Link
              href="/control-updr-admin/jornadas"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/60 hover:text-white transition-colors"
            >
              <DollarSign className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Ir a Liquidaciones & Jornadas</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 bg-brand-yellow/10 border border-brand-yellow/30 px-3 py-1 rounded-full text-brand-yellow text-[11px] font-bold tracking-widest uppercase">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Gestión de Accesos Staff</span>
          </div>
        </div>

        {/* Encabezado Principal */}
        <header className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-yellow text-brand-yellow tracking-wider uppercase">
            Administración de Personal de Staff
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Habilitá a nuevos integrantes para que puedan ingresar a la sección confidencial de{" "}
            <span className="text-white font-semibold">/staff</span> y cargar sus jornadas de trabajo. Podés dar de alta
            indicando el email con el que se registraron, cambiar sectores, roles o revocar accesos en cualquier momento.
          </p>
        </header>

        {/* ======================================================== */}
        {/* SECCIÓN 1: FORMULARIO DE ALTA POR EMAIL                  */}
        {/* ======================================================== */}
        <section className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border-2 border-brand-yellow/30 rounded-3xl p-5 sm:p-7 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-brand-yellow text-black">
                <UserPlus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span>Dar de Alta Nuevo Acceso por Email</span>
                  <span className="text-[10px] bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                    Rápido
                  </span>
                </h2>
                <p className="text-xs text-neutral-400">
                  Ingresá el email con el que el técnico o productor se registró en la web para habilitarlo al instante.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Input Email con Autocompletado Inteligente */}
                <div className="md:col-span-6 relative">
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-neutral-300 mb-1.5">
                    Email del Usuario Registrado <span className="text-brand-yellow">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="Ej: tecnico@gmail.com o usuario"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        setSelectedUserPreview(null);
                      }}
                      className="w-full bg-black/60 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all"
                    />
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  </div>

                  {/* Dropdown de Sugerencias de Usuarios Registrados */}
                  {suggestedUsers.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-[#090f22] border border-brand-yellow/40 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-white/5">
                      <div className="px-3 py-2 bg-white/5 text-[10px] uppercase tracking-wider font-bold text-brand-yellow flex items-center justify-between">
                        <span>Usuarios encontrados en la web</span>
                        <span>{suggestedUsers.length}</span>
                      </div>
                      {suggestedUsers.map((u) => {
                        const isAlreadyStaff = Boolean(u.staffMember);
                        return (
                          <button
                            type="button"
                            key={u.id}
                            onClick={() => handleSelectUser(u)}
                            className="w-full text-left p-3 hover:bg-white/10 transition-colors flex items-center justify-between gap-3"
                          >
                            <div>
                              <div className="font-bold text-xs text-white">
                                {u.nombre} {u.apellido}
                              </div>
                              <div className="text-[11px] text-neutral-400 font-mono">{u.email}</div>
                              <div className="text-[10px] text-neutral-500">
                                @{u.username} {u.dni ? `• DNI: ${u.dni}` : ""}
                              </div>
                            </div>

                            <div>
                              {isAlreadyStaff ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-brand-yellow border border-brand-yellow/30 font-bold whitespace-nowrap">
                                  Ya es Staff
                                </span>
                              ) : (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold whitespace-nowrap">
                                  + Seleccionar
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Selector de Sector */}
                <div className="md:col-span-3">
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-neutral-300 mb-1.5">
                    Sector Técnico <span className="text-brand-yellow">*</span>
                  </label>
                  <select
                    value={sectorInput}
                    onChange={(e) => setSectorInput(e.target.value as StaffSector)}
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
                  >
                    {SECTORS.map((sec) => (
                      <option key={sec.value} value={sec.value} className="bg-neutral-900 text-white">
                        {sec.icon} {sec.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selector de Rol */}
                <div className="md:col-span-3">
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-neutral-300 mb-1.5">
                    Rol en el Sistema
                  </label>
                  <select
                    value={rolInput}
                    onChange={(e) => setRolInput(e.target.value as StaffRole)}
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow"
                  >
                    <option value={StaffRole.STAFF} className="bg-neutral-900 text-white">
                      🛠️ Staff (Técnico / Operativo)
                    </option>
                    <option value={StaffRole.ADMIN_PAGOS} className="bg-neutral-900 text-white">
                      👑 Admin de Pagos (Revisa y liquida)
                    </option>
                  </select>
                </div>
              </div>

              {/* Banner de Usuario Detectado */}
              {selectedUserPreview && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>
                      Usuario vinculado:{" "}
                      <strong>
                        {selectedUserPreview.nombre} {selectedUserPreview.apellido}
                      </strong>{" "}
                      (@{selectedUserPreview.username}) • Tel: {selectedUserPreview.celular || "Sin celular"} • DNI:{" "}
                      {selectedUserPreview.dni || "Sin DNI"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedUserPreview(null)}
                    className="text-neutral-400 hover:text-white text-xs underline"
                  >
                    Desvincular
                  </button>
                </div>
              )}

              {/* Botón de Enviar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <p className="text-[11px] text-neutral-400">
                  💡 Si el usuario aún no creó su cuenta en la web, al registrarse con este mismo mail obtendrá acceso
                  automático a <code className="text-brand-yellow font-mono">/staff</code>.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-yellow to-yellow-500 text-black font-extrabold text-xs transition-all hover:scale-[1.02] shadow-lg shadow-brand-yellow/20 disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Dando de Alta...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 stroke-[3]" />
                      <span>Habilitar Acceso a Staff</span>
                    </>
                  )}
                </button>
              </div>

              {/* Feedback visual de éxito o error */}
              {formFeedback && (
                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                    formFeedback.type === "success"
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                      : "bg-red-500/15 border-red-500/40 text-red-300"
                  }`}
                >
                  {formFeedback.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{formFeedback.message}</span>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECCIÓN 2: MÉTRICAS Y RESUMEN RÁPIDO                     */}
        {/* ======================================================== */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="text-[11px] uppercase tracking-wider font-bold text-neutral-400">Total Personal</div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono">{members.length}</div>
            <div className="text-[10px] text-neutral-500 mt-0.5">Integrantes cargados</div>
          </div>

          <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-4 backdrop-blur-md">
            <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Habilitados</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 font-mono">{totalActivos}</div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Con acceso activo a /staff</div>
          </div>

          <div className="bg-white/5 border border-red-500/30 rounded-2xl p-4 backdrop-blur-md">
            <div className="text-[11px] uppercase tracking-wider font-bold text-red-400 flex items-center gap-1">
              <UserX className="w-3.5 h-3.5" />
              <span>Desactivados</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-red-400 mt-1 font-mono">{totalBloqueados}</div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Acceso pausado</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="text-[11px] uppercase tracking-wider font-bold text-brand-yellow">Sectores Activos</div>
            <div className="text-2xl sm:text-3xl font-black text-brand-yellow mt-1 font-mono">
              {new Set(members.map((m) => m.sector)).size}
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Áreas de trabajo</div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECCIÓN 3: FILTROS Y TABLA DE INTEGRANTES                */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-yellow uppercase tracking-wider">
                <Filter className="w-4 h-4" />
                <span>Buscador y Filtros de Personal</span>
              </div>
              <div className="text-xs text-neutral-400">
                Mostrando <span className="font-bold text-white">{filteredMembers.length}</span> de{" "}
                <span className="font-bold text-white">{members.length}</span> integrantes
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Buscador de Texto */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-400 mb-1">
                  Buscar por Nombre, Mail, DNI, Teléfono...
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ej: Matias, alagastino@gmail.com, 381234..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-brand-yellow"
                  />
                  <Search className="w-4 h-4 text-neutral-400 absolute left-2.5 top-2.5" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-white"
                      title="Borrar búsqueda"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filtro Sector */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-400 mb-1">
                  Sector
                </label>
                <select
                  value={filterSector}
                  onChange={(e) => setFilterSector(e.target.value as StaffSector | "TODOS")}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                >
                  <option value="TODOS">Todos los sectores</option>
                  {SECTORS.map((sec) => (
                    <option key={sec.value} value={sec.value} className="bg-neutral-900 text-white">
                      {sec.icon} {sec.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro Estado */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-400 mb-1">
                  Estado de Acceso
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as "TODOS" | "ACTIVO" | "BLOQUEADO")}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow font-semibold"
                >
                  <option value="TODOS">Todos los estados</option>
                  <option value="ACTIVO" className="bg-neutral-900 text-emerald-300">
                    🟢 Solo Habilitados
                  </option>
                  <option value="BLOQUEADO" className="bg-neutral-900 text-red-300">
                    🔴 Solo Desactivados
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabla de Miembros */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/50 border-b border-white/10 uppercase tracking-wider text-[11px] text-neutral-400 font-semibold">
                  <tr>
                    <th className="p-3.5 pl-5">Integrante</th>
                    <th className="p-3.5">Email (Acceso a /staff)</th>
                    <th className="p-3.5">Sector</th>
                    <th className="p-3.5">Rol</th>
                    <th className="p-3.5">Contacto / Fiscal</th>
                    <th className="p-3.5 text-center">Estado</th>
                    <th className="p-3.5 text-right pr-5">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-neutral-400">
                        <Users className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                        <p className="font-bold text-sm text-neutral-300">No se encontraron integrantes</p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Ajustá los filtros o el buscador para ver más resultados.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m) => {
                      const secInfo = SECTORS.find((s) => s.value === m.sector);
                      return (
                        <tr key={m.id} className="hover:bg-white/[0.04] transition-colors">
                          {/* Columna Integrante */}
                          <td className="p-3.5 pl-5 whitespace-nowrap">
                            <div className="font-bold text-white text-sm">
                              {m.nombre} {m.apellido}
                            </div>
                            <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                              {m.user ? (
                                <span className="text-emerald-400 font-medium">
                                  ✓ Cuenta vinculada (@{m.user.username})
                                </span>
                              ) : (
                                <span className="text-neutral-500">Pendiente de registro en la web</span>
                              )}
                            </div>
                          </td>

                          {/* Columna Email */}
                          <td className="p-3.5 whitespace-nowrap font-mono text-neutral-300">
                            <div className="flex items-center gap-2">
                              <span>{m.email}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyEmail(m.email)}
                                className="text-neutral-500 hover:text-white p-1 rounded transition-colors"
                                title="Copiar email"
                              >
                                {copiedEmail === m.email ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Columna Sector */}
                          <td className="p-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-white">
                              <span>{secInfo?.icon || "⚡"}</span>
                              <span>{secInfo?.label || m.sector}</span>
                            </span>
                          </td>

                          {/* Columna Rol */}
                          <td className="p-3.5 whitespace-nowrap">
                            {m.rol === StaffRole.ADMIN_PAGOS ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-brand-yellow border border-brand-yellow/30 text-[10px] font-bold">
                                👑 Admin Pagos
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/10 text-[10px]">
                                Staff Técnico
                              </span>
                            )}
                          </td>

                          {/* Columna Datos Fiscales */}
                          <td className="p-3.5 whitespace-nowrap text-[11px] text-neutral-400 font-mono">
                            <div>Tel: {m.telefono || m.user?.celular || "-"}</div>
                            <div>DNI/CUIT: {m.cuitCuil || m.user?.dni || "-"}</div>
                          </td>

                          {/* Columna Estado */}
                          <td className="p-3.5 whitespace-nowrap text-center">
                            {m.activo ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                                <UserCheck className="w-3.5 h-3.5" /> Habilitado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold">
                                <UserX className="w-3.5 h-3.5" /> Desactivado
                              </span>
                            )}
                          </td>

                          {/* Columna Acciones */}
                          <td className="p-3.5 whitespace-nowrap text-right pr-5">
                            <div className="flex items-center justify-end gap-2">
                              {/* Botón Activar / Desactivar */}
                              <button
                                type="button"
                                onClick={() => handleToggleActive(m.id, m.activo)}
                                disabled={isPending}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                                  m.activo
                                    ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30"
                                    : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                }`}
                                title={m.activo ? "Pausar acceso temporalmente" : "Restablecer acceso"}
                              >
                                {m.activo ? "Pausar" : "Activar"}
                              </button>

                              {/* Botón Borrar / Eliminar */}
                              <button
                                type="button"
                                onClick={() => setDeletingMember(m)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                                title="Borrar del staff"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
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
        </section>
      </div>

      {/* ======================================================== */}
      {/* MODAL DE CONFIRMACIÓN PARA BORRAR MIEMBRO                */}
      {/* ======================================================== */}
      {deletingMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-red-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-3 rounded-2xl bg-red-500/15 border border-red-500/30">
                <AlertOctagon className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">¿Borrar usuario del Staff?</h3>
                <p className="text-xs text-neutral-400">Esta acción revoca el acceso de inmediato</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="text-white font-bold text-sm">
                {deletingMember.nombre} {deletingMember.apellido}
              </div>
              <div className="text-neutral-400 font-mono">{deletingMember.email}</div>
              <div className="text-[11px] text-neutral-400">
                Sector: <span className="text-brand-yellow font-semibold">{deletingMember.sector}</span> • Rol:{" "}
                <span className="text-white">{deletingMember.rol}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Al eliminar a este miembro, su cuenta ya no podrá ingresar a la sección de staff ni cargar nuevas
              jornadas de trabajo.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingMember(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Borrando...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Sí, Borrar del Staff</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

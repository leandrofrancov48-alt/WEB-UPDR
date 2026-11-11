import { prisma } from "@/lib/db";
import { getSessionUser, type SessionUser } from "@/lib/session";
import { isAdminAuthenticated } from "@/lib/actions/adminAuth";
import type { StaffMember, StaffRole, StaffSector } from "@prisma/client";

export type CurrentStaffContext = {
  user: SessionUser | null;
  staffMember: StaffMember | null;
  isSuperAdmin: boolean;
  isAdminPagos: boolean;
  isStaff: boolean;
};

export async function getStaffContext(): Promise<CurrentStaffContext> {
  const isSuperAdmin = await isAdminAuthenticated();
  const user = await getSessionUser();

  if (!user && !isSuperAdmin) {
    return {
      user: null,
      staffMember: null,
      isSuperAdmin: false,
      isAdminPagos: false,
      isStaff: false,
    };
  }

  let staffMember: StaffMember | null = null;

  if (user) {
    staffMember = await prisma.staffMember.findFirst({
      where: {
        OR: [
          { userId: user.id },
          { email: { equals: user.email.trim(), mode: "insensitive" } },
        ],
      },
    });

    // Si encontramos el registro por email pero no tenía asignado aún el userId, lo vinculamos
    if (staffMember && !staffMember.userId) {
      staffMember = await prisma.staffMember.update({
        where: { id: staffMember.id },
        data: { userId: user.id },
      });
    }
  }

  const isStaffActive = Boolean(staffMember && staffMember.activo);
  const isAdminPagos = isSuperAdmin || Boolean(isStaffActive && staffMember?.rol === "ADMIN_PAGOS");

  return {
    user,
    staffMember: isStaffActive ? staffMember : null,
    isSuperAdmin,
    isAdminPagos,
    isStaff: isStaffActive,
  };
}

export async function requireStaffMember(): Promise<{
  user: SessionUser;
  staffMember: StaffMember;
  isAdminPagos: boolean;
}> {
  const ctx = await getStaffContext();

  if (!ctx.user) {
    throw new Error("UNAUTHENTICATED");
  }

  if (!ctx.isStaff || !ctx.staffMember) {
    throw new Error("UNAUTHORIZED_NOT_STAFF");
  }

  return {
    user: ctx.user,
    staffMember: ctx.staffMember,
    isAdminPagos: ctx.isAdminPagos,
  };
}

export async function requireStaffAdmin(): Promise<CurrentStaffContext> {
  const isSuperAdmin = await isAdminAuthenticated();

  if (!isSuperAdmin) {
    throw new Error("UNAUTHORIZED_NOT_ADMIN");
  }

  const user = await getSessionUser();

  return {
    user,
    staffMember: null,
    isSuperAdmin: true,
    isAdminPagos: true,
    isStaff: true,
  };
}

export async function isUserStaff(user?: { id: string; email: string } | null): Promise<boolean> {
  if (!user) return false;
  const staff = await prisma.staffMember.findFirst({
    where: {
      OR: [
        { userId: user.id },
        { email: { equals: user.email.trim(), mode: "insensitive" } },
      ],
      activo: true,
    },
    select: { id: true },
  });
  return Boolean(staff);
}

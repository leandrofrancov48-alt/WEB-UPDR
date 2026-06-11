"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, Award } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

type NotificationType = "20pts" | "40pts" | "pleno";

interface NotificationsState {
  show20PtsNotification: boolean;
  show40PtsNotification: boolean;
  showPlenoNotification: boolean;
}

export default function GlobalNotifications() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeNotification, setActiveNotification] = useState<NotificationType | null>(null);
  const [notifications, setNotifications] = useState<NotificationsState>({
    show20PtsNotification: false,
    show40PtsNotification: false,
    showPlenoNotification: false,
  });

  const checkNotifications = async () => {
    try {
      const res = await fetch("/api/album/notifications");
      if (!res.ok) return;
      const data = await res.json();
      
      setNotifications({
        show20PtsNotification: data.show20PtsNotification,
        show40PtsNotification: data.show40PtsNotification,
        showPlenoNotification: data.showPlenoNotification,
      });
    } catch (e) {
      console.error("Error fetching notifications:", e);
    }
  };

  useEffect(() => {
    // Check notifications on mount
    checkNotifications();
  }, [pathname]); // Check again if they navigate

  useEffect(() => {
    // Determine the next notification to show
    if (notifications.show20PtsNotification) {
      setActiveNotification("20pts");
    } else if (notifications.show40PtsNotification) {
      setActiveNotification("40pts");
    } else if (notifications.showPlenoNotification) {
      setActiveNotification("pleno");
    } else {
      setActiveNotification(null);
    }
  }, [notifications]);

  const handleDismiss = async () => {
    if (!activeNotification) return;

    try {
      const res = await fetch("/api/album/dismiss-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeNotification }),
      });

      if (res.ok) {
        // Update local state to trigger showing the next notification in line (or closing)
        setNotifications((prev) => {
          const next = { ...prev };
          if (activeNotification === "20pts") next.show20PtsNotification = false;
          if (activeNotification === "40pts") next.show40PtsNotification = false;
          if (activeNotification === "pleno") next.showPlenoNotification = false;
          return next;
        });
      }
    } catch (e) {
      console.error("Error dismissing notification:", e);
    }
  };

  const handleGoToAlbum = async () => {
    await handleDismiss();
    router.push("/album");
  };

  if (!activeNotification) return null;

  let title = "¡FELICITACIONES!";
  let message = "";
  let icon = <Trophy className="w-16 h-16 text-brand-yellow mx-auto mb-4 animate-bounce" />;

  if (activeNotification === "pleno") {
    title = "¡PLENO ACERTADO!";
    message = "Has recibido 1 sobre (de 1 figurita) por haber acertado un pleno en el prode. ¡Reclamalo en tu Álbum!";
    icon = <Sparkles className="w-16 h-16 text-brand-yellow mx-auto mb-4 animate-pulse" />;
  } else if (activeNotification === "20pts") {
    title = "¡20 PUNTOS ALCANZADOS!";
    message = "Has alcanzado los 20 puntos en el prode. ¡Ganaste un sobre especial con 2 figuritas! Reclamalo en tu Álbum.";
    icon = <Trophy className="w-16 h-16 text-brand-yellow mx-auto mb-4" />;
  } else if (activeNotification === "40pts") {
    title = "¡40 PUNTOS ALCANZADOS!";
    message = "Has alcanzado los 40 puntos en el prode. ¡Ganaste un sobre especial con 3 figuritas! Reclamalo en tu Álbum.";
    icon = <Award className="w-16 h-16 text-brand-yellow mx-auto mb-4" />;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-[#050b1a] border border-brand-yellow/50 p-8 rounded-2xl max-w-md text-center shadow-[0_0_50px_rgba(255,204,0,0.25)] relative overflow-hidden"
        >
          {/* Decorative glows */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-brand-yellow/10 rounded-full blur-xl" />
          <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-brand-orange/10 rounded-full blur-xl" />

          {icon}
          <h3 className="text-3xl font-yellow text-brand-yellow mb-4 tracking-wide">{title}</h3>
          <p className="text-white/90 text-sm leading-relaxed mb-6 font-medium">
            {message}
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleGoToAlbum}
              className="px-8 py-3 bg-gradient-to-r from-brand-yellow to-brand-orange text-black font-bold rounded-full hover:scale-105 active:scale-95 transition-all w-full shadow-lg shadow-brand-yellow/15"
            >
              IR A MI ÁLBUM
            </button>
            <button
              onClick={handleDismiss}
              className="px-8 py-2 bg-white/5 hover:bg-white/10 text-white/70 font-semibold text-xs rounded-full transition-all w-full"
            >
              CERRAR
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

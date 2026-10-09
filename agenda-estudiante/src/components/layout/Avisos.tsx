"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { useAgenda } from "@/context/AgendaContext";

/** Retroalimentación inmediata: aviso flotante que aparece y se desvanece. */
export function Avisos() {
  const { avisos } = useAgenda();

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-50 mx-auto flex w-full max-w-sm flex-col items-center gap-2 px-4"
    >
      <AnimatePresence initial={false}>
        {avisos.map((aviso) => (
          <motion.div
            key={aviso.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-lg"
          >
            <CheckCircle2 className="size-4 text-primary-soft" aria-hidden />
            {aviso.texto}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

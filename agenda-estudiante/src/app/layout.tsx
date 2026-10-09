import type { Metadata, Viewport } from "next";

import { AgendaProvider } from "@/context/AgendaContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { SideNav } from "@/components/layout/SideNav";
import { Avisos } from "@/components/layout/Avisos";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mi semana · Agenda del estudiante",
    template: "%s · Mi semana",
  },
  description: "Organiza clases, turnos y estudio en una sola agenda pensada para el celular.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1f5fb4",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <AgendaProvider>
          <div className="relative min-h-dvh lg:pl-64">
            <SideNav />
            <div className="relative mx-auto flex min-h-dvh w-full max-w-2xl flex-col lg:max-w-6xl">
              <AppHeader />
              <main className="flex-1 px-4 pb-32 pt-2 sm:px-6 lg:px-8 lg:pb-10 lg:pt-6">{children}</main>
              <BottomNav />
              <Avisos />
            </div>
          </div>
        </AgendaProvider>
      </body>
    </html>
  );
}

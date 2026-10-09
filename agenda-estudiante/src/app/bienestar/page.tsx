import type { Metadata } from "next";

import { BienestarScreen } from "@/components/bienestar/BienestarScreen";

export const metadata: Metadata = { title: "Bienestar" };

export default function BienestarPage() {
  return <BienestarScreen />;
}

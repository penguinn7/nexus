import type { Metadata } from "next";
import { SmoothScrollProvider } from "@/components/SmoothScroll";
import { Cursor } from "@/components/portfolio/cursor";
import { BootSequence } from "@/components/portfolio/boot";

export const metadata: Metadata = {
  title: "SONAKSHI'S SPACE — a digital exhibit",
  description:
    "What happens when an idea leaves my head? A live, honest, build-in-progress portfolio of Sonakshi — applying for undergraduate CS/AI programs.",
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-pf-ink text-pf-text pf-noise">
      <SmoothScrollProvider>
        <Cursor />
        <BootSequence />
        <main className="relative">{children}</main>
      </SmoothScrollProvider>
    </div>
  );
}
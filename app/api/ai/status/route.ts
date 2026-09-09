import { NextResponse } from "next/server";
import { resolveAIProvider } from "@/lib/ai/provider";
import { webResearchEnabled } from "@/lib/ai/search";

export const runtime = "nodejs";

/** Diagnostics for the deployed function — never exposes secrets. */
export async function GET() {
  const provider = resolveAIProvider();
  return NextResponse.json({
    ok: true,
    provider: provider?.name ?? null,
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    geminiModel: process.env.GEMINI_MODEL ?? null,
    tavilyEnabled: webResearchEnabled(),
  });
}
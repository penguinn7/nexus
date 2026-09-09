import { NextResponse } from "next/server";
import { resolveAIProvider } from "@/lib/ai/provider";
import { webResearchEnabled } from "@/lib/ai/search";

export const runtime = "nodejs";

/** Diagnostics for the deployed function — never exposes full secrets. */
export async function GET() {
  const provider = resolveAIProvider();
  const key = process.env.GEMINI_API_KEY;
  return NextResponse.json({
    ok: true,
    provider: provider?.name ?? null,
    geminiKeyConfigured: Boolean(key),
    geminiKeyPattern: key ? `${key.slice(0, 5)}…(len ${key.length})` : null,
    geminiModel: process.env.GEMINI_MODEL ?? null,
    tavilyEnabled: webResearchEnabled(),
  });
}
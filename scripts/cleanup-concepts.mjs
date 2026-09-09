// One-off cleanup: remove junk concepts (API KEY, Space, Add, What, 2026, ...)
// that leaked into the knowledge graph from setup-chat text. Run from the repo root:
//   node scripts/cleanup-concepts.mjs
// Uses the service role key from .env.local (server-side only, never prints it).

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const raw = readFileSync(".env.local", "utf8").replace(/^\uFEFF/, "");
const env = {};
for (const line of raw.split(/\r?\n/)) {
  if (!line.trim() || line.trim().startsWith("#")) continue;
  const idx = line.indexOf("=");
  if (idx <= 0) continue;
  const name = line.slice(0, idx).trim();
  const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
  if (name) env[name] = value;
}

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = env.SUPABASE_SERVICE_ROLE_KEY;
console.log("Loaded env names:", Object.keys(env).join(", ") || "(none)");
if (env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log(
    "Service role key: starts with",
    env.SUPABASE_SERVICE_ROLE_KEY.slice(0, 12) + "… (length " + env.SUPABASE_SERVICE_ROLE_KEY.length + ")"
  );
}
if (!url || !serviceRole) {
  console.error("Missing .env.local values (URL or service role key). Aborting.");
  process.exit(1);
}

const SUPABASE = createClient(url, serviceRole);

const JUNK = [
  "KEY",
  "API KEY",
  "GEMINI API KEY",
  "GEMINI KEY",
  "Space",
  "Add",
  "What",
  "2026",
  "NEXT_PUBLIC_SUPABASE_URL",
  "Service Role",
];

const { data: matched, error: findErr } = await SUPABASE.from("concepts")
  .select("id, name")
  .in("name", JUNK);

if (findErr) {
  console.error("Lookup failed:", findErr.message);
  process.exit(1);
}
if (!matched.length) {
  console.log("No junk concepts found — nothing to delete.");
  process.exit(0);
}

console.log("Will delete these concepts:");
for (const c of matched) console.log(`  - ${c.name}`);

const { error: delErr } = await SUPABASE.from("concepts")
  .delete()
  .in("name", JUNK);

if (delErr) {
  console.error("Delete failed:", delErr.message);
  process.exit(1);
}

console.log(`Deleted ${matched.length} concept(s). Connected edges were removed automatically.`);
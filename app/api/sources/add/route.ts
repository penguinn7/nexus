import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  extractPdfText,
  extractUrlText,
  extractYoutubeText,
  processText,
  embedChunks,
  isTextFile,
  ALLOWED_MIME,
  MAX_FILE_BYTES,
} from "@/lib/ingest/processor";
import { extractConcepts } from "@/lib/ai/pipeline";

type SourceType = "pdf" | "text" | "url" | "youtube";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const spaceId = form.get("spaceId")?.toString();
  if (!spaceId) {
    return NextResponse.json({ error: "Missing space." }, { status: 400 });
  }
  const kind = form.get("kind")?.toString() as SourceType | undefined;
  if (kind !== "pdf" && kind !== "text" && kind !== "url" && kind !== "youtube") {
    return NextResponse.json({ error: "Unsupported source type." }, { status: 400 });
  }

  // Ownership + existence check (server-side, never trust the client's spaceId)
  const { data: space } = await supabase
    .from("spaces")
    .select("id, user_id")
    .eq("id", spaceId)
    .eq("user_id", user.id)
    .single();
  if (!space) {
    return NextResponse.json({ error: "Space not found." }, { status: 404 });
  }

  try {
    if (kind === "youtube") {
      return await addYoutubeSource(supabase, { spaceId, userId: user.id, form });
    }
    if (kind === "url") {
      return await addUrlSource(supabase, { spaceId, userId: user.id, form });
    }
    if (kind === "pdf" || kind === "text") {
      return await addFileSource(supabase, {
        spaceId,
        userId: user.id,
        kind,
        form,
      });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Processing failed";
    console.error("ingest failed", msg);
    return NextResponse.json({ error: safeError(msg) }, { status: 500 });
  }

  return NextResponse.json({ error: "Unexpected state." }, { status: 500 });
}

/* ------------------------------------------------------------------ */

async function addUrlSource(
  supabase: Awaited<ReturnType<typeof createClient>>,
  { spaceId, userId, form }: { spaceId: string; userId: string; form: FormData }
) {
  const url = form.get("url")?.toString()?.trim();
  if (!url) return NextResponse.json({ error: "Enter a URL." }, { status: 400 });
  if (!/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: "URL must start with http:// or https://" }, { status: 400 });
  }

  const { data: source, error: srcErr } = await supabase
    .from("sources")
    .insert({
      space_id: spaceId,
      user_id: userId,
      title: url.length > 80 ? url.slice(0, 77) + "..." : url,
      source_type: "url",
      url,
      status: "processing",
    })
    .select("id, title")
    .single();
  if (srcErr || !source) {
    console.error("source insert", srcErr);
    return NextResponse.json({ error: "Could not create source." }, { status: 500 });
  }

  const { title, text } = await extractUrlText(url);
  await supabase
    .from("sources")
    .update({ title: title.slice(0, 140), status: "indexing" })
    .eq("id", source.id);

  const { normalizedText, chunks } = processText(text);
  await ingestDocument(supabase, {
    sourceId: source.id,
    spaceId,
    userId,
    filePath: url,
    content: normalizedText,
    chunks,
  });

  void extractConcepts({ text: normalizedText.slice(0, 12000), spaceId, userId }).catch((e) =>
    console.error("concept extraction", e)
  );

  return NextResponse.json({ ok: true, source });
}

async function addYoutubeSource(
  supabase: Awaited<ReturnType<typeof createClient>>,
  { spaceId, userId, form }: { spaceId: string; userId: string; form: FormData }
) {
  let url = form.get("url")?.toString()?.trim() ?? "";
  if (!url) {
    const link = form.get("link")?.toString()?.trim();
    if (link) url = link;
  }
  if (!url) return NextResponse.json({ error: "Paste a YouTube link." }, { status: 400 });

  const isYouTube =
    /youtube\.com\/watch|youtube\.com\/shorts|youtu\.be\//i.test(url);
  if (!isYouTube) {
    return NextResponse.json(
      { error: "That doesn't look like a YouTube link." },
      { status: 400 }
    );
  }
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  const { data: source, error: srcErr } = await supabase
    .from("sources")
    .insert({
      space_id: spaceId,
      user_id: userId,
      title: url.length > 80 ? url.slice(0, 77) + "..." : url,
      source_type: "youtube",
      url,
      status: "processing",
    })
    .select("id, title")
    .single();
  if (srcErr || !source) {
    console.error("youtube source insert", srcErr);
    return NextResponse.json({ error: "Could not create source." }, { status: 500 });
  }

  await supabase
    .from("sources")
    .update({ status: "indexing" })
    .eq("id", source.id);

  let text = "";
  let title = "YouTube video";
  try {
    const extracted = await extractYoutubeText(url);
    title = extracted.title;
    text = extracted.text;
  } catch (e) {
    console.warn("youtube extraction failed, keeping link-only source", e);
    text = `YouTube video\nURL: ${url}\n(Full transcript retrieval was blocked by YouTube for this video.)`;
  }

  await supabase
    .from("sources")
    .update({ title: title.slice(0, 140) })
    .eq("id", source.id);

  const { normalizedText, chunks } = processText(text);
  await ingestDocument(supabase, {
    sourceId: source.id,
    spaceId,
    userId,
    filePath: url,
    content: normalizedText,
    chunks,
  });

  void extractConcepts({ text: normalizedText.slice(0, 12000), spaceId, userId }).catch((e) =>
    console.error("youtube concept extraction", e)
  );

  return NextResponse.json({ ok: true, source });
}

async function addFileSource(
  supabase: Awaited<ReturnType<typeof createClient>>,
  {
    spaceId,
    userId,
    kind,
    form,
  }: { spaceId: string; userId: string; kind: SourceType; form: FormData }
) {
  if (kind === "text") {
    const title = form.get("title")?.toString()?.trim() || "Untitled text";
    const content = form.get("content")?.toString() ?? "";

    const { data: source, error: srcErr } = await supabase
      .from("sources")
      .insert({
        space_id: spaceId,
        user_id: userId,
        title: title.slice(0, 140),
        source_type: "text",
        status: "processing",
      })
      .select("id, title")
      .single();
    if (srcErr || !source) {
      console.error("text source insert", srcErr);
      return NextResponse.json({ error: "Could not create source." }, { status: 500 });
    }

    await supabase
      .from("sources")
      .update({ status: "indexing" })
      .eq("id", source.id);

    const { normalizedText, chunks } = processText(content);
    await ingestDocument(supabase, {
      sourceId: source.id,
      spaceId,
      userId,
      filePath: `inline:${title}`,
      content: normalizedText,
      chunks,
    });

    void extractConcepts({ text: normalizedText.slice(0, 12000), spaceId, userId }).catch((e) =>
      console.error("text concept extraction", e)
    );

    return NextResponse.json({ ok: true, source });
  }

  // File upload: PDF or plain text (txt/md/csv)
  const file = form.get("file") as File | null;
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "File too large (max 10 MB)." }, { status: 400 });
  }

  const declaredMime = (file.type || "").toLowerCase();
  const mapped = ALLOWED_MIME.get(declaredMime);
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  // Text files (txt/md/csv) are read inline and stored as text sources.
  const looksText = mapped === "text" || isTextFile(file.name);
  const looksPdf = declaredMime === "application/pdf" || extension === "pdf";

  if (looksPdf) {
    return await runPdfUpload(supabase, { spaceId, userId, file });
  }
  if (looksText) {
    return await runTextFileUpload(supabase, { spaceId, userId, file });
  }

  return NextResponse.json(
    { error: "Unsupported file type — upload a PDF, TXT, MD or CSV file." },
    { status: 400 }
  );
}

async function runPdfUpload(
  supabase: Awaited<ReturnType<typeof createClient>>,
  { spaceId, userId, file }: { spaceId: string; userId: string; file: File }
) {
  const bytes = await file.arrayBuffer();
  const text = await extractPdfText(bytes);

  const { data: source, error: srcErr } = await supabase
    .from("sources")
    .insert({
      space_id: spaceId,
      user_id: userId,
      title: file.name.replace(/\.[^.]+$/, "").slice(0, 140),
      source_type: "pdf",
      status: "uploading",
    })
    .select("id, title")
    .single();
  if (srcErr || !source) {
    console.error("pdf source insert", srcErr);
    return NextResponse.json({ error: "Could not create source." }, { status: 500 });
  }

  // ── Upload to storage: user_id / space_id / source_id / filename ──
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  const filePath = `${encodeSafe(userId)}/${encodeSafe(spaceId)}/${encodeSafe(source.id)}/${encodeSafe(safeName)}`;

  const { error: upErr } = await supabase.storage
    .from("nexus-sources")
    .upload(filePath, bytes, {
      contentType: "application/pdf",
      upsert: false,
    });
  if (upErr) {
    await supabase.from("sources").update({ status: "failed", error: "Storage upload failed" }).eq("id", source.id);
    console.error("storage upload", upErr);
    return NextResponse.json({ error: "Could not upload the file to storage." }, { status: 500 });
  }

  await supabase
    .from("sources")
    .update({ status: "indexing" })
    .eq("id", source.id);

  const { normalizedText, chunks } = processText(text);
  await ingestDocument(supabase, {
    sourceId: source.id,
    spaceId,
    userId,
    filePath,
    content: normalizedText,
    chunks,
  });

  void extractConcepts({ text: normalizedText.slice(0, 12000), spaceId, userId }).catch((e) =>
    console.error("pdf concept extraction", e)
  );

  return NextResponse.json({ ok: true, source });
}

async function runTextFileUpload(
  supabase: Awaited<ReturnType<typeof createClient>>,
  { spaceId, userId, file }: { spaceId: string; userId: string; file: File }
) {
  const text = await file.text();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  const title = file.name.replace(/\.[^.]+$/, "").slice(0, 140) || safeName;

  const { data: source, error: srcErr } = await supabase
    .from("sources")
    .insert({
      space_id: spaceId,
      user_id: userId,
      title,
      source_type: "text",
      status: "processing",
    })
    .select("id, title")
    .single();
  if (srcErr || !source) {
    console.error("text source insert", srcErr);
    return NextResponse.json({ error: "Could not create source." }, { status: 500 });
  }

  await supabase
    .from("sources")
    .update({ status: "indexing" })
    .eq("id", source.id);

  const { normalizedText, chunks } = processText(text);
  await ingestDocument(supabase, {
    sourceId: source.id,
    spaceId,
    userId,
    filePath: `upload:${safeName}`,
    content: normalizedText,
    chunks,
  });

  void extractConcepts({ text: normalizedText.slice(0, 12000), spaceId, userId }).catch((e) =>
    console.error("text concept extraction", e)
  );

  return NextResponse.json({ ok: true, source });
}

async function ingestDocument(
  supabase: Awaited<ReturnType<typeof createClient>>,
  input: {
    sourceId: string;
    spaceId: string;
    userId: string;
    filePath: string;
    content: string;
    chunks: string[];
  }
) {
  const { sourceId, spaceId, userId, filePath, content, chunks } = input;

  const { data: doc, error: docErr } = await supabase
    .from("documents")
    .insert({
      source_id: sourceId,
      space_id: spaceId,
      user_id: userId,
      file_name: filePath.split("/").pop() ?? "document",
      file_path: filePath,
      extracted_text: content,
    })
    .select("id")
    .single();
  if (docErr || !doc) {
    console.error("document insert", docErr);
    throw new Error("Could not store the extracted document.");
  }

  if (chunks.length > 0) {
    let vectors: number[][] | null = null;
    try {
      vectors = await embedChunks(chunks);
    } catch (e) {
      console.error("embedding failed — storing chunks without embeddings", e);
    }

    const rows = chunks.map((c, i) => ({
      document_id: doc.id,
      space_id: spaceId,
      user_id: userId,
      content: c,
      embedding: vectors?.[i] ?? null,
      metadata: { chunk_index: i, source_id: sourceId },
    }));

    // Insert in batches to stay within request limits
    for (let i = 0; i < rows.length; i += 50) {
      const { error: chErr } = await supabase
        .from("document_chunks")
        .insert(rows.slice(i, i + 50));
      if (chErr) {
        console.error("chunk insert", chErr);
      }
    }
  }

  await supabase
    .from("sources")
    .update({ status: "ready", error: null })
    .eq("id", sourceId);
}

function encodeSafe(s: string): string {
  return s.replace(/[^a-zA-Z0-9._-]/g, "");
}

function safeError(msg: string): string {
  const low = msg.toLowerCase();
  if (low.includes("password protected") || low.includes("encrypted")) {
    return "This PDF is encrypted or password-protected and could not be read.";
  }
  if (low.includes("invalid url")) return msg;
  if (low.includes("status 4") || low.includes("status 5")) {
    return "The URL could not be fetched (the site may block automated access).";
  }
  if (low.includes("file too large")) return msg;
  return "NEXUS could not process this source. Please try a different file or URL.";
}
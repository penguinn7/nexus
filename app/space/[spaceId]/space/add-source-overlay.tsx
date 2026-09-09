"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, FileUp, Link2, Type, Youtube, Loader2 } from "lucide-react";
import { NexusButton, GlowInput } from "@/components/nexus/ui";
import { cn } from "@/lib/utils";

type Kind = "pdf" | "text" | "url" | "youtube";

type AddFile = { name: string; type: string; size: number };

const STATUS_FLOW = ["UPLOADING", "PROCESSING", "INDEXING", "ANALYZING"];

function isYouTubeUrl(url: string): boolean {
  return /youtube\.com\/watch|youtube\.com\/shorts|youtu\.be\//i.test(url);
}

function isAllowedFile(f: AddFile): boolean {
  const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
  const allowedExt = new Set(["pdf", "txt", "md", "markdown", "csv"]);
  const allowedMime = new Set([
    "application/pdf",
    "text/plain",
    "text/markdown",
    "text/csv",
  ]);
  return allowedExt.has(ext) || allowedMime.has(f.type.toLowerCase());
}

export function AddSourceOverlay({
  spaceId,
  onClose,
  initialKind,
  initialFile,
  initialUrl,
}: {
  spaceId: string;
  onClose: () => void;
  initialKind?: Kind | null;
  initialFile?: File | null;
  initialUrl?: string | null;
}) {
  const router = useRouter();
  const [kind, setKind] = useState<Kind>(initialKind ?? "pdf");
  const [file, setFile] = useState<File | null>(initialFile ?? null);
  const [url, setUrl] = useState(initialUrl ?? "");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusStep, setStatusStep] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, busy]);

  useEffect(() => {
    if (!busy) return;
    if (statusStep >= STATUS_FLOW.length - 1) return;
    const t = setTimeout(() => setStatusStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [busy, statusStep]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    let finalKind = kind;
    if (kind === "url" && isYouTubeUrl(url.trim())) {
      finalKind = "youtube";
    }

    if ((finalKind === "pdf") && !file) {
      setError("Choose a file to upload.");
      return;
    }
    if ((finalKind === "url" || finalKind === "youtube") && !url.trim()) {
      setError(finalKind === "youtube" ? "Paste a YouTube link." : "Enter a URL.");
      return;
    }
    if (finalKind === "text" && (!content.trim() || !title.trim())) {
      setError("Add a title and some content.");
      return;
    }

    setBusy(true);
    setStatusStep(0);

    const fd = new FormData();
    fd.append("spaceId", spaceId);
    fd.append("kind", finalKind);
    if (finalKind === "pdf") fd.append("file", file!);
    if (finalKind === "url" || finalKind === "youtube") fd.append("url", url.trim());
    if (finalKind === "text") {
      fd.append("title", title.trim());
      fd.append("content", content);
    }

    try {
      const res = await fetch("/api/sources/add", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not add the source.");
        setBusy(false);
        return;
      }
      onClose();
      router.refresh();
    } catch {
      setError("Network error — please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={busy ? undefined : onClose} />
      <div className="relative w-full max-w-lg rounded-2xl glass-strong p-6 shadow-[0_0_80px_hsl(var(--glow-violet)/0.2)] animate-scale-in">
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-(--muted-foreground) transition-colors hover:bg-(--card) hover:text-(--foreground) disabled:opacity-40 cursor-pointer"
        >
          <X size={16} />
        </button>

        <h2 className="font-display text-xl font-semibold text-(--foreground)">
          Add a source
        </h2>
        <p className="mt-1 text-sm text-(--muted-foreground)">
          Drop a file, pasted text, a webpage or a YouTube video — NEXUS reads it
          and connects it to this Space.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Kind selector */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <KindButton active={kind === "pdf"} icon={FileUp} label="File" onClick={() => setKind("pdf")} />
            <KindButton active={kind === "url"} icon={Link2} label="Webpage" onClick={() => setKind("url")} />
            <KindButton active={kind === "youtube"} icon={Youtube} label="YouTube" onClick={() => setKind("youtube")} />
            <KindButton active={kind === "text"} icon={Type} label="Text" onClick={() => setKind("text")} />
          </div>

          {kind === "pdf" && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) {
                  if (!isAllowedFile(f)) {
                    setError("Unsupported file type — use PDF, TXT, MD or CSV.");
                    return;
                  }
                  if (f.size > 10 * 1024 * 1024) {
                    setError("File too large (max 10 MB).");
                    return;
                  }
                  setError(null);
                  setFile(f);
                }
              }}
              className={cn(
                "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-sm transition-all cursor-pointer",
                file
                  ? "border-(--primary)/50 bg-(--primary)/10 text-(--foreground)"
                  : "border-(--border) bg-(--card)/40 text-(--muted-foreground) hover:border-(--primary)/40 hover:text-(--foreground)"
              )}
            >
              <FileUp size={22} className={file ? "text-(--primary)" : ""} />
              {file ? (
                <span className="font-medium text-(--foreground)">
                  {file.name} <span className="ml-1 text-[11px] text-(--muted-foreground)">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                </span>
              ) : (
                <span className="text-(--muted-foreground)">
                  Drop a file here (PDF, TXT, MD, CSV) or click to browse
                </span>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.txt,.md,.markdown,.csv,application/pdf,text/plain,text/markdown,text/csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    if (!isAllowedFile(f)) {
                      setError("Unsupported file type — use PDF, TXT, MD or CSV.");
                      return;
                    }
                    setError(null);
                    setFile(f);
                  }
                }}
              />
            </button>
          )}

          {(kind === "url" || kind === "youtube") && (
            <>
              <GlowInput
                label={kind === "youtube" ? "YouTube link" : "Webpage URL"}
                type="url"
                placeholder={
                  kind === "youtube" ? "https://www.youtube.com/watch?v=..." : "https://..."
                }
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                autoFocus
              />
              {kind === "url" && (
                <p className="-mt-2 text-[11px] text-(--muted-foreground)">
                  Tip: paste a YouTube link here anytime — NEXUS detects it automatically.
                </p>
              )}
              {kind === "youtube" && (
                <p className="-mt-2 text-[11px] text-(--muted-foreground)">
                  NEXUS reads the video title + description; full transcripts are only
                  available when YouTube exposes them.
                </p>
              )}
            </>
          )}

          {kind === "text" && (
            <>
              <GlowInput
                label="Title"
                placeholder="e.g. Reflections on thermodynamics"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-widest text-(--muted-foreground)">
                  Content
                </span>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  required
                  className="w-full resize-y rounded-xl border border-(--border) bg-(--card)/60 px-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground)/60 transition-all focus:border-(--primary)/60 focus:outline-none"
                  placeholder="Paste text..."
                />
              </label>
            </>
          )}

          {error && (
            <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          {/* Real ingestion status */}
          {busy && (
            <div className="rounded-xl border border-(--primary)/25 bg-(--primary)/8 p-3">
              <div className="flex items-center gap-2 text-sm text-(--primary)">
                <Loader2 size={14} className="animate-spin" />
                Teaching NEXUS this source...
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                {STATUS_FLOW.map((s, i) => (
                  <div key={s} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className={cn(
                        "h-1.5 w-full rounded-full transition-all",
                        i < statusStep
                          ? "bg-(--primary)"
                          : i === statusStep
                            ? "bg-(--primary)/50 animate-pulse"
                            : "bg-(--border)"
                      )}
                    />
                    <span className={cn("text-[9px] uppercase tracking-wider", i === statusStep ? "text-(--primary)" : "text-(--muted-foreground)/60")}>
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <NexusButton type="button" variant="ghost" onClick={onClose} disabled={busy}>
              Cancel
            </NexusButton>
            <NexusButton type="submit" loading={busy}>
              {busy ? "Processing..." : "Add source"}
            </NexusButton>
          </div>
        </form>
      </div>
    </div>
  );
}

function KindButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof FileUp;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[11px] transition-all cursor-pointer",
        active
          ? "border-(--primary)/60 bg-(--primary)/12 text-(--foreground)"
          : "border-(--border) bg-(--card)/50 text-(--muted-foreground) hover:border-(--primary)/30 hover:text-(--foreground)"
      )}
    >
      <Icon size={16} className={active ? "text-(--primary)" : ""} />
      {label}
    </button>
  );
}
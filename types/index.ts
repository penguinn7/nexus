import type { NexusThemeKey } from "@/lib/themes";

export type SpaceType =
  | "student"
  | "research"
  | "business"
  | "office"
  | "personal"
  | "creative"
  | "custom";

export type SourceType =
  | "pdf"
  | "text"
  | "url"
  | "note"
  | "youtube"
  | "image"
  | "audio"
  | "webpage"
  | "cloud"
  | "presentation"
  | "spreadsheet";

export type SourceStatus =
  | "uploading"
  | "processing"
  | "indexing"
  | "analyzing"
  | "ready"
  | "failed";

export type AiMode =
  | "quick"
  | "deep"
  | "research"
  | "teach"
  | "executive"
  | "creative";

export type MessageRole = "user" | "assistant";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Space {
  id: string;
  user_id: string;
  name: string;
  type: SpaceType;
  description: string | null;
  theme: NexusThemeKey;
  created_at: string;
}

export interface SpaceWithStats extends Space {
  source_count: number;
  concept_count: number;
  connection_count: number;
  note_count: number;
  conversation_count: number;
  recent_activity: string | null;
}

export interface Source {
  id: string;
  space_id: string;
  user_id: string;
  title: string;
  source_type: SourceType;
  url: string | null;
  status: SourceStatus;
  created_at: string;
}

export interface Document {
  id: string;
  source_id: string;
  space_id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  extracted_text: string | null;
  created_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  space_id: string;
  content: string;
  embedding: number[] | null;
  metadata: Record<string, unknown> | null;
}

export interface Conversation {
  id: string;
  space_id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
}

export interface Concept {
  id: string;
  space_id: string;
  user_id: string;
  name: string;
  description: string | null;
}

export interface Connection {
  id: string;
  space_id: string;
  concept_a: string;
  concept_b: string;
  relationship: string;
}

export interface Note {
  id: string;
  space_id: string;
  user_id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
}

/** A structured AI response block rendered by the assistant */
export interface AiResponseBlock {
  answer: string;
  keyPoints?: string[];
  sources?: { title: string; sourceId?: string }[];
  relatedConcepts?: { id?: string; name: string }[];
  contradictions?: string[];
  suggestedQuestions?: string[];
  nextActions?: string[];
}

export interface Stats {
  spaces: number;
  sources: number;
  concepts: number;
  connections: number;
}

/** A chunk retrieved from the knowledge base */
export interface ChunkRef {
  chunkId: string;
  sourceId: string;
  sourceTitle: string;
  content: string;
}

/** A source referenced by an AI answer */
export interface SourceRef {
  id: string;
  title: string;
  sourceType: string;
  url: string | null;
}

/** A concept surfaced by retrieval */
export interface ConceptRef {
  id: string;
  name: string;
}

/** Everything the AI grounded its answer on */
export interface RetrievalContext {
  chunks: ChunkRef[];
  sources: SourceRef[];
  concepts: ConceptRef[];
}

/** A persisted AI conversation message with grounding metadata */
export interface AiMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  context?: RetrievalContext;
}

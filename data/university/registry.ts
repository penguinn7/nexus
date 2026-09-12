import type { UniversityConfig } from "./types";
import { kaist } from "./kaist";

/**
 * Registry of every configured university portal.
 *
 * Adding a university = add its config module here + in `universities`.
 * The core UI never changes.
 */
export const universities: Record<string, UniversityConfig> = {
  kaist,
};

export function getUniversity(slug: string): UniversityConfig | undefined {
  return universities[slug.toLowerCase()];
}

export function listUniversitySlugs(): string[] {
  return Object.keys(universities);
}
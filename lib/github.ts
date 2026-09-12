import { site } from "@/data/site";

export interface GithubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  html_url: string;
  pushed_at: string | null;
}

export interface GithubResult {
  ok: boolean;
  repos?: GithubRepo[];
  message?: string;
}

const PLACEHOLDER = "your-github-username";
const GITHUB_API = "https://api.github.com";

export async function fetchGithubRepos(username?: string): Promise<GithubResult> {
  const user = username ?? site.github.username;
  if (!user || user === PLACEHOLDER) {
    return { ok: false, message: "username not configured yet" };
  }

  try {
    const res = await fetch(`${GITHUB_API}/users/${user}/repos?sort=updated&per_page=6`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return { ok: false, message: `GitHub responded ${res.status}` };
    }
    const list = (await res.json()) as {
      name: string;
      description: string | null;
      language: string | null;
      stargazers_count: number;
      forks_count: number;
      html_url: string;
      pushed_at: string;
    }[];

    const repos: GithubRepo[] = list.map((r) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      html_url: r.html_url,
      pushed_at: r.pushed_at,
    }));

    return { ok: true, repos };
  } catch {
    return { ok: false, message: "network unavailable" };
  }
}
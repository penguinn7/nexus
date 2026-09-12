/**
 * ─────────────────────────────────────────────────────────────
 *  PERSONAL IDENTITY  (private)
 *  One place to change your name, links and contact details.
 *  The whole site reads from here.
 * ─────────────────────────────────────────────────────────────
 */
export const site = {
  // Your display name
  name: "Sonakshi",
  // The "system name" of the portfolio — like an OS boot name
  spaceName: "SONAKSHI'S SPACE",
  tagline: "AI / CODE / IDEAS",
  role: "Student · India",
  status: "gap year · applying for 2027 intake",

  statement:
    "I like finding out what happens when an idea leaves my head.",
  statementSub:
    "right now that usually means a half-finished thing I fix until it works — then start reading about why it worked.",

  // Boot sequence lines ("exes" that load)
  bootModules: ["curiosity.exe", "build_mode.exe", "break_things.exe", "fix_things.exe", "question_engine.exe"],

  currentMode: ["learning", "building", "experimenting", "preparing", "figuring things out"],

  about: {
    introHighlight: "builds, then writes about how it went.",
    hivemind: "0",
    becoming: "∞",
    limitsKilled: "2",
    going: "↑",
    paragraphs: [
      "I grew up in the mountains, where the concepts of big-data-scale abundance are as far away as they get. My only gateway to the internet was whatever I could fit into a small data plan — so I learned to make every drop count.",
      "Why did I bother with electronics, a printer's inner parts, web design, an AI second brain, a beauty-startup, tech PR? Because at 18 I didn't know what to do with the ideas that wouldn't stop coming. So I kept testing — a triple-option course in everything.",
      "I'm not here to sell a completed picture. I'm here to show the picture in progress — and the fact that on this gap year, I chose a path myself and I'm on it.",
    ],
  },

  // Academic record (honest)
  academics: [
    { label: "CLASS 10", value: "88.2%", note: "CBSE", kind: "ok" },
    { label: "CLASS 11", value: "78%", note: "sliding", kind: "warn" },
    { label: "CLASS 12", value: "70%", note: "below where I wanted", kind: "low" },
    { label: "GAP YEAR", value: "now", note: "the turn", kind: "now" },
  ],

  projects: {
    lumora: {
      name: "LUMORA",
      sub: "A sculptural lamp product website",
      kind: "web · 3D experiment",
      live: "https://lumora-eta-dusky.vercel.app",
      repo: "https://github.com/penguinn7/LUMORA",
    },
    dellplay: {
      name: "DELL / PLAY",
      sub: "An independent Y2K-inspired Dell showroom concept",
      kind: "web · visual direction",
      live: "https://dell-y2k-showroom.vercel.app",
      repo: "https://github.com/penguinn7/dell-y2k-showroom",
    },
    nexus: {
      name: "NEXUS",
      sub: "An AI second brain — spaces, sources, notes, graph",
      kind: "app · AI · product",
      live: "/workspace", // real app lives here in this repo
      repo: "https://github.com/penguinn7/nexus",
    },
  },

  github: {
    username: "penguinn7",
    profileUrl: "https://github.com/penguinn7",
  },

  contact: {
    email: "spiritedaway7111@gmail.com",
    location: "India",
  },

  // Applied for the 2027 intake
  intake: "2027",

  // PDF files for the application kit (drop them into /public/docs/)
  docs: {
    sop: null, // TODO: "public/docs/sop.pdf"
    cv: null, // TODO: "public/docs/cv.pdf"
  },
};
/**
 * ─────────────────────────────────────────────────────────────
 *  PORTFOLIO COPY
 *  Every word on the public portfolio lives here.
 *  Written to sound like a person, not a brochure.
 * ─────────────────────────────────────────────────────────────
 */

export const content = {
  about: {
    intro:
      "I'm Sonakshi, a student in India on a gap year after Class 12. I'm preparing for entrance exams, improving my board results, and spending the rest of my time turning ideas into things that work — or at least things that try.",
    how:
      "I don't have a polished story. I have a pattern. I see something I find interesting — a website, a video, a painting, a product — and I can't stop thinking about it. So I try to rebuild my own version of it. Something breaks. I figure out why. I build again.",
    becoming:
      "I'm not someone who has figured everything out. I'm someone who is becoming — one broken build at a time.",
    stats: [
      { label: "BASE", value: "India" },
      { label: "TARGET", value: "CS · AI · 2027" },
      { label: "CURRENT MODE", value: "figuring things out" },
    ],
  },

  learning: {
    title: "HOW I LEARN",
    subtitle: "It's not a method I was taught. It's a pattern I keep noticing in myself.",
    loop: [
      {
        stage: "SEE SOMETHING",
        detail:
          "A website. A product. A video. A sculpture. It gets under my skin and I can't put it down.",
      },
      {
        stage: "GET CURIOUS",
        detail:
          "How does it work? Why does it feel good? What is underneath the surface of it?",
      },
      {
        stage: "RECREATE",
        detail:
          "I try to make my own version. Not to copy — to understand enough to rebuild it from scratch.",
      },
      {
        stage: "CHANGE IT",
        detail:
          "My version is never the same. I move things, re-skin them, add ideas that are only mine.",
      },
      {
        stage: "BREAK IT",
        detail:
          "It breaks. Or it doesn't behave like the thing I saw. This is where the real learning begins.",
      },
      {
        stage: "UNDERSTAND",
        detail:
          "I take it apart, read the error, look up the concept, ask AI to explain, and retry with better eyes.",
      },
      {
        stage: "BUILD AGAIN",
        detail:
          "The second version is almost always better than the first. The loop never really ends.",
      },
    ],
    closing:
      "That byte-level question — see something, want it, build it wrong, fix it — is the single most honest description of who I am as a learner.",
  },

  academics: {
    intro:
      "My results went 88.2 → 78 → 70 across Classes 10 to 12. I don't think that trajectory is an accident, and I don't think it's a life sentence either.",
    theTurn:
      "My Class 12 result was not where I wanted it to be. I decided to change what I did next — that's the whole sentence. No excuse needed, no victim story here.",
    gap: {
      academics: "JEE preparation. Board improvement. Rebuilding the study habits that slipped in Class 11 and 12.",
      technical: "Programming. AI. Independent projects. The stuff that got me curious in the first place.",
    },
    framing:
      "70% is part of my academic journey. Presenting it honestly — and answering it with what I changed afterwards — is the point.",
    footer:
      "The gap year is not a pause. It's the first time I treated my own learning as a system I could debug.",
  },

  question: {
    headline:
      "How do you turn an idea in your head into a reliable system that real people can actually use?",
    after:
      "I don't know the complete answer yet. That's exactly what I want to study.",
    nodes: ["IDEA", "EXPERIMENT", "BUILD", "FAIL", "UNDERSTAND", "REBUILD", "SYSTEM"],
  },

  projects: {
    intro: "Three exhibits. Each one started as a question in my head and ended as something I could open in a browser.",
    lumora: {
      title: "PROJECT 01",
      name: "LUMORA",
      subtitle: "A sculptural lamp product website",
      story:
        "I wanted to build a cinematic digital experience around a physical product — a sculptural lamp. Light, material, motion, atmosphere. I had a very specific 3D object in my head that I couldn't fully build with my current knowledge. So I adapted instead of stopping: strong light, strong shadows, a composition that got most of the way there.",
      learned:
        "An idea and a finished piece are separated by a dozen decisions I didn't expect to make. The satisfying part was watching something that existed only in my head become a website I could open in a tab.",
      wentWrong: [
        "The 3D object didn't match what I imagined",
        "Rendering got heavy on mobile",
        "The lighting took the mood in a different direction than planned",
      ],
      next: "Reconstruct the lamp properly in three dimensions, and let people 'walk' around it.",
    },
    dellplay: {
      title: "PROJECT 02",
      name: "DELL / PLAY",
      subtitle: "An independent Y2K-inspired Dell showroom concept",
      story:
        "A completely independent student project inspired by product-showcase experiences — not affiliated with Dell in any way. I became interested in how technology brands sell atmosphere, and made my own retro-future showroom as an exercise in visual direction and product presentation.",
      learned:
        "Presentation is a language. Layout, motion and colour tell people how to feel about an object before they read a single spec.",
      wentWrong: [
        "Small screens broke the showroom layout",
        "Font imports and loading fought my design",
        "The retro vibe slid into 'dated' before I tuned it",
      ],
      next: "Carry the same product-storytelling instinct into NEXUS.",
    },
    nexus: {
      title: "PROJECT 03",
      name: "NEXUS",
      subtitle: "An AI second brain — the project I'm most interested in",
      story:
        "NEXUS is an AI workspace — chat that understands context, spaces where knowledge lives, sources, notes, a graph of connected ideas, multiple themes, and different AI modes (quick, deep, research, teach, executive, creative). It's fully functional — you can use it right from this site.",
      learned:
        "Building with AI made me curious about what happens underneath the AI interface — retrieval, context, memory, how a machine decides what to say. The goal was never just 'I built an AI app'. It's: I built something with AI, and it made me want to understand AI more deeply.",
      wentWrong: [
        "AI-generated code I didn't initially understand — I had to go back and learn it",
        "Rate limits and latency taught me to respect the real world under an interface",
        "The knowledge graph kept disagreeing with my mental model of the data",
      ],
      next: "Understand the stack beneath the talking. Then make NEXUS genuinely reliable.",
      liveApp: "The working app lives at /workspace — you don't need an account to be impressed by it.",
    },
  },

  autopsies: {
    title: "PROJECT AUTOPSIES",
    subtitle: "Every portfolio shows off what worked. This one shows what broke — because that's the part that made me learn.",
    method: ["WHAT I IMAGINED", "WHAT ACTUALLY HAPPENED", "WHAT BROKE", "WHAT I DID", "WHAT I LEARNED"],
    cases: [
      {
        project: "LUMORA",
        items: [
          ["WHAT I IMAGINED", "A fully 3D sculptural lamp object, rotating under cinematic light."],
          ["WHAT ACTUALLY HAPPENED", "I built a strong, layered 2.5D composition that read as 3D at a glance."],
          ["WHAT BROKE", "The 3D model I wanted rendered poorly on mobile and fought the page performance."],
          ["WHAT I DID", "Adapted the concept to what the platform could carry — different, not worse."],
          ["WHAT I LEARNED", "Shipping a good version of a smaller idea beats hoarding a perfect idea I can't build yet."],
        ],
      },
      {
        project: "DELL / PLAY",
        items: [
          ["WHAT I IMAGINED", "A flawless Y2K showroom where every product floats perfectly in rhythm."],
          ["WHAT ACTUALLY HAPPENED", "A lively shop of floating products that broke into a column on mobile."],
          ["WHAT BROKE", "Layout, import timing, and a visual tone that wanted to be 1999 when I wanted 2005."],
          ["WHAT I DID", "Re-mocked the layout, clamped the art direction, made mobile a first-class state."],
          ["WHAT I LEARNED", "Get the skeleton right before the shine — structure, then polish."],
        ],
      },
      {
        project: "NEXUS",
        items: [
          ["WHAT I IMAGINED", "A second brain that connects everything I know and talks to me about it."],
          ["WHAT ACTUALLY HAPPENED", "An AI workspace with spaces, sources, notes, graph and real AI conversation."],
          ["WHAT BROKE", "Code I didn't write did things I didn't understand, and it broke exactly that way."],
          ["WHAT I DID", "I read it, asked it to explain itself, and rebuilt the parts I couldn't own."],
          ["WHAT I LEARNED", "Making something work before understanding it is a bridge, not a destination."],
        ],
      },
    ],
  },

  aiMe: {
    title: "AI + ME",
    subtitle: "The honest version — AI is the reason several of my projects exist, and also the thing I most want to understand myself.",
    bridge:
      "AI has carried me across the gap between the things I want to build and the things I currently know. That's a gift with a price: sometimes I make something work before I fully understand why it works.",
    goal:
      "I don't want to stop using AI. I want to stop needing it to understand things. My long-term goal is to be able to build the bridge myself.",
    labels: { left: "WHAT I WANT TO BUILD", middle: "AI BRIDGE", right: "WHAT I CURRENTLY KNOW" },
  },

  collaboration: {
    title: "COOPERATION",
    subtitle: "A small human moment that taught me more about working with people than any teamwork workshop.",
    storyTitle: "The extra prism experiment",
    story:
      "In Class 12 physics, during a group activity, I'd prepared an extra prism experiment on the side. Others in the group wanted to try it, but they couldn't follow the setup. So I traced the light path for them, and adjusted the scale of the equipment so it could be reproduced step by step.",
    lesson:
      "Knowing something yourself and making it understandable to someone else are different skills. Cooperation, I've concluded, is mostly translation.",
  },

  github: {
    title: "GITHUB",
    subtitle: "Real repositories, fetched live from GitHub when the API cooperates — public record, nothing invented.",
    fallback:
      "Live stats are unavailable right now, so here's what exists on my GitHub by name rather than by number.",
  },

  finance: {
    title: "FINANCIAL CONTEXT",
    subtitle: "A plain, unembellished note — because it's true.",
    body:
      "My family is not financially well-off. Studying abroad would not be possible for me without substantial financial assistance. If a university provides need-based aid, scholarships, tuition support or grants for international students, that support is the difference between this application being a hope and being a plan.",
    closing:
      "I'm not asking for sympathy. I'm stating a fact so that my application is easy to read — and so the programmes that can support international students know it matters.",
  },

  english: {
    title: "LANGUAGE",
    body:
      "I can read, write and communicate in English — this entire site is written in it. Right now I can't afford an expensive proficiency test like IELTS or TOEFL. If formal proof is required, I'm glad to demonstrate my English through another accepted method where one exists — and I'm very willing to learn a new local language too.",
  },

  kit: {
    title: "APPLICATION KIT",
    intro: "Everything an admissions officer might want, in one drawer.",
    items: [
      { label: "Statement of Purpose", href: "/portfolio/sop", hint: "digital reading copy" },
      { label: "CV", href: "/portfolio/cv", hint: "clean, printable" },
      { label: "GitHub", href: "#", hint: "code behind the projects" },
      { label: "University dossier", href: "#university", hint: "why this place × why me" },
    ],
  },

  finale: {
    first: "I don't know exactly where this goes yet.",
    second: "That's part of the reason I'm applying.",
    signoff: "SONAKSHI",
  },
};
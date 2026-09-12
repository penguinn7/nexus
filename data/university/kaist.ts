import type { UniversityConfig } from "./types";

/**
 * KAIST — fully researched university experience.
 *
 * Every claim below carries a source. Nothing is invented.
 * Figures are the latest officially published values; where
 * sources conflict, the official KAIST site wins and a note
 * is kept in the section itself.
 */
export const kaist: UniversityConfig = {
  slug: "kaist",

  name: "KAIST",
  fullName: "Korea Advanced Institute of Science and Technology",
  country: "South Korea",
  city: "Daejeon",
  founded: "1971",
  officialSite: "https://www.kaist.ac.kr/en",
  admissionsSite: "https://admission.kaist.ac.kr/intl-undergraduate",
  identityLine:
    "Korea's first and top science and technology university — a research institution that has been younger than its students' ambitions since 1971.",

  colors: {
    base: "#05070c",
    accent: "#7ea0ff",
    accent2: "#b7fa3c",
    accentText: "#0a0d16",
  },

  heroImage: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/KAIST_campus_at_night.jpg/1280px-KAIST_campus_at_night.jpg",
    alt: "KAIST main campus at night",
    category: "NIGHT",
    credit: "Wikimedia Commons",
    link: "https://commons.wikimedia.org/wiki/File:KAIST_campus_at_night.jpg",
  },

  intro: [
    "KAIST was established in 1971 as South Korea's first research-oriented graduate school in science and technology, and started undergraduate programmes in 1986. Its campus moved to Daejeon in 1989.",
    "It sits inside Daedeok Innopolis, Korea's largest R&D hub — the area where Korea's first science satellite was born, and where the world's first human-like robot, KAIST's HUBO, was created.",
    "What stands out to me: KAIST has always kept more graduate students than undergraduates. It was built as a research institution. That posture is visible in the undergraduate experience too.",
  ],

  stats: [
    {
      label: "Students",
      value: "12,348",
      note: "BS 4,009 · MS 3,767 · PhD 2,896 · Joint MS/PhD 1,676",
      source: { label: "KAIST — More about KAIST", url: "https://www.kaist.ac.kr/en/html/kaist/01.html" },
    },
    {
      label: "Faculty",
      value: "731",
      note: "plus 907 staff — research-oriented from the start",
      source: { label: "KAIST — More about KAIST", url: "https://www.kaist.ac.kr/en/html/kaist/01.html" },
    },
    {
      label: "International students",
      value: "929",
      note: "from ~90 countries · int'l faculty 137",
      source: { label: "KAIST — More about KAIST", url: "https://www.kaist.ac.kr/en/html/kaist/01.html" },
    },
    {
      label: "Courses in English",
      value: "80%+",
      note: "int'l students are not required to take courses in Korean",
      source: { label: "KAIST IO — About / Study in Korea", url: "https://io.kaist.ac.kr/about/glance.do" },
    },
    {
      label: "Student : faculty",
      value: "≈ 17 : 1",
      note: "12,348 students vs 731 faculty (approximation from official figures)",
      source: { label: "KAIST — More about KAIST", url: "https://www.kaist.ac.kr/en/html/kaist/01.html" },
    },
    {
      label: "Campus housing",
      value: "7,600+",
      note: "21 on-campus residences",
      source: { label: "KAIST — More about KAIST", url: "https://www.kaist.ac.kr/en/html/kaist/01.html" },
    },
    {
      label: "Ranking",
      value: "#24",
      note: "QS World University Rankings by Subject 2025 — Engineering & Technology, #1 in Korea",
      source: { label: "KAIST 2027 Undergraduate Admissions Guide", url: "https://admission.kaist.ac.kr/wz/api/common/files/view/intl-undergraduate/pdf/Admissions_Guide_for_2027_admission.pdf" },
    },
    {
      label: "Int'l UG scholarship",
      value: "full ride",
      note: "tuition (8 semesters) + monthly living expenses + health insurance — KAIST's own guide: 'all international students receive full financial support'",
      source: { label: "KAIST 2027 Undergraduate Admissions Guide", url: "https://admission.kaist.ac.kr/wz/api/common/files/view/intl-undergraduate/pdf/Admissions_Guide_for_2027_admission.pdf" },
    },
  ],

  facts: [
    {
      title: "A research university that admits undergraduates",
      body: "Founded 1971 as the nation's first research-oriented graduate school; undergraduates arrived in 1986, and graduates still outnumber undergraduates.",
      source: { label: "KAIST IO — About", url: "https://io.kaist.ac.kr/about/glance.do" },
    },
    {
      title: "Undeclared major, no quota",
      body: "Freshmen enter without declaring a major and can choose whichever major they want at the end of their first year. 'There is no quota for each department/major.'",
      source: { label: "KAIST Int'l Undergraduate Admissions — Eligibility", url: "https://admission.kaist.ac.kr/intl-undergraduate/before/sub02" },
    },
    {
      title: "A brand-new College of AI",
      body: "KAIST launched a dedicated College of AI in spring 2026 — AI Computing, AI Systems, AX (AI Plus X), and AI & Future Studies — with 100 undergraduate places added.",
      source: { label: "The KAIST Herald — College of AI begins its first semester", url: "https://slv.herald.kaist.ac.kr/news/articleView.html?idxno=22207" },
    },
    {
      title: "Robots, satellites, chips",
      body: "KAIST's HUBO humanoid won the DARPA Robotics Challenge 2015 ($2M, all 8 tasks under 45 min); SaTReC launched Korea's first satellite, KITSAT-1, in 1992.",
      source: { label: "KAIST News — DRC-HUBO wins DARPA Robotics Challenge 2015", url: "https://www.kaist.ac.kr/newsen/html/news?mng_no=4379&mode=V" },
    },
    {
      title: "Inside Korea's Silicon Valley",
      body: "The campus sits in Daedeok Innopolis — birthplace of Korea's first satellite launch, world-first 64Mb DRAM and CDMA, and now 15% of Korea's research spending.",
      source: { label: "InvestKorea — Daejeon: From a City of Science to Industry 4.0", url: "https://www.investkorea.org/ik-en/bbs/i-2486/detail.do?ntt_sn=482562" },
    },
    {
      title: "Three campuses, two cities",
      body: "Main + Munji campuses in Daejeon's Daedeok Innopolis; a Seoul campus (home of the Kim Jaechul Graduate School of AI) — about 50 minutes from Seoul by high-speed train.",
      source: { label: "KAIST IO — About", url: "https://io.kaist.ac.kr/about/glance.do" },
    },
  ],

  academics: {
    title: "ACADEMICS",
    intro: "The relevant-to-me parts. I want strong foundations, then freedom to wander near AI, systems, and the human side of computing.",
    cards: [
      {
        title: "School of Computing",
        body: "The CS school runs undergraduate courses that read like my shortlist: Intro to Deep Learning, Machine Learning, an AI-systems course that looks at the whole stack (DNN compilers, GPUs, hardware), generative models, data visualisation, intelligent robot design & programming, and 'AI & computing for care' — computing for the underprivileged.", 
        source: { label: "KAIST School of Computing — Undergraduate curriculum", url: "https://cs.kaist.ac.kr/education/undergraduate" },
      },
      {
        title: "College of AI (est. 2026)",
        body: "Four departments: AI Computing, AI Systems, AX, and AI & Future Studies. Because majors are undeclared in year one, a student entering in 2027 can choose an AI department as their major in year two — describing a path I actually want to walk.",
        source: { label: "The KAIST Herald — College of AI begins its first semester", url: "https://slv.herald.kaist.ac.kr/news/articleView.html?idxno=22207" },
      },
      {
        title: "Kim Jaechul Graduate School of AI",
        body: "Korea's graduate school of AI, on KAIST's Seoul campus. Its courses note that AI911 'Individual Study' is explicitly open to undergraduates to join ML/AI research projects with faculty.",
        source: { label: "KAIST Kim Jaechul GSAI — Academics", url: "https://gsai.kaist.ac.kr/academics" },
      },
      {
        title: "Math where it's needed",
        body: "A CS curriculum that expects real mathematics underneath — from optimisation to probability and statistics. The understructure for understanding why models work, not just how to call them.",
        source: { label: "KAIST College of Natural Sciences", url: "https://www.kaist.ac.kr/en/html/edu/03.html" },
      },
    ],
  },

  research: {
    title: "RESEARCH",
    intro: "I don't know exactly which direction I'll specialise in — AI systems, HCI, robotics, or software. KAIST's spread is exactly why I'm interested.",
    cards: [
      {
        title: "Undergraduate Research Participation (URP)",
        body: "An official programme for undergrads to do research with faculty and TAs — up to two participations. It includes a 'Creative Project' track where the student proposes their own research idea. My entire build loop is: propose an idea, break it, understand it. This is the institutional version of that.",
        source: { label: "KAIST College of Engineering — URP", url: "https://engineering.kaist.ac.kr/content?menu=61" },
      },
      {
        title: "Humanoid robotics with hardware proof",
        body: "DRC-HUBO completed all eight DARPA Robotics Challenge tasks in under 45 minutes and took first place among 24 teams — the $2M win by KAIST's team in 2015. Robotics that isn't a magazine article; it's a machine that drives, opens doors and walks over rubble.",
        source: { label: "KAIST News — DRC-HUBO wins DARPA Robotics Challenge 2015", url: "https://www.kaist.ac.kr/newsen/html/news?mng_no=4379&mode=V" },
      },
      {
        title: "AI headquarters in Seoul",
        body: "The Kim Jaechul Graduate School of AI runs at the Seoul campus — and its Individual Study course (AI911) is open to undergraduates. Proximity to a big AI school from year one is a gift.",
        source: { label: "KAIST Kim Jaechul GSAI — Academics", url: "https://gsai.kaist.ac.kr/academics" },
      },
      {
        title: "A city built for research",
        body: "Daedeok Innopolis concentrates academia, government research institutes and company labs in one place — 15% of Korea's research spending, 11% of its doctoral researchers, in the neighbourhood.",
        source: { label: "InvestKorea — Daejeon", url: "https://www.investkorea.org/ik-en/bbs/i-2486/detail.do?ntt_sn=482562" },
      },
    ],
  },

  studentLife: {
    title: "STUDENT LIFE",
    intro: "Not everything should be about me studying. The campus has a personality — I'd like to live inside it.",
    cards: [
      {
        title: "ICISTS — a student-run international conference",
        body: "KAIST's largest student organisation, founded in 2005 as a partner of Harvard's H-PAIR project, runs one of Asia's largest international student conferences — and even took a 'New York Hacker Fair' to NYU, mixing culture, technology and AI.",
        source: { label: "MK — ICISTS launches NY Hacker Fair planning group", url: "https://www.mk.co.kr/en/society/10937636" },
      },
      {
        title: "KISA — international students' community",
        body: "The KAIST International Students Association is one of the largest student organisations for internationals on campus, with divisions for events, promotion and more. A landing zone for a student arriving from India.",
        source: { label: "KISA", url: "https://www.facebook.com/KISA.KAIST" },
      },
      {
        title: "A campus where everyone lives together",
        body: "21 on-campus residences hold more than 7,600 students. When everyone lives on campus, ideas run into each other in corridors and cafeterias, not just in labs.",
        source: { label: "KAIST — More about KAIST", url: "https://www.kaist.ac.kr/en/html/kaist/01.html" },
      },
      {
        title: "Clubs, knot and all",
        body: "A whole Undergraduate Student Clubs Union manages club rooms, funds and festivals — a functioning student society underneath all the research.",
        source: { label: "KAIST Campus Life — Undergraduate Student Clubs", url: "https://www.kaist.ac.kr/en/html/campus/053302.html" },
      },
    ],
  },

  opportunities: {
    title: "OPPORTUNITIES",
    intro: "Where I'd actually go, join, try, or break something — each tied to what I do now.",
    cards: [
      {
        title: "Do research as a first-year or second-year undergrad",
        body: "URP runs twice a year (May and November recruitments for summer/fall and winter/spring), and the 'Creative Project' track lets me bring my own question. That's the single opportunity that makes me most nervous and most excited.",
        source: { label: "KAIST College of Engineering — URP", url: "https://engineering.kaist.ac.kr/content?menu=61" },
      },
      {
        title: "Hack badly, together",
        body: "Between ICISTS's hacker fairs and Daejeon's Creative Economy Innovation Center, there's a path from 'I have an idea' to 'we built it in a weekend' — the social version of my build loop.",
        source: { label: "MK — ICISTS NY Hacker Fair", url: "https://www.mk.co.kr/en/society/10937636" },
      },
      {
        title: "Borrow an AI professor's research time",
        body: "The GSAI's AI911 course exists so undergraduates can join ongoing ML/AI research. I'd rather be an intern who asks too many questions than wait for 'when I'm ready'.",
        source: { label: "KAIST Kim Jaechul GSAI — Academics", url: "https://gsai.kaist.ac.kr/academics" },
      },
      {
        title: "Learn the language (of people)",
        body: "KAIST runs a Korean Language Program for internationals (a full regular course open to anyone). And ~80%+ of courses are in English, so I can learn Korean without holding my degree hostage to it.",
        source: { label: "KAIST Admissions — Korean Language Program notice", url: "https://admission.kaist.ac.kr/intl-undergraduate/notice/notice" },
      },
    ],
  },

  noticed: {
    title: "THINGS I NOTICED",
    intro: "The parts of KAIST that a normal brochure skips — proof that I didn't just Google the name.",
    items: [
      {
        found: "Freshman year is intentionally structureless: undeclared major, no quotas, pick anything at the end of year one. KAIST's own admissions page says it in one line — 'there is no quota for each department/major.'",
        why: "I genuinely don't know yet whether I'll fall for AI systems, HCI or robotics. A system that expects me to explore before I commit is precisely the system I need.",
        source: { label: "KAIST Int'l Undergraduate Admissions — Eligibility", url: "https://admission.kaist.ac.kr/intl-undergraduate/before/sub02" },
      },
      {
        found: "The College of AI opened in spring 2026 — meaning the AI departments will be exactly one cycle old when I'd be choosing a major. I would be joining the second cohort of an experiment.",
        why: "I like being near the beginning of things. The bugs are still visible; the culture isn't set yet; there's room to help shape what it becomes.",
        source: { label: "The KAIST Herald — College of AI begins its first semester", url: "https://slv.herald.kaist.ac.kr/news/articleView.html?idxno=22207" },
      },
      {
        found: "The scholarship isn't a footnote: KAIST's own 2027 guide leads with 'Full Scholarship for International Students' — tuition plus living expenses plus health insurance, around KRW 11.8M a year.",
        why: "This is not a nice-to-have for me. It is the difference between an application and a plan. It tells me KAIST thinks about who international students actually are.",
        source: { label: "KAIST 2027 Undergraduate Admissions Guide", url: "https://admission.kaist.ac.kr/wz/api/common/files/view/intl-undergraduate/pdf/Admissions_Guide_for_2027_admission.pdf" },
      },
      {
        found: "URP has a 'Creative Project' track where the research topic is proposed by the student, not handed down by a lab.",
        why: "That is my exact learning pattern — I see something, get curious, propose my own version, break it, understand it. KAIST has institutionalised that loop.",
        source: { label: "KAIST College of Engineering — URP", url: "https://engineering.kaist.ac.kr/content?menu=61" },
      },
      {
        found: "The geese. There are geese that walk around campus, crossing paths with students — there is literally a 'geese walking' sign on the roads.",
        why: "A campus where geese rule the footpaths feels like a place that refuses to take itself too seriously. I'd want a campus with a personality.",
        source: { label: "Wikimedia Commons — Geese walking sign, KAIST", url: "https://commons.wikimedia.org/wiki/File:Geese_walking_sign,_KAIST.jpg" },
      },
    ],
  },

  deeper: {
    title: "I WENT A LITTLE DEEPER",
    intro: "Smaller, stranger, sourced findings.",
    items: [
      {
        found: "ICISTS was founded in 2005 as the Korean partner organisation for Harvard University's H-PAIR (Harvard Project for Asian and International Relations) — a student conference with a 20-year history and UNESCO Sustainable Development education recognition.",
        why: "A KAIST student organisation that keeps a relationship with a US university and a UN body is the kind of ambition I'd like to be around.",
        source: { label: "MK — ICISTS", url: "https://www.mk.co.kr/en/society/10937636" },
      },
      {
        found: "The Seoul campus hosts the Kim Jaechul Graduate School of AI, so studying at KAIST can mean studying across two cities — Daejeon for the main campus, Seoul for AI.",
        why: "Two-city student life sounds uncomfortable and brilliant. Access to Seoul's AI ecosystem plus Daejeon's lab density is a strange, rich combination.",
        source: { label: "KAIST Kim Jaechul GSAI — Academics", url: "https://gsai.kaist.ac.kr/academics" },
      },
      {
        found: "The Class 12 privilege I noticed: KAIST doesn't require international applicants to take Korean to graduate — courses are 80%+ English. But the university actively offers a Korean Language Program. The system leaves the choice to you.",
        why: "I would learn Korean voluntarily. Being able to live in a country's actual language feels like the difference between visiting and belonging.",
        source: { label: "Study in Korea — KAIST", url: "https://www.studyinkorea.go.kr/ko/search/universityInfo.do?tab=univ-basic-info&univCd=100406" },
      },
      {
        found: "KAIST's main site lists a 'Mazinger Tower' on campus. The university has a landmark named after a giant mecha cartoon. That's the kind of institutional personality I find seriously motivating.",
        why: "A campus that built a robot monument (and won DARPA with its actual robot) tells me the culture celebrates building — not just publishing.",
        source: { label: "KAIST — More about KAIST", url: "https://www.kaist.ac.kr/en/html/kaist/01.html" },
      },
    ],
  },

  archive: {
    title: "VISUAL ARCHIVE",
    intro: "Real photographs, mostly from Wikimedia Commons, each one chosen because it says something about the place — campus, night, research, life, and the city.",
    images: [
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/KAIST_campus_at_night.jpg/1280px-KAIST_campus_at_night.jpg", alt: "KAIST main campus at night", category: "CAMPUS", credit: "Wikimedia Commons", link: "https://commons.wikimedia.org/wiki/File:KAIST_campus_at_night.jpg" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/KAIST_fountains_view.jpg/1280px-KAIST_fountains_view.jpg", alt: "KAIST fountains and plaza", category: "CAMPUS", credit: "Wikimedia Commons", link: "https://commons.wikimedia.org/wiki/File:KAIST_fountains_view.jpg" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/KAIST%27s_campus_road.jpg/1280px-KAIST%27s_campus_road.jpg", alt: "A road through the KAIST campus", category: "CAMPUS", credit: "Wikimedia Commons", link: "https://commons.wikimedia.org/wiki/File:KAIST%27s_campus_road.jpg" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/KAIST%27s_sport_complex_at_night.jpg/1280px-KAIST%27s_sport_complex_at_night.jpg", alt: "KAIST sports complex at night", category: "STUDENT LIFE", credit: "Wikimedia Commons", link: "https://commons.wikimedia.org/wiki/File:KAIST%27s_sport_complex_at_night.jpg" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/School_of_Humanities_and_Social_Sciences%2C_KAIST.jpg/1280px-School_of_Humanities_and_Social_Sciences%2C_KAIST.jpg", alt: "School of Humanities and Social Sciences building", category: "ACADEMICS", credit: "Wikimedia Commons", link: "https://commons.wikimedia.org/wiki/File:School_of_Humanities_and_Social_Sciences,_KAIST.jpg" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/IBS%E2%80%93KAIST_Campus_Building.jpg/1280px-IBS%E2%80%93KAIST_Campus_Building.jpg", alt: "IBS–KAIST campus building", category: "RESEARCH", credit: "Wikimedia Commons", link: "https://commons.wikimedia.org/wiki/File:IBS%E2%80%93KAIST_Campus_Building.jpg" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/KAIST%27s_basketball_court.jpg/1280px-KAIST%27s_basketball_court.jpg", alt: "KAIST basketball court", category: "STUDENT LIFE", credit: "Wikimedia Commons", link: "https://commons.wikimedia.org/wiki/File:KAIST%27s_basketball_court.jpg" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Geese_walking_sign%2C_KAIST.jpg/1280px-Geese_walking_sign%2C_KAIST.jpg", alt: "'Geese walking' road sign on campus", category: "CAMPUS", credit: "Wikimedia Commons", link: "https://commons.wikimedia.org/wiki/File:Geese_walking_sign,_KAIST.jpg" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Library_at_KAIST_university.jpg/1280px-Library_at_KAIST_university.jpg", alt: "The library at KAIST", category: "ACADEMICS", credit: "Wikimedia Commons", link: "https://commons.wikimedia.org/wiki/File:Library_at_KAIST_university.jpg" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Daejeon_Government_Complex_-_panoramio_-_dokaspar.jpg/1280px-Daejeon_Government_Complex_-_panoramio_-_dokaspar.jpg", alt: "Daejeon — the city around the campus", category: "CITY", credit: "Wikimedia Commons", link: "https://commons.wikimedia.org/wiki/File:Daejeon_Government_Complex_-_panoramio_-_dokaspar.jpg" },
    ],
  },

  why: {
    bring: ["curiosity", "a building mindset", "visual / product thinking", "independent learning", "experimentation", "persistence"],
    develop: ["strong CS foundations", "deeper AI understanding", "systems thinking", "research ability", "technical independence", "collaboration"],
    reasons: [
      {
        feature: "Undeclared major year + no quota choice",
        interest: "I'm still deciding between AI, systems and HCI",
        meaning: "KAIST is one of the few universities where 'I don't know yet' is a first-class answer rather than a weakness.",
        source: { label: "KAIST Int'l Undergraduate Admissions — Eligibility", url: "https://admission.kaist.ac.kr/intl-undergraduate/before/sub02" },
      },
      {
        feature: "A College of AI starting precisely as I would arrive",
        interest: "AI is the thing I keep wanting to understand deeper",
        meaning: "I'd be near the birth of a programme instead of inheriting one — the same energy as my build loop in institutional form.",
        source: { label: "The KAIST Herald — College of AI", url: "https://slv.herald.kaist.ac.kr/news/articleView.html?idxno=22207" },
      },
      {
        feature: "URP's Creative Project track",
        interest: "My entire record is self-proposed experiments",
        meaning: "KAIST formally funds the thing I already do on my own — proposing an idea, breaking it, and understanding why.",
        source: { label: "KAIST College of Engineering — URP", url: "https://engineering.kaist.ac.kr/content?menu=61" },
      },
      {
        feature: "Full international scholarship covering tuition, living, insurance",
        interest: "My family can't fund an international degree",
        meaning: "KAIST's funding isn't a discount. It's ownership of the decision to admit international students like me.",
        source: { label: "KAIST 2027 Undergraduate Admissions Guide", url: "https://admission.kaist.ac.kr/wz/api/common/files/view/intl-undergraduate/pdf/Admissions_Guide_for_2027_admission.pdf" },
      },
      {
        feature: "80%+ English courses + Korean Language Program",
        interest: "English-medium study, plus the will to learn local language",
        meaning: "KAIST lets me start in the language I know and grow into the language I want.",
        source: { label: "KAIST IO — About", url: "https://io.kaist.ac.kr/about/glance.do" },
      },
    ],
  },

  roadmap: {
    title: "IF I WERE THERE",
    intro: "Not a rigid plan. A first-person sketch of how I'd spend the early years.",
    semesters: [
      {
        label: "SEMESTER 1",
        points: ["Learn the fundamentals properly — maths, programming, CS theory", "Meet people. Find the weird ones.", "Join a technical crew somewhere on campus", "Try AI properly for the first time in a classroom"],
      },
      {
        label: "SEMESTER 2",
        points: ["Choose an initial track without panic — I can still change", "Build something with other students", "Enter a hackathon and break things publicly", "Visit a lab I'm afraid of and ask a stupid question"],
      },
      {
        label: "YEAR 2 →",
        points: ["Apply for URP with my own Creative Project idea", "Figure out which questions actually keep me awake", "Start learning Korean for real", "Decide what 'reliable system' means to me by building one badly first"],
      },
    ],
  },

  finance: {
    note: {
      title: "Funding (without the flourish)",
      body: "The KAIST International Undergraduate Scholarship covers full tuition for eight semesters plus monthly living expenses and health insurance — the university itself frames it as full financial support for international students. For someone in my financial position this is not a perk; it determines whether studying at KAIST is possible at all.",
      source: { label: "KAIST 2027 Undergraduate Admissions Guide", url: "https://admission.kaist.ac.kr/wz/api/common/files/view/intl-undergraduate/pdf/Admissions_Guide_for_2027_admission.pdf" },
    },
    sources: [
      { label: "KAIST 2027 Undergraduate Admissions Guide", url: "https://admission.kaist.ac.kr/wz/api/common/files/view/intl-undergraduate/pdf/Admissions_Guide_for_2027_admission.pdf" },
      { label: "KAIST Quick Facts — Scholarship for International Students", url: "https://k-connect.kaist.ac.kr/nation_det/quick_facts" },
    ],
  },

  language: {
    title: "A note about English",
    body: "I can read, write and communicate in English — this entire site is written in it. I currently can't afford an expensive proficiency test like IELTS or TOEFL. If KAIST requires formal proof, I'm glad to demonstrate my English through another accepted method where one exists — and the Korean Language Program is something I'd join voluntarily, not reluctantly.",
    source: { label: "KAIST Admissions — Korean Language Program notice", url: "https://admission.kaist.ac.kr/intl-undergraduate/notice/notice" },
  },

  sources: [
    { label: "KAIST — More about KAIST (stats, founders, dorms, Mazinger Tower)", url: "https://www.kaist.ac.kr/en/html/kaist/01.html" },
    { label: "KAIST IO — About / Glance (history, English courses, students)", url: "https://io.kaist.ac.kr/about/glance.do" },
    { label: "KAIST International Undergraduate Admissions", url: "https://admission.kaist.ac.kr/intl-undergraduate" },
    { label: "KAIST Admissions 2027 — Eligibility (undeclared major, no quota)", url: "https://admission.kaist.ac.kr/intl-undergraduate/before/sub02" },
    { label: "KAIST Undergraduate Admissions Guide for 2027 (PDF)", url: "https://admission.kaist.ac.kr/wz/api/common/files/view/intl-undergraduate/pdf/Admissions_Guide_for_2027_admission.pdf" },
    { label: "KAIST Quick Facts — International Scholarship", url: "https://k-connect.kaist.ac.kr/nation_det/quick_facts" },
    { label: "KAIST College of Engineering — Undergraduate Research Participation (URP)", url: "https://engineering.kaist.ac.kr/content?menu=61" },
    { label: "KAIST School of Computing — Undergraduate curriculum", url: "https://cs.kaist.ac.kr/education/undergraduate" },
    { label: "KAIST Kim Jaechul Graduate School of AI — Academics", url: "https://gsai.kaist.ac.kr/academics" },
    { label: "The KAIST Herald — College of AI begins its first semester", url: "https://slv.herald.kaist.ac.kr/news/articleView.html?idxno=22207" },
    { label: "DongA Science — KAIST to launch dedicated College of AI", url: "https://www.dongascience.com/en/news/75513" },
    { label: "KAIST News — DRC-HUBO wins the DARPA Robotics Challenge 2015", url: "https://www.kaist.ac.kr/newsen/html/news?mng_no=4379&mode=V" },
    { label: "InvestKorea — Daejeon: City of Science (Daedeok Innopolis)", url: "https://www.investkorea.org/ik-en/bbs/i-2486/detail.do?ntt_sn=482562" },
    { label: "MK — ICISTS, KAIST's largest student organisation", url: "https://www.mk.co.kr/en/society/10937636" },
    { label: "ICISTS — official site", url: "https://www.icists.org/" },
    { label: "KAIST Campus Life — Undergraduate Student Clubs", url: "https://www.kaist.ac.kr/en/html/campus/053302.html" },
    { label: "KAIST International Students Association (KISA)", url: "https://www.facebook.com/KISA.KAIST" },
    { label: "Study in Korea (official) — KAIST university information", url: "https://www.studyinkorea.go.kr/ko/search/universityInfo.do?tab=univ-basic-info&univCd=100406" },
  ],
};
export interface SourceRef {
  label: string;
  url: string;
}

export interface UniStat {
  label: string;
  value: string;
  note?: string;
  source?: SourceRef;
}

export interface UniCard {
  title: string;
  body: string;
  source?: SourceRef;
}

export interface UniNoticed {
  found: string;
  why: string;
  source?: SourceRef;
}

export interface UniImage {
  src: string;
  alt: string;
  category: string;
  /** Wikimedia Commons / official source credit */
  credit: string;
  link?: string;
}

export interface UniWhyReason {
  feature: string;
  interest: string;
  meaning: string;
  source?: SourceRef;
}

export interface UniversityConfig {
  slug: string;

  // identity
  name: string;
  fullName: string;
  country: string;
  city: string;
  founded: string;
  officialSite: string;
  admissionsSite: string;
  identityLine: string;

  // visual skin for the mini-portal
  colors: {
    base: string;
    accent: string;
    accent2: string;
    accentText: string;
  };
  heroImage?: UniImage;

  // shared content blocks
  intro: string[];
  stats: UniStat[];
  facts: UniCard[];

  academics: {
    title: string;
    intro: string;
    cards: UniCard[];
  };

  research: {
    title: string;
    intro: string;
    cards: UniCard[];
  };

  studentLife: {
    title: string;
    intro: string;
    cards: UniCard[];
  };

  opportunities: {
    title: string;
    intro: string;
    cards: UniCard[];
  };

  noticed: {
    title: string;
    intro: string;
    items: UniNoticed[];
  };

  deeper: {
    title: string;
    intro: string;
    items: UniNoticed[];
  };

  archive: {
    title: string;
    intro: string;
    images: UniImage[];
  };

  why: {
    bring: string[];
    develop: string[];
    reasons: UniWhyReason[];
  };

  roadmap: {
    title: string;
    intro: string;
    semesters: { label: string; points: string[] }[];
  };

  finance: {
    note: UniCard;
    sources: SourceRef[];
  };

  language: UniCard;

  sources: SourceRef[];
}
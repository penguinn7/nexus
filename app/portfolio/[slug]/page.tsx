import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUniversity, listUniversitySlugs } from "@/data/university/registry";
import { UniShell } from "@/components/university/shell";
import { HomeSection } from "@/components/university/home";
import {
  AcademicsSection,
  ResearchSection,
  LifeSection,
  OpportunitiesSection,
  NoticedSection,
  DeeperSection,
  WhySection,
  RoadmapSection,
  ArchiveSection,
  MoneySection,
} from "@/components/university/sections";

export const dynamicParams = false;

export function generateStaticParams() {
  return listUniversitySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const config = getUniversity(params.slug);
  if (!config) return { title: "Not found" };
  return {
    title: `${config.name} — researched, for Sonakshi`,
    description: `${config.name}: a fully sourced, researched look at why I'm applying. Every claim on this page carries its source.`,
  };
}

export default function UniversityPage({ params }: { params: { slug: string } }) {
  const config = getUniversity(params.slug);
  if (!config) notFound();

  return (
    <UniShell config={config}>
      <HomeSection config={config} />
      <AcademicsSection config={config} />
      <ResearchSection config={config} />
      <LifeSection config={config} />
      <OpportunitiesSection config={config} />
      <NoticedSection config={config} />
      <DeeperSection config={config} />
      <WhySection config={config} />
      <RoadmapSection config={config} />
      <ArchiveSection config={config} />
      <MoneySection config={config} />
    </UniShell>
  );
}
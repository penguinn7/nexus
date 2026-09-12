import { Hero } from "@/components/portfolio/hero";
import { PortfolioNav } from "@/components/portfolio/nav";
import { About } from "@/components/portfolio/about";
import { Learning } from "@/components/portfolio/learning";
import { Academics } from "@/components/portfolio/academics";
import { TheQuestion } from "@/components/portfolio/question";
import { Projects } from "@/components/portfolio/projects";
import { Autopsies } from "@/components/portfolio/autopsies";
import { Aime } from "@/components/portfolio/aime";
import { Collaboration } from "@/components/portfolio/collaboration";
import { Github } from "@/components/portfolio/github";
import { Practical } from "@/components/portfolio/practical";
import { Kit } from "@/components/portfolio/kit";
import { Finale } from "@/components/portfolio/finale";
import { fetchGithubRepos } from "@/lib/github";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const github = await fetchGithubRepos();

  return (
    <>
      <PortfolioNav />
      <Hero />
      <About />
      <Learning />
      <Academics />
      <TheQuestion />
      <Projects />
      <Autopsies />
      <Aime />
      <Collaboration />
      <Github data={github} />
      <Practical />
      <Kit />
      <Finale />
    </>
  );
}
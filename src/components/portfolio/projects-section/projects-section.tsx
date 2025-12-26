"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import { ProjectCard } from "@/components/portfolio/projects-section/project-card";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";

interface ProjectLink {
  readonly icon: React.ReactNode;
  readonly type: string;
  readonly href: string;
}

interface ProjectItem {
  readonly title: string;
  readonly href?: string;
  readonly dates: string;
  readonly active: boolean;
  readonly description: string;
  readonly technologies: readonly string[];
  readonly authors?: string;
  readonly links?: readonly ProjectLink[];
  readonly image?: string;
  readonly video?: string;
}

interface ProjectsSectionProps {
  projects: readonly ProjectItem[];
  delay?: number;
}

const DEFAULT_DISPLAY_COUNT = 6;
const BLUR_FADE_DELAY = 0.05;

export default function ProjectsSection({
  projects,
  delay = 0,
}: ProjectsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayed = showAll
    ? projects
    : projects.slice(0, DEFAULT_DISPLAY_COUNT);
  const hasMore = projects.length > DEFAULT_DISPLAY_COUNT;

  if (!mounted) {
    return (
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projects.slice(0, DEFAULT_DISPLAY_COUNT).map((project, id) => (
          <BlurFade key={project.title} delay={delay + id * BLUR_FADE_DELAY}>
            <ProjectCard
              href={project.href}
              title={project.title}
              description={project.description}
              dates={project.dates}
              tags={project.technologies}
              image={project.image}
              video={project.video}
              links={project.links}
              authors={project.authors}
            />
          </BlurFade>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {displayed.map((project, id) => (
        <BlurFade key={project.title} delay={id * BLUR_FADE_DELAY}>
          <ProjectCard
            href={project.href}
            title={project.title}
            description={project.description}
            dates={project.dates}
            tags={project.technologies}
            image={project.image}
            video={project.video}
            links={project.links}
            authors={project.authors}
          />
        </BlurFade>
      ))}
      {hasMore && !showAll && (
        <BlurFade className="col-span-full" delay={delay + BLUR_FADE_DELAY * 6}>
          <div className="flex justify-center pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(true)}
              className="flex items-center gap-2"
            >
              <ChevronDown className="h-4 w-4" />
              Show All
            </Button>
          </div>
        </BlurFade>
      )}
    </div>
  );
}

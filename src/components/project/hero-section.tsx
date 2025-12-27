import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import PlatformDownloadButton from "@/components/project/platform-download-button";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";

type HeroSectionProps = {
  projectName: string;
  slogan: string;
  description: string;
  logo: string;
  androidUrl: string;
  iosUrl: string;
  windowsUrl: string;
  linuxUrl: string;
  githubUrl?: string;
  delay?: number;
  dict: {
    downloadButton: string;
    moreDownloads: string;
    viewOnGithub?: string;
  };
};

export default function HeroSection({
  projectName,
  slogan,
  description,
  logo,
  androidUrl,
  iosUrl,
  windowsUrl,
  linuxUrl,
  githubUrl,
  delay = 0,
  dict,
}: HeroSectionProps) {
  return (
    <section id="hero" className="mt-16 sm:mt-28">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
        {/* Left: Project Info */}
        <div className="relative z-10 space-y-6">
          <BlurFade delay={delay}>
            <div className="mb-2 flex items-center gap-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {projectName}
              </h1>
              {/* Logo on mobile - right side */}
              <div className="md:hidden">
                <Image
                  src={logo}
                  alt={`${projectName} Logo`}
                  width={64}
                  height={64}
                  className="rounded-2xl object-contain"
                  priority
                />
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={delay + 0.1}>
            <p className="text-muted-foreground text-xl sm:text-2xl">
              {slogan}
            </p>
          </BlurFade>

          <BlurFade delay={delay + 0.2}>
            <p className="text-muted-foreground text-base sm:text-lg">
              {description}
            </p>
          </BlurFade>

          <BlurFade delay={delay + 0.3}>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <PlatformDownloadButton
                dict={dict}
                androidUrl={androidUrl}
                iosUrl={iosUrl}
                windowsUrl={windowsUrl}
                linuxUrl={linuxUrl}
              />

              {githubUrl && (
                <Button asChild variant="outline" size="lg">
                  <Link
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 size-5" />
                    {dict.viewOnGithub || "GitHub"}
                  </Link>
                </Button>
              )}
            </div>
          </BlurFade>
        </div>

        {/* Right: Logo - Desktop only */}
        <BlurFade delay={delay + 0.2}>
          <div className="relative z-0 hidden items-center justify-center md:flex">
            <div className="relative aspect-square w-full max-w-md">
              <Image
                src={logo}
                alt={`${projectName} Logo`}
                fill
                className="rounded-3xl object-contain"
                priority
              />
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}

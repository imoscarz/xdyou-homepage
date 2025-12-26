import Image from "next/image";
import Link from "next/link";

import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";

type HeroSectionProps = {
  projectName: string;
  slogan: string;
  description: string;
  logo: string;
  primaryDownloadUrl: string;
  delay?: number;
  dict: {
    downloadButton: string;
    moreDownloads: string;
  };
};

export default function HeroSection({
  projectName,
  slogan,
  description,
  logo,
  primaryDownloadUrl,
  delay = 0,
  dict,
}: HeroSectionProps) {
  return (
    <section id="hero" className="mt-16 sm:mt-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
        {/* Left: Project Info */}
        <div className="space-y-6">
          <BlurFade delay={delay}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {projectName}
            </h1>
          </BlurFade>
          
          <BlurFade delay={delay + 0.1}>
            <p className="text-xl text-muted-foreground sm:text-2xl">
              {slogan}
            </p>
          </BlurFade>
          
          <BlurFade delay={delay + 0.2}>
            <p className="text-base text-muted-foreground sm:text-lg">
              {description}
            </p>
          </BlurFade>
          
          <BlurFade delay={delay + 0.3}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="text-base font-semibold"
              >
                <Link href={primaryDownloadUrl}>
                  {dict.downloadButton}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base font-semibold"
              >
                <Link href="#downloads">
                  {dict.moreDownloads}
                </Link>
              </Button>
            </div>
          </BlurFade>
        </div>
        
        {/* Right: Logo */}
        <BlurFade delay={delay + 0.2}>
          <div className="flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-md">
              <Image
                src={logo}
                alt={`${projectName} Logo`}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}

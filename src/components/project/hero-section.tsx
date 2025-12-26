import Image from "next/image";

import PlatformDownloadButton from "@/components/project/platform-download-button";
import { BlurFade } from "@/components/ui/blur-fade";

type HeroSectionProps = {
  projectName: string;
  slogan: string;
  description: string;
  logo: string;
  androidUrl: string;
  iosUrl: string;
  windowsUrl: string;
  linuxUrl: string;
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
  androidUrl,
  iosUrl,
  windowsUrl,
  linuxUrl,
  delay = 0,
  dict,
}: HeroSectionProps) {
  return (
    <section id="hero" className="mt-16 sm:mt-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
        {/* Left: Project Info */}
        <div className="space-y-6">
          <BlurFade delay={delay}>
            <div className="flex items-center gap-4">
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
            <PlatformDownloadButton
              dict={dict}
              androidUrl={androidUrl}
              iosUrl={iosUrl}
              windowsUrl={windowsUrl}
              linuxUrl={linuxUrl}
            />
          </BlurFade>
        </div>
        
        {/* Right: Logo - Desktop only */}
        <BlurFade delay={delay + 0.2}>
          <div className="hidden items-center justify-center md:flex">
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

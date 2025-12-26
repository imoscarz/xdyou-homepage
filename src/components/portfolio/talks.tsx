import { ResumeCard } from "@/components/portfolio/resume-card";
import { BlurFade } from "@/components/ui/blur-fade";

interface Talk {
  host: string;
  title: string;
  date: string;
  url?: string;
  logoUrl?: string;
}

interface TalksProps {
  talks: readonly Talk[];
  delay?: number;
}

export default function Talks({ talks, delay = 0 }: TalksProps) {
  return (
    <div className="flex min-h-0 flex-col gap-y-3">
      {talks
        .slice()
        .reverse()
        .map((talk, index) => (
          <BlurFade key={talk.host + talk.date} delay={delay + index * 0.05}>
            <ResumeCard
              href={talk.url}
              logoUrl={talk.logoUrl || ""}
              altText={talk.host}
              title={talk.host}
              subtitle={talk.title}
              period={talk.date}
              useMarkdown={true}
            />
          </BlurFade>
        ))}
    </div>
  );
}

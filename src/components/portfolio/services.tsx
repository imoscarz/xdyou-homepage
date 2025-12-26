import { Badge } from "@/components/ui/badge";

interface ServicesProps {
  reviewerConferences: readonly string[];
  reviewerJournals: readonly string[];
  teaching: readonly {
    date: string;
    title: string;
    location: string;
  }[];
}

export default function Services({
  reviewerConferences,
  reviewerJournals,
  teaching,
}: ServicesProps) {
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-sm">
          Reviewer of Conferences:
        </span>
        {reviewerConferences.map((venue) => (
          <Badge key={venue}>{venue}</Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-sm">
          Reviewer of Journals:
        </span>
        {reviewerJournals.map((venue) => (
          <Badge key={venue}>{venue}</Badge>
        ))}
      </div>
      <div className="flex flex-col gap-y-2">
        <span className="text-muted-foreground text-sm">
          Teaching Assistant:
        </span>
        <div className="space-y-0.5">
          {teaching.map((teaching) => (
            <div
              key={teaching.date + teaching.title}
              className="hover:bg-accent/50 rounded-md px-3 py-1 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-muted-foreground mt-0.5 text-xs font-medium whitespace-nowrap">
                  {teaching.date}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-0.5 text-sm leading-tight font-semibold">
                    {teaching.title}
                  </h3>
                  <div className="text-muted-foreground text-xs leading-relaxed">
                    {teaching.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

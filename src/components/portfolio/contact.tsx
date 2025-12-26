import Link from "next/link";

interface ContactProps {
  emailUrl: string;
  calendlyUrl: string;
}

export default function Contact({ emailUrl, calendlyUrl }: ContactProps) {
  return (
    <div className="space-y-3">
      <div className="bg-foreground text-background inline-block rounded-lg px-3 py-1 text-sm">
        Contact
      </div>
      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
        Get in Touch
      </h2>
      <div className="mx-auto max-w-[600px] space-y-6">
        <p className="text-muted-foreground text-center text-lg leading-relaxed md:text-xl">
          Want to chat? Feel free to reach out{" "}
          <Link
            href={emailUrl}
            className="inline-flex items-center gap-1 text-blue-500 underline transition-colors hover:text-blue-600 hover:no-underline"
          >
            via email
          </Link>{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </p>

        <div className="flex flex-col items-center space-y-4">
          <ul className="text-muted-foreground grid gap-3 text-center text-lg leading-relaxed md:text-xl">
            <li className="hover:text-foreground transition-colors">
              • Ask questions
            </li>
            <li className="hover:text-foreground transition-colors">
              • Explore collaboration opportunities
            </li>
            <li className="hover:text-foreground transition-colors">
              • 15-minute coffee chat (
              <Link
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline transition-colors hover:text-blue-600 hover:no-underline"
              >
                Schedule
              </Link>
              )
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

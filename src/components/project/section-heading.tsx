export default function SectionHeading({
  id,
  label,
  title,
  description,
}: {
  id: string;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="space-y-4 text-left">
      <p className="text-muted-foreground flex items-center gap-3 text-xs font-medium tracking-wider">
        <span aria-hidden="true" className="bg-border h-px w-8" />
        {label}
      </p>
      <h2
        id={id}
        className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl"
      >
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground max-w-xl text-sm leading-7 sm:text-base">
          {description}
        </p>
      )}
    </header>
  );
}

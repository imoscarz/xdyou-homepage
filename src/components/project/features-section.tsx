import { Icons } from "@/components/icons";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Feature = {
  icon: keyof typeof Icons;
  title: string;
  description: string;
};

type FeaturesSectionProps = {
  features: Feature[];
  delay?: number;
  dict: {
    title: string;
    badge: string;
  };
};

export default function FeaturesSection({
  features,
  delay = 0,
  dict,
}: FeaturesSectionProps) {
  return (
    <section id="functions" className="py-12">
      <div className="mx-auto w-full space-y-8">
        <BlurFade delay={delay}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="bg-foreground text-background inline-block rounded-lg px-3 py-1 text-sm">
                {dict.badge}
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                {dict.title}
              </h2>
            </div>
          </div>
        </BlurFade>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = Icons[feature.icon];
            return (
              <BlurFade key={feature.title} delay={delay + 0.1 + idx * 0.05}>
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                      <div className="bg-primary/10 flex size-12 shrink-0 items-center justify-center rounded-lg">
                        <Icon className="text-primary size-6" />
                      </div>
                      <CardTitle className="text-center sm:text-left">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center leading-relaxed sm:text-left">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}

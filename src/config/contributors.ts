import overridesData from "@/config/contributor-overrides.json";
import snapshot from "@/generated/contributors.json";
import type { Locale } from "@/lib/i18n/config";

export type Contributor = {
  id: string;
  name: string;
  avatar: string;
  subtitle: string[];
  profile?: string;
  links: { icon: string; text: string; url: string }[];
};
const overrides: Record<
  string,
  { profile?: string; links?: Contributor["links"] }
> = overridesData;
export function getContributors(locale: Locale): Contributor[] {
  return snapshot.contributors.map((person) => {
    const extra = overrides[person.id];
    const github = person.url.startsWith("https://github.com/");
    const mail = person.url.startsWith("mailto:");
    const avatar = new URL(person.avatar);
    if (avatar.hostname === "avatars.githubusercontent.com")
      avatar.searchParams.set("s", "128");
    return {
      id: person.id,
      name: person.name,
      avatar: avatar.toString(),
      subtitle: [person.description[locale]],
      profile: extra?.profile,
      links: [
        {
          icon: github ? "github" : mail ? "mail" : "home",
          text: github
            ? "GitHub"
            : mail
              ? locale === "zh"
                ? "邮件"
                : "Email"
              : locale === "zh"
                ? "个人主页"
                : "Website",
          url: person.url,
        },
        ...(extra?.links || []),
      ],
    };
  });
}

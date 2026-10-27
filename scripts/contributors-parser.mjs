import { parse } from "yaml";

// Accept literal fields and simple Slang translation references; never run Dart.
// Upstream syntax changes must fail visibly rather than silently drop people.
export function parseDevelopers(source, descriptionKeys = []) {
  const header = /(?:const|final)\s+List<Developer>\s+getDevelopers\s*=\s*\[/g;
  const match = header.exec(source);
  if (!match) throw new Error("Missing getDevelopers list");
  const tokens =
    source
      .slice(header.lastIndex)
      .match(
        /\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[A-Za-z_]\w*|[^\s]/g,
      ) || [];
  let i = 0;
  const peek = () => {
    while (tokens[i]?.startsWith("//") || tokens[i]?.startsWith("/*")) i++;
    return tokens[i];
  };
  const next = () => {
    const token = peek();
    i++;
    return token;
  };
  const expect = (value) => {
    if (next() !== value)
      throw new Error(`Unexpected Dart syntax; expected ${value}`);
  };
  const literal = () => {
    const token = next();
    if (!token || !/^['"]/.test(token) || /(?<!\\)\$/.test(token))
      throw new Error("Expected a literal Dart string");
    return token
      .slice(1, -1)
      .replace(/\\(u[0-9a-fA-F]{4}|[\\'"nrt$])/g, (_, c) =>
        c.startsWith("u")
          ? String.fromCharCode(parseInt(c.slice(1), 16))
          : ({ n: "\n", r: "\r", t: "\t" }[c] ?? c),
      );
  };
  const description = () => {
    if (/^['"]/.test(peek() ?? "")) return literal();
    expect("(");
    const parameter = next();
    if (!/^[A-Za-z_]\w*$/.test(parameter ?? ""))
      throw new Error("Expected a translation parameter");
    expect(")");
    expect("=");
    expect(">");
    expect(parameter);
    expect(".");
    expect("setting");
    expect(".");
    expect("aboutPage");
    expect(".");
    const member = next();
    // Slang camel-cases YAML keys. Resolve against the source keys so legacy
    // identities (including hyphens and underscores) keep their site overrides.
    const matches = descriptionKeys.filter(
      (key) =>
        key.replace(/[-_]([A-Za-z0-9])/g, (_, char) => char.toUpperCase()) ===
        member,
    );
    if (!matches.length)
      throw new Error(
        `Missing Chinese description: setting.aboutPage.${member}`,
      );
    if (matches.length !== 1)
      throw new Error(`Ambiguous translation key: setting.aboutPage.${member}`);
    return `setting.about_page.${matches[0]}`;
  };
  const people = [];
  for (;;) {
    const token = next();
    if (token === "]") break;
    if (token !== "Developer") throw new Error("Unsupported Developer entry");
    expect("(");
    const name = literal();
    expect(",");
    const avatar = literal();
    expect(",");
    const key = description();
    expect(",");
    const url = literal();
    const end = next();
    if (end === ",") expect(")");
    else if (end !== ")") throw new Error("Invalid Developer arguments");
    expect(",");
    if (!key.startsWith("setting.about_page."))
      throw new Error("Invalid description key");
    if (
      !name.trim() ||
      !/^https:\/\//.test(avatar) ||
      !/^(https:\/\/|mailto:)/.test(url)
    )
      throw new Error("Invalid contributor fields");
    if (people.some((p) => p.id === key))
      throw new Error(`Duplicate contributor ${key}`);
    people.push({ id: key, name, avatar, url });
  }
  if (!people.length) throw new Error("Empty contributor list");
  return people;
}

export function createSnapshot(dart, zhText, enText, revision) {
  if (!/^[a-f0-9]{40}$/.test(revision))
    throw new Error("Invalid source revision");
  const zh = parse(zhText)?.about_page;
  const en = parse(enText)?.about_page;
  const contributors = parseDevelopers(dart, Object.keys(zh ?? {})).map(
    (person) => {
      const key = person.id.slice("setting.about_page.".length);
      const chinese = zh?.[key];
      const english = en?.[key];
      if (typeof chinese !== "string" || !chinese.trim())
        throw new Error(`Missing Chinese description: ${person.id}`);
      return {
        ...person,
        description: {
          zh: chinese,
          en: typeof english === "string" && english.trim() ? english : chinese,
        },
      };
    },
  );
  return {
    source: {
      repository: "BenderBlog/traintime_pda",
      revision,
      license: "MPL-2.0",
      files: [
        "lib/model/about_page.dart",
        "assets/i18n/zh/setting.yaml",
        "assets/i18n/en/setting.yaml",
      ],
    },
    contributors,
  };
}

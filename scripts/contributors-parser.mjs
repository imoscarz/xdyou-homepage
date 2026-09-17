import { parse } from "yaml";

// A deliberately restricted parser: accept literal Developer entries only.
// Upstream syntax changes must fail visibly rather than silently drop people.
export function parseDevelopers(source) {
  const header = /const\s+List<Developer>\s+getDevelopers\s*=\s*\[/g;
  const match = header.exec(source);
  if (!match) throw new Error("Missing getDevelopers list");
  const tokens =
    source
      .slice(header.lastIndex)
      .match(
        /\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[A-Za-z_]\w*|[^\s]/g,
      ) || [];
  let i = 0;
  const next = () => {
    while (tokens[i]?.startsWith("//") || tokens[i]?.startsWith("/*")) i++;
    return tokens[i++];
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
    const key = literal();
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
  const zh = parse(zhText);
  const en = parse(enText);
  const get = (dict, key) =>
    key.split(".").reduce((value, part) => value?.[part], dict);
  const contributors = parseDevelopers(dart).map((person) => {
    const chinese = get(zh, person.id);
    const english = get(en, person.id);
    if (typeof chinese !== "string" || !chinese.trim())
      throw new Error(`Missing Chinese description: ${person.id}`);
    return {
      ...person,
      description: {
        zh: chinese,
        en: typeof english === "string" && english.trim() ? english : chinese,
      },
    };
  });
  return {
    source: {
      repository: "BenderBlog/traintime_pda",
      revision,
      license: "MPL-2.0",
      files: [
        "lib/model/about_page.dart",
        "assets/flutter_i18n/zh_CN.yaml",
        "assets/flutter_i18n/en_US.yaml",
      ],
    },
    contributors,
  };
}

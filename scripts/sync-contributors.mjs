import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { createSnapshot } from "./contributors-parser.mjs";

const root = new URL("../", import.meta.url);
async function request(url, authenticated = false) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(20000),
    headers:
      authenticated && process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {},
  });
  if (!response.ok)
    throw new Error(`Upstream request failed: ${response.status} ${url}`);
  return response;
}
const commit = await (
  await request(
    "https://api.github.com/repos/BenderBlog/traintime_pda/commits/main",
    true,
  )
).json();
if (!/^[a-f0-9]{40}$/.test(commit.sha))
  throw new Error("Invalid upstream commit");
const base = `https://raw.githubusercontent.com/BenderBlog/traintime_pda/${commit.sha}/`;
const files = await Promise.all(
  [
    "lib/model/about_page.dart",
    "assets/flutter_i18n/zh_CN.yaml",
    "assets/flutter_i18n/en_US.yaml",
  ].map(async (path) => (await request(base + path)).text()),
);
const snapshot = createSnapshot(...files, commit.sha);
const destination = new URL("src/generated/contributors.json", root);
let previous;
try {
  previous = JSON.parse(await readFile(destination, "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
if (
  JSON.stringify(previous?.contributors) ===
  JSON.stringify(snapshot.contributors)
) {
  console.log("Contributor snapshot unchanged.");
} else {
  await mkdir(new URL("src/generated/", root), { recursive: true });
  const temporary = fileURLToPath(destination) + ".tmp";
  await writeFile(temporary, JSON.stringify(snapshot, null, 2) + "\n");
  await rename(temporary, destination);
  console.log(
    `Synced ${snapshot.contributors.length} contributors at ${commit.sha}`,
  );
}

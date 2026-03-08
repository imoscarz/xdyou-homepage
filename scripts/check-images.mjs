#!/usr/bin/env node

/**
 * 检查 Markdown 文件和配置文件中的图片引用。
 *
 * 检查范围：
 * - contents/ 目录下的 Markdown 文件
 * - src/config/contributors.ts 中的贡献者头像
 * - src/config/project.ts 中的截图配置
 *
 * 检查内容：
 * - 外部图片域名是否在 next.config.ts 的 remotePatterns 中声明
 * - 本地图片路径格式是否正确（例如避免使用 img/...，应使用 /img/...）
 * - 本地图片文件是否实际存在于 public/ 目录
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { dirname, extname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const publicDir = join(projectRoot, 'public');

const nextConfigPath = join(projectRoot, 'next.config.ts');
const nextConfigContent = readFileSync(nextConfigPath, 'utf-8');

// 提取 remotePatterns 中的 hostname
const allowedHostnames = [];
const hostnameMatches = nextConfigContent.matchAll(/hostname:\s*["']([^"']+)["']/g);
for (const match of hostnameMatches) {
  allowedHostnames.push(match[1]);
}

console.log('允许的外部图片域名：', allowedHostnames);

const imageExtractors = [
  {
    kind: 'markdown',
    regex: /!\[[^\]]*\]\(([^)]+)\)/g,
    getUrl: (match) => normalizeMarkdownTarget(match[1]),
  },
  {
    kind: 'html',
    regex: /<img[^>]+src=["']([^"']+)["']/g,
    getUrl: (match) => match[1]?.trim() ?? '',
  },
];

function normalizeMarkdownTarget(target) {
  const trimmed = target.trim();

  // 处理 ![](<url>) 语法
  if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
    return trimmed.slice(1, -1).trim();
  }

  // 处理 ![](url "title")，只保留 url 部分
  const splitIndex = trimmed.search(/\s+["']/);
  if (splitIndex >= 0) {
    return trimmed.slice(0, splitIndex).trim();
  }

  return trimmed;
}

function findMarkdownFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (extname(file).toLowerCase() === '.md') {
      fileList.push(filePath);
    }
  }

  return fileList;
}

function isExternalUrl(url) {
  return url.startsWith('http://') || url.startsWith('https://');
}

function isIgnorableUrl(url) {
  return (
    !url ||
    url.startsWith('#') ||
    url.startsWith('data:') ||
    url.startsWith('mailto:') ||
    url.startsWith('tel:') ||
    url.startsWith('javascript:')
  );
}

function extractHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function getLineNumber(content, index) {
  return content.slice(0, index).split('\n').length;
}

function stripQueryAndHash(url) {
  return url.split('#')[0].split('?')[0];
}

function validateImageUrl({ sourcePath, sourceContent, url, matchIndex }) {
  const issues = [];
  const line = getLineNumber(sourceContent, matchIndex);

  if (isIgnorableUrl(url)) {
    return issues;
  }

  if (isExternalUrl(url)) {
    const hostname = extractHostname(url);
    if (hostname && !allowedHostnames.includes(hostname)) {
      issues.push({
        type: 'external-hostname',
        file: sourcePath,
        line,
        url,
        detail: `${hostname} (未在 next.config.ts 中声明)`,
      });
    }
    return issues;
  }

  // 避免使用 img/... 这类无前导 / 的路径。
  if (url.startsWith('img/')) {
    issues.push({
      type: 'local-path-format',
      file: sourcePath,
      line,
      url,
      detail: `本地图片路径应以 / 开头，建议改为 /${url}`,
    });
    return issues;
  }

  // 本项目约定本地静态资源使用 public 根路径绝对引用，例如 /img/xx.png
  if (!url.startsWith('/')) {
    issues.push({
      type: 'local-path-format',
      file: sourcePath,
      line,
      url,
      detail: '本地图片路径应以 / 开头并指向 public/ 下文件，例如 /img/example.png',
    });
    return issues;
  }

  const cleanUrl = stripQueryAndHash(url);
  const expectedFilePath = join(publicDir, cleanUrl.replace(/^\/+/, ''));

  if (!existsSync(expectedFilePath)) {
    issues.push({
      type: 'local-file-missing',
      file: sourcePath,
      line,
      url,
      detail: `文件不存在: ${expectedFilePath}`,
    });
  }

  return issues;
}

function checkMarkdownFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const issues = [];

  for (const extractor of imageExtractors) {
    const matches = content.matchAll(extractor.regex);

    for (const match of matches) {
      const url = extractor.getUrl(match);
      issues.push(
        ...validateImageUrl({
          sourcePath: filePath,
          sourceContent: content,
          url,
          matchIndex: match.index ?? 0,
        }),
      );
    }
  }

  return issues;
}

function checkConfigImageField(configPath, fieldPattern) {
  const content = readFileSync(configPath, 'utf-8');
  const issues = [];
  const matches = content.matchAll(fieldPattern);

  for (const match of matches) {
    const url = match[1]?.trim() ?? '';
    issues.push(
      ...validateImageUrl({
        sourcePath: configPath,
        sourceContent: content,
        url,
        matchIndex: match.index ?? 0,
      }),
    );
  }

  return issues;
}

function main() {
  const contentsDir = join(projectRoot, 'contents');
  const markdownFiles = findMarkdownFiles(contentsDir);

  console.log(`\n检查 ${markdownFiles.length} 个 Markdown 文件...\n`);

  let allIssues = [];

  for (const file of markdownFiles) {
    allIssues = allIssues.concat(checkMarkdownFile(file));
  }

  console.log('检查贡献者头像...\n');
  const contributorsConfigPath = join(projectRoot, 'src', 'config', 'contributors.ts');
  allIssues = allIssues.concat(
    checkConfigImageField(contributorsConfigPath, /avatar:\s*["']([^"']+)["']/g),
  );

  console.log('检查项目截图配置...\n');
  const projectConfigPath = join(projectRoot, 'src', 'config', 'project.ts');
  allIssues = allIssues.concat(checkConfigImageField(projectConfigPath, /src:\s*["']([^"']+)["']/g));

  if (allIssues.length > 0) {
    console.error('❌ 发现图片引用问题：\n');

    for (const issue of allIssues) {
      console.error(`类型: ${issue.type}`);
      console.error(`文件: ${issue.file}`);
      console.error(`行号: ${issue.line}`);
      console.error(`URL: ${issue.url}`);
      console.error(`详情: ${issue.detail}`);
      console.error('---');
    }

    console.error(`\n共发现 ${allIssues.length} 个问题。`);
    console.error('\n修复建议：');
    console.error('1. 本地图片路径统一使用 / 开头（例如 /img/a.png）');
    console.error('2. 确保引用文件真实存在于 public/ 目录中');
    console.error('3. 外部图片域名需在 next.config.ts 的 remotePatterns 中声明\n');

    process.exit(1);
  }

  console.log('✅ 所有图片引用检查通过！');
}

main();
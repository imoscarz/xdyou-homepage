#!/usr/bin/env node

/**
 * 更新 site.ts 中的 lastUpdated 字段为当前构建日期
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 获取当前日期并格式化为 "Jan 2026" 格式
function getCurrentDate() {
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'short' });
  const year = now.getFullYear();
  return `${month} ${year}`;
}

function main() {
  const siteConfigPath = join(__dirname, '..', 'src', 'config', 'site.ts');
  const content = readFileSync(siteConfigPath, 'utf-8');
  
  const currentDate = getCurrentDate();
  
  // 替换 lastUpdated 的值
  const updatedContent = content.replace(
    /lastUpdated:\s*["']([^"']+)["']/,
    `lastUpdated: "${currentDate}"`
  );
  
  if (content !== updatedContent) {
    writeFileSync(siteConfigPath, updatedContent, 'utf-8');
    console.log(`✅ 已更新 lastUpdated 为: ${currentDate}`);
  } else {
    console.log(`ℹ️  lastUpdated 已是最新: ${currentDate}`);
  }
}

main();

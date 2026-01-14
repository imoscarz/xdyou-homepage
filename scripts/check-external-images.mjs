#!/usr/bin/env node

/**
 * 检查 Markdown 文件和贡献者配置中的外部图片引用
 * 确保所有图片要么是本地图片，要么来自 next.config.ts 中允许的域名
 * 
 * 检查范围：
 * - contents/ 目录下的所有 Markdown 文件
 * - src/config/contributors.ts 中的贡献者头像
 * - src/config/project.ts 中的截图配置
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 从 next.config.ts 读取允许的域名
const nextConfigPath = join(__dirname, '..', 'next.config.ts');
const nextConfigContent = readFileSync(nextConfigPath, 'utf-8');

// 提取 remotePatterns 中的 hostname
const allowedHostnames = [];
const hostnameMatches = nextConfigContent.matchAll(/hostname:\s*["']([^"']+)["']/g);
for (const match of hostnameMatches) {
  allowedHostnames.push(match[1]);
}

console.log('允许的外部图片域名：', allowedHostnames);

// Markdown 图片语法正则：![alt](url) 和 <img src="url">
const imagePatterns = [
  /!\[([^\]]*)\]\(([^)]+)\)/g,  // Markdown 语法
  /<img[^>]+src=["']([^"']+)["']/g,  // HTML img 标签
];

// 递归查找所有 Markdown 文件
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

// 检查 URL 是否为外部 URL
function isExternalUrl(url) {
  return url.startsWith('http://') || url.startsWith('https://');
}

// 从 URL 中提取 hostname
function extractHostname(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

// 检查单个文件
function checkFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const issues = [];
  
  for (const pattern of imagePatterns) {
    const matches = content.matchAll(pattern);
    
    for (const match of matches) {
      // match[1] 可能是 alt text 或 src
      // match[2] 是 url（对于 Markdown 语法）
      const url = pattern.source.includes('img') ? match[1] : match[2];
      
      if (isExternalUrl(url)) {
        const hostname = extractHostname(url);
        
        if (hostname && !allowedHostnames.includes(hostname)) {
          issues.push({
            file: filePath,
            url: url,
            hostname: hostname,
            line: content.substring(0, match.index).split('\n').length,
          });
        }
      }
    }
  }
  
  return issues;
}

// 检查贡献者头像
function checkContributorsAvatars(configPath) {
  const content = readFileSync(configPath, 'utf-8');
  const issues = [];
  
  // 匹配 avatar: "url" 或 avatar: 'url'
  const avatarPattern = /avatar:\s*["']([^"']+)["']/g;
  const matches = content.matchAll(avatarPattern);
  
  for (const match of matches) {
    const url = match[1];
    
    if (isExternalUrl(url)) {
      const hostname = extractHostname(url);
      
      if (hostname && !allowedHostnames.includes(hostname)) {
        issues.push({
          file: configPath,
          url: url,
          hostname: hostname,
          line: content.substring(0, match.index).split('\n').length,
        });
      }
    }
  }
  
  return issues;
}

// 检查项目配置中的截图
function checkProjectScreenshots(configPath) {
  const content = readFileSync(configPath, 'utf-8');
  const issues = [];
  
  // 匹配 src: "url" 或 src: 'url'
  const srcPattern = /src:\s*["']([^"']+)["']/g;
  const matches = content.matchAll(srcPattern);
  
  for (const match of matches) {
    const url = match[1];
    
    if (isExternalUrl(url)) {
      const hostname = extractHostname(url);
      
      if (hostname && !allowedHostnames.includes(hostname)) {
        issues.push({
          file: configPath,
          url: url,
          hostname: hostname,
          line: content.substring(0, match.index).split('\n').length,
        });
      }
    }
  }
  
  return issues;
}

// 主函数
function main() {
  const contentsDir = join(__dirname, '..', 'contents');
  const markdownFiles = findMarkdownFiles(contentsDir);
  
  console.log(`\n检查 ${markdownFiles.length} 个 Markdown 文件...\n`);
  
  let allIssues = [];
  
  // 检查 Markdown 文件
  for (const file of markdownFiles) {
    const issues = checkFile(file);
    allIssues = allIssues.concat(issues);
  }
  
  // 检查贡献者头像
  console.log('检查贡献者头像...\n');
  const contributorsConfigPath = join(__dirname, '..', 'src', 'config', 'contributors.ts');
  const contributorsIssues = checkContributorsAvatars(contributorsConfigPath);
  allIssues = allIssues.concat(contributorsIssues);
  
  // 检查项目截图配置
  console.log('检查项目截图配置...\n');
  const projectConfigPath = join(__dirname, '..', 'src', 'config', 'project.ts');
  const projectIssues = checkProjectScreenshots(projectConfigPath);
  allIssues = allIssues.concat(projectIssues);
  
  if (allIssues.length > 0) {
    console.error('❌ 发现非法的外部图片引用：\n');
    
    for (const issue of allIssues) {
      console.error(`文件: ${issue.file}`);
      console.error(`行号: ${issue.line}`);
      console.error(`URL: ${issue.url}`);
      console.error(`域名: ${issue.hostname} (未在 next.config.ts 中声明)`);
      console.error('---');
    }
    
    console.error(`\n共发现 ${allIssues.length} 个问题。`);
    console.error('\n解决方案：');
    console.error('1. 将图片下载到 public/img 目录并使用相对路径引用');
    console.error('2. 改为从 next.config.ts 的 remotePatterns 中添加的域名引用图片\n');
    
    process.exit(1);
  } else {
    console.log('✅ 所有图片引用检查通过！');
  }
}

main();

#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  red: "\x1b[31m",
};

const c = (color, text) => `${COLORS[color]}${text}${COLORS.reset}`;

const PLATFORMS = {
  "1": {
    id: "antigravity",
    name: "Antigravity",
    desc: "SKILL.md 포맷 (.agents/skills/)",
    targetDir: ".agents/skills",
    format: "skill",
  },
  "2": {
    id: "claudecode",
    name: "Claude Code",
    desc: "CLAUDE.md + .claude/agents/",
    targetDir: ".claude/agents",
    format: "claudecode",
  },
  "3": {
    id: "cursor",
    name: "Cursor",
    desc: ".cursor/rules/*.mdc 포맷",
    targetDir: ".cursor/rules",
    format: "cursor",
  },
  "4": {
    id: "windsurf",
    name: "Windsurf",
    desc: ".windsurf/rules/*.md 포맷",
    targetDir: ".windsurf/rules",
    format: "windsurf",
  },
};

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// SKILL.md 내용을 플랫폼별 포맷으로 변환
function convertSkillContent(content, agentName, format) {
  // YAML frontmatter 파싱
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) return content;

  const frontmatter = fmMatch[1];
  const body = fmMatch[2];

  const nameMatch = frontmatter.match(/name:\s*(.+)/);
  const descMatch = frontmatter.match(/description:\s*>\n([\s\S]*?)(?=\n\w|$)/);
  const name = nameMatch ? nameMatch[1].trim() : agentName;
  const desc = descMatch
    ? descMatch[1].replace(/^\s+/gm, "").trim()
    : "";

  if (format === "cursor") {
    return `---
description: ${desc.split("\n")[0]}
alwaysApply: false
---

${body.trim()}`;
  }

  if (format === "windsurf") {
    return `---
trigger: ${desc.split("\n")[0].substring(0, 80)}
---

${body.trim()}`;
  }

  if (format === "claudecode") {
    return body.trim();
  }

  return content;
}

function getFileExt(format) {
  if (format === "cursor") return ".mdc";
  return ".md";
}

function installSkills(templateDir, targetDir, format) {
  const skillsTemplatePath = path.join(templateDir, ".agents", "skills");
  if (!fs.existsSync(skillsTemplatePath)) return 0;

  const agents = fs.readdirSync(skillsTemplatePath);
  let count = 0;

  for (const agentFolder of agents) {
    const agentSrc = path.join(skillsTemplatePath, agentFolder);
    const skillFile = path.join(agentSrc, "SKILL.md");

    if (!fs.existsSync(skillFile)) continue;

    const content = fs.readFileSync(skillFile, "utf8");
    const ext = getFileExt(format);

    let destDir, destFile;

    if (format === "antigravity") {
      destDir = path.join(targetDir, agentFolder);
      destFile = path.join(destDir, "SKILL.md");
      // assets도 복사
      copyDir(agentSrc, destDir);
    } else if (format === "claudecode") {
      destDir = targetDir;
      destFile = path.join(destDir, `${agentFolder}${ext}`);
      fs.mkdirSync(destDir, { recursive: true });
      const converted = convertSkillContent(content, agentFolder, format);
      fs.writeFileSync(destFile, converted);
    } else {
      // cursor, windsurf
      destDir = targetDir;
      destFile = path.join(destDir, `${agentFolder}${ext}`);
      fs.mkdirSync(destDir, { recursive: true });
      const converted = convertSkillContent(content, agentFolder, format);
      fs.writeFileSync(destFile, converted);
    }

    count++;
  }

  return count;
}

function installClaudeMd(templateDir, cwd, format) {
  if (format !== "claudecode") return;

  const claudeMdSrc = path.join(templateDir, "CLAUDE.md");
  if (!fs.existsSync(claudeMdSrc)) return;

  const dest = path.join(cwd, "CLAUDE.md");
  if (fs.existsSync(dest)) {
    // 기존 CLAUDE.md에 append
    const existing = fs.readFileSync(dest, "utf8");
    const toAdd = fs.readFileSync(claudeMdSrc, "utf8");
    fs.writeFileSync(dest, existing + "\n\n---\n\n" + toAdd);
    console.log(c("gray", "  → 기존 CLAUDE.md에 내용 추가됨"));
  } else {
    fs.copyFileSync(claudeMdSrc, dest);
  }
}

async function main() {
  console.log("\n" + c("bold", "⚙️  Harness Builder — 설치 마법사"));
  console.log(c("gray", "AI 에이전트 팀 자동 구성 시스템\n"));

  const cwd = process.cwd();
  console.log(c("gray", `설치 위치: ${cwd}\n`));

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  // 플랫폼 선택
  console.log(c("cyan", "어떤 AI 툴을 사용하시나요?\n"));
  for (const [key, p] of Object.entries(PLATFORMS)) {
    console.log(`  ${c("bold", key)}. ${c("green", p.name)}  ${c("gray", p.desc)}`);
  }

  const platformChoice = await ask(rl, "\n번호 입력 (기본값: 1): ");
  const platform = PLATFORMS[platformChoice.trim() || "1"];

  if (!platform) {
    console.log(c("red", "잘못된 선택입니다."));
    rl.close();
    process.exit(1);
  }

  console.log(`\n${c("green", "✓")} ${c("bold", platform.name)} 선택됨`);
  console.log(c("gray", `파일 위치: ${platform.targetDir}\n`));

  // 설치 확인
  const confirm = await ask(rl, c("yellow", "설치를 진행할까요? (y/n): "));
  if (!confirm.toLowerCase().startsWith("y") && confirm.trim() !== "") {
    console.log(c("gray", "취소되었습니다."));
    rl.close();
    return;
  }

  rl.close();

  // 설치 실행
  console.log(c("gray", "\n설치 중..."));

  const templateDir = path.join(__dirname, "..", "template");
  const targetDir = path.join(cwd, platform.targetDir);

  try {
    const count = installSkills(templateDir, targetDir, platform.format);
    installClaudeMd(templateDir, cwd, platform.format);

    // docs 폴더 복사 (공통)
    const docsSrc = path.join(templateDir, "docs");
    if (fs.existsSync(docsSrc)) {
      copyDir(docsSrc, path.join(cwd, "docs"));
    }

    console.log("\n" + c("green", "✅ 설치 완료!") + "\n");
    console.log(`  ${c("bold", "에이전트:")} ${count}개 설치됨`);
    console.log(`  ${c("bold", "위치:")} ${platform.targetDir}\n`);

    // 플랫폼별 다음 단계 안내
    const nextSteps = {
      antigravity: [
        `AI에게 ${c("cyan", '"하네스 세팅 진행해"')} 라고 입력하세요`,
        "7단계 파이프라인이 자동으로 시작됩니다",
      ],
      claudecode: [
        `터미널에서 ${c("cyan", "claude")} 실행 후`,
        `${c("cyan", '"하네스 세팅 진행해"')} 라고 입력하세요`,
      ],
      cursor: [
        "Cursor에서 프로젝트를 열고",
        `${c("cyan", '"하네스 세팅 진행해"')} 라고 채팅에 입력하세요`,
      ],
      windsurf: [
        "Windsurf에서 프로젝트를 열고",
        `${c("cyan", '"하네스 세팅 진행해"')} 라고 입력하세요`,
      ],
    };

    console.log(c("bold", "다음 단계:"));
    for (const step of nextSteps[platform.id] || []) {
      console.log(`  → ${step}`);
    }
    console.log();
  } catch (err) {
    console.error(c("red", "\n오류 발생: ") + err.message);
    process.exit(1);
  }
}

main();

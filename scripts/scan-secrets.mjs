#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const IGNORED_DIRS = new Set([
  ".git",
  "node_modules",
  ".expo",
  "coverage",
  "dist",
  "web-build",
  ".eas",
  "android",
  "ios",
]);
const IGNORED_FILES = new Set(["env.example", "package-lock.json", "scripts/scan-secrets.mjs"]);
const TEXT_EXTENSIONS = /\.(ts|tsx|js|mjs|cjs|json|md|yml|yaml|txt|example)$/i;

function trackedFiles() {
  const output = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" });
  return output.split("\u0000").filter(Boolean);
}

function isIgnored(file) {
  return IGNORED_FILES.has(file) || file.split("/").some((part) => IGNORED_DIRS.has(part));
}

function readText(file) {
  return readFileSync(file, "utf8");
}

const findings = [];
const tracked = trackedFiles();

for (const file of tracked) {
  if (isIgnored(file) || !TEXT_EXTENSIONS.test(file)) {
    continue;
  }
  const content = readText(file);
  if (/-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(content)) {
    findings.push(`${file}: posible clave privada`);
  }
  if (/AIzaSy[A-Za-z0-9_-]{30,}/.test(content)) {
    findings.push(`${file}: posible clave de API de Firebase`);
  }
  if (/"private_key"\s*:\s*"-----BEGIN/.test(content)) {
    findings.push(`${file}: posible cuenta de servicio`);
  }
  if (/firebaseConfig\s*=/.test(content)) {
    findings.push(`${file}: firebaseConfig dentro de la app`);
  }
  if (file.endsWith(".md") === false && /CANARIO=/.test(content)) {
    findings.push(`${file}: valor canario en archivo versionado`);
  }
}

const forbiddenEnv = tracked.filter(
  (file) => /(^|\/)\.env($|\.)/.test(file) && !file.endsWith("env.example"),
);
if (forbiddenEnv.length > 0) {
  findings.push(`Archivos .env versionados: ${forbiddenEnv.join(", ")}`);
}

const gitignore = readText(".gitignore");
if (!/^\.env$/m.test(gitignore)) {
  findings.push(".gitignore no bloquea .env");
}

if (findings.length > 0) {
  console.error("Escaneo de secretos: FALLÓ");
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log(`Escaneo de secretos: OK (${tracked.length} archivos revisados)`);

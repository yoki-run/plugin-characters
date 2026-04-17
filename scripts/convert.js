#!/usr/bin/env node
// Converts the Go slice literals in ../desktop/emoji.go and ../desktop/unicode.go
// into data/emojis.json and data/unicode.json.
//
// Usage: node scripts/convert.js
//
// The Go data looks like:
//   {"😀", "grinning face", "happy smile"},
// We map those three columns onto {char, name, keywords}.
"use strict";
const fs = require("fs");
const path = require("path");

// Parse the tuple lines. Each emoji/unicode block contains lines of the form
// optional leading whitespace + { "X", "Y", "Z" },
// Handle comments and blank lines. Handle commas inside keyword strings.
function parseGoEntries(src, firstField, secondField, thirdField) {
  const out = [];
  // Match one tuple entry with 3 double-quoted strings.
  // Strings may contain escaped quotes (e.g. "\"") — but our data doesn't,
  // so simple non-greedy capture is enough.
  const rx = /\{\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*\}/g;
  let m;
  while ((m = rx.exec(src))) {
    const a = unescapeGo(m[1]);
    const b = unescapeGo(m[2]);
    const c = unescapeGo(m[3]);
    const entry = {};
    entry[firstField] = a;
    entry[secondField] = b;
    entry[thirdField] = c;
    out.push(entry);
  }
  return out;
}

function unescapeGo(s) {
  return s
    .replace(/\\\\/g, "\\")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t");
}

function main() {
  const repoRoot = path.resolve(__dirname, "..", "..", "..", "desktop");
  const emojiSrc = fs.readFileSync(path.join(repoRoot, "emoji.go"), "utf8");
  const unicodeSrc = fs.readFileSync(path.join(repoRoot, "unicode.go"), "utf8");

  const emojis = parseGoEntries(emojiSrc, "emoji", "name", "keywords");
  const unicode = parseGoEntries(unicodeSrc, "char", "name", "keywords");

  const outDir = path.resolve(__dirname, "..", "data");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "emojis.json"), JSON.stringify(emojis));
  fs.writeFileSync(path.join(outDir, "unicode.json"), JSON.stringify(unicode));

  console.log(`emojis:  ${emojis.length}`);
  console.log(`unicode: ${unicode.length}`);
}

main();

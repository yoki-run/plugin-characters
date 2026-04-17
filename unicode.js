#!/usr/bin/env node
"use strict";
// Unicode symbol list — search arrows, math, currency, greek, box-drawing.
const { readInput, writeResponse, list, error, stripKeyword } = require("@yoki/plugin-sdk");
const data = require("./data/unicode.json");
const { filterByQuery } = require("./lib");

const LIST_LIMIT = 80;

async function main() {
  const input = await readInput();
  let query = stripKeyword(input.query || "", "u", "unicode", "sym", "symbol");

  // Tolerate "u:arrow" and "u: arrow" shorthand (legacy prefix).
  if (query.startsWith(":")) {
    query = query.slice(1).trim();
  }

  const results = filterByQuery(data, query, LIST_LIMIT, e => e.char + " " + e.name + " " + e.keywords);

  const items = results.map((e, i) => ({
    id: `u-${i}`,
    title: e.char,
    subtitle: e.name,
    value: e.char,
    actions: [
      { title: "Copy symbol", shortcut: "enter", type: "copy", value: e.char },
    ],
  }));

  writeResponse(list(items));
}

main().catch(e => {
  try { writeResponse(error("Unicode error", e && e.message ? e.message : String(e))); } catch (_) {}
  process.exit(1);
});

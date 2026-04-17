#!/usr/bin/env node
"use strict";
// Emoji grid — search and copy emojis to the clipboard.
//
// Mode: grid. Each item exposes a copy action so Enter (or click) pastes
// the emoji into whatever app has focus. The host routes actions.type
// "copy" through the clipboard.
const { readInput, writeResponse, grid, error, stripKeyword } = require("@yoki/plugin-sdk");
const data = require("./data/emojis.json");
const { filterByQuery } = require("./lib");

const GRID_LIMIT = 60;
const GRID_COLUMNS = 8;

async function main() {
  const input = await readInput();
  let query = stripKeyword(input.query || "", "emoji", "e");

  // Also strip a leading colon — the legacy ":fire" shortcut — so users
  // coming from the old built-in still have the muscle memory working.
  if (query.startsWith(":")) {
    query = query.slice(1).trim();
  }

  const results = filterByQuery(data, query, GRID_LIMIT, e => e.emoji + " " + e.name + " " + e.keywords);

  const items = results.map((e, i) => ({
    id: `emoji-${i}`,
    title: e.emoji,
    subtitle: e.name,
    value: e.emoji,
    actions: [
      { title: "Copy emoji", shortcut: "enter", type: "copy", value: e.emoji },
    ],
  }));

  writeResponse(grid(items, GRID_COLUMNS));
}

main().catch(e => {
  try { writeResponse(error("Emoji error", e && e.message ? e.message : String(e))); } catch (_) {}
  process.exit(1);
});

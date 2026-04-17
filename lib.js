"use strict";
// Shared search helpers for characters.

function filterByQuery(data, query, limit, getSearchText) {
  const q = (query || "").toLowerCase().trim();
  if (q === "") {
    return data.slice(0, limit);
  }
  const words = q.split(/\s+/).filter(Boolean);
  const out = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const hay = getSearchText(item).toLowerCase();
    let ok = true;
    for (let w = 0; w < words.length; w++) {
      if (hay.indexOf(words[w]) === -1) {
        ok = false;
        break;
      }
    }
    if (ok) {
      out.push(item);
      if (out.length >= limit) break;
    }
  }
  return out;
}

module.exports = { filterByQuery };

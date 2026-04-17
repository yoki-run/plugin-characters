# Characters — Yoki plugin

Emoji picker and Unicode symbol search for the [Yoki](https://yoki.run) launcher.

Replaces the built-in emoji + unicode features with a single plugin that runs
over the v2 stdin/stdout protocol.

## Usage

| Trigger              | What it does                                    |
|----------------------|-------------------------------------------------|
| `emoji` or `e`       | Grid of 60 emojis — type to filter              |
| `emoji fire`         | Filter by name / keyword (multi-word AND-match) |
| `:laugh`             | Legacy colon-prefix shortcut still works        |
| `u` or `unicode`     | List of 80 Unicode symbols — arrows, math, etc. |
| `u arrow`            | Filter symbols                                  |
| `u: arrow`           | Legacy colon-prefix shortcut still works        |

Hit Enter on any item to copy the glyph to the clipboard.

## Data

- `data/emojis.json` — 917 emojis with keywords.
- `data/unicode.json` — 422 Unicode characters (arrows, math, currency,
  Greek, box-drawing, punctuation, circled letters).

Both files were ported from the former `desktop/emoji.go` and `desktop/unicode.go`
slice literals using `scripts/convert.js`. The script is committed for provenance
but is **not required at runtime** — the JSON is authoritative.

## Dev

```bash
node scripts/convert.js     # regenerate JSON from ../../desktop/*.go
NODE_PATH=../../desktop/internal/modules/plugins/sdk/node \
    echo '{"query":"fire"}' | node emoji.js
```

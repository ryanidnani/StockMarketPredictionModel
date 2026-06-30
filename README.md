# Stock Market Predictions Model

> **Disclaimer:** For education and research only — not financial, investment, or trading advice.  
> Daily crosses and model scores are automated outputs for **research screening**, not recommendations to buy or sell.  
> Past performance does not guarantee future results. You are responsible for your own decisions; authors may hold positions in securities shown here.

Daily golden cross and death cross detections, plus a **v4 cross screener** for US equities. This repository is the **public read-only feed** of results produced by a private research pipeline.

**Live dashboard:** [ryanidnani.github.io/StockMarketPredictionModel](https://ryanidnani.github.io/StockMarketPredictionModel/) (enable Pages once: **Settings → Pages → Build from branch → `gh-pages` / `/`**).

## What is published here

| Path | Description |
|------|-------------|
| [`latest/detected_crosses.csv`](latest/detected_crosses.csv) | Most recent cross scan (dated copy in each `data/daily/YYYY-MM-DD/` folder) |
| [`latest/cross_screener.csv`](latest/cross_screener.csv) | Most recent v4 screener (dated copy in each daily folder) |
| [`data/daily/`](data/daily/) | Historical archive by date (`YYYY-MM-DD/`) |
| [`data/manifest.json`](data/manifest.json) | Index of published trading days |

The private pipeline runs on market days, detects EMA crosses (50/200 and short-term 21/50 where applicable), scores each cross with v4 fakeout classifiers, and pushes sanitized CSVs here. **No API keys, model weights, or training code** are included in this repo.

## Signal types

**Detected crosses** (`detected_crosses.csv`):

- `golden` / `death` — 50-day EMA crosses 200-day EMA (bullish / bearish)
- `golden_st` / `death_st` — 21-day EMA crosses 50-day EMA (short-term)

**Cross screener** (`cross_screener.csv`):

- `cross_type` — `golden`, `death`, `golden_st`, or `death_st`
- `probability` — model confidence the cross is real vs. a fakeout (0–100 scale)
- `look_threshold_pct` — minimum % required to flag the row for review
- `look_margin_pct` — `probability − look_threshold_pct`
- `recommendation` — `LOOK` (worth reviewing) or `SKIP`
- `rank` — rank within the day (highest probability first among gate survivors)

## Data layout

```
StockMarketPredictionModel/
├── latest/                    # Always points to the newest run
│   ├── as_of.txt
│   ├── detected_crosses.csv
│   └── cross_screener.csv
├── data/
│   ├── manifest.json
│   └── daily/
│       └── YYYY-MM-DD/
│           ├── detected_crosses_YYYY-MM-DD.csv
│           └── cross_screener_YYYY-MM-DD.csv
├── docs/
│   └── social-preview.jpg     # Repo banner / social thumbnail
└── site/                      # GitHub Pages dashboard
    ├── asset-boot.js          # Loads shared assets with manifest cache keys
    ├── index.html
    ├── index.css
    ├── favicon.svg
    └── social-preview.jpg
```

## License

MIT — see [LICENSE](LICENSE).

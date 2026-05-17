# Stock Market Predictions Model

> **Disclaimer:** For education and research only — not financial, investment, or trading advice.  
> Published crosses and model output are for **trading idea exploration** only, not buy/sell instructions.  
> You are solely responsible for your own decisions; authors may hold positions in mentioned securities.

Daily golden cross and death cross detections, plus machine-learning signals for US equities. This repository is the **public read-only feed** of results produced by a private research pipeline.

**Live dashboard:** [ryanidnani.github.io/StockMarketPredictionModel](https://ryanidnani.github.io/StockMarketPredictionModel/) (enable Pages once: **Settings → Pages → Build from branch → `gh-pages` / `/`**).

## What is published here

| Path | Description |
|------|-------------|
| [`latest/detected_crosses.csv`](latest/detected_crosses.csv) | Most recent cross scan (all signal types) |
| [`latest/trading_predictions.csv`](latest/trading_predictions.csv) | Most recent model recommendations |
| [`data/daily/`](data/daily/) | Historical archive by date (`YYYY-MM-DD/`) |
| [`data/manifest.json`](data/manifest.json) | Index of published trading days |

The private pipeline runs on market days, detects EMA crosses (50/200 and short-term 21/50 where applicable), scores events with trained models, and pushes sanitized CSVs here. **No API keys, model weights, or training code** are included in this repo.

## Signal types

**Detected crosses** (`detected_crosses.csv`):

- `golden` / `death` — 50-day EMA crosses 200-day EMA (bullish / bearish)
- `golden_st` / `death_st` — 21-day EMA crosses 50-day EMA (short-term)

**Trading predictions** (`trading_predictions.csv`):

- `cross_type` — `golden`, `death`, `golden_st`, or `death_st`
- `probability` — model confidence (0–100 scale in file)
- `recommendation` — `CONSIDER` or `AVOID` (ideas worth a look vs. pass)
- Price fields — entry, take-profit, and stop levels when `CONSIDER`

## Data layout

```
StockMarketPredictionModel/
├── latest/                    # Always points to the newest run
│   ├── as_of.txt
│   ├── detected_crosses.csv
│   └── trading_predictions.csv
├── data/
│   ├── manifest.json
│   └── daily/
│       └── YYYY-MM-DD/
│           ├── detected_crosses.csv
│           └── trading_predictions.csv
├── docs/
│   └── social-preview.png     # Repo banner / social thumbnail
└── site/                      # GitHub Pages dashboard
    ├── index.html
    └── social-preview.png
```

## License

MIT — see [LICENSE](LICENSE).

# Stock Market Predictions Model

> **Disclaimer:** For education and research only — not financial, investment, or trading advice.  
> Daily crosses and model scores are automated outputs for **idea research**, not recommendations to buy or sell.  
> Past performance does not guarantee future results. You are responsible for your own decisions; authors may hold positions in securities shown here.

Daily golden cross and death cross detections, plus **v3 trading predictions** for US equities. This repository is the **public read-only feed** of results produced by a private research pipeline.

**Live dashboard:** [ryanidnani.github.io/StockMarketPredictionModel](https://ryanidnani.github.io/StockMarketPredictionModel/) (enable Pages once: **Settings → Pages → Build from branch → `gh-pages` / `/`**).

## What is published here

| Path | Description |
|------|-------------|
| [`latest/detected_crosses.csv`](latest/detected_crosses.csv) | Most recent cross scan (dated copy in each `data/daily/YYYY-MM-DD/` folder) |
| [`latest/trading_predictions.csv`](latest/trading_predictions.csv) | Most recent model predictions (dated copy in each daily folder) |
| [`data/daily/`](data/daily/) | Historical archive by date (`YYYY-MM-DD/`) |
| [`data/manifest.json`](data/manifest.json) | Index of published trading days |

The private pipeline runs on market days, detects EMA crosses (50/200 and short-term 21/50 where applicable), scores each cross with v3 prediction models, and pushes sanitized CSVs here. **No API keys, model weights, or training code** are included in this repo.

## Signal types

**Detected crosses** (`detected_crosses.csv`):

- `golden` / `death` — 50-day EMA crosses 200-day EMA (bullish / bearish)
- `golden_st` / `death_st` — 21-day EMA crosses 50-day EMA (short-term)

**Trading predictions** (`trading_predictions.csv`):

- `cross_type` — `golden`, `death`, `golden_st`, or `death_st`
- `probability` — model confidence the cross is real vs. a fakeout (0–100 scale)
- `recommendation` — `CONSIDER` (probability ≥ 50% with trade targets) or `AVOID`
- Trade target columns (`entry_price`, `prudent_tp_price`, `stop_loss_price`, etc.) when flagged CONSIDER

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
│           ├── detected_crosses_YYYY-MM-DD.csv
│           └── trading_predictions_YYYY-MM-DD.csv
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

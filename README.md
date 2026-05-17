# Stock Market Predictions Model

Daily golden cross and death cross detections, plus machine-learning trading recommendations for US equities. This repository is the **public read-only feed** of results produced by a private research pipeline.

**Live dashboard:** after GitHub Pages is enabled, open [ryanidnani.github.io/Stock-Market-Predictions-Model](https://ryanidnani.github.io/Stock-Market-Predictions-Model/).

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
- `recommendation` — `EXECUTE` or `AVOID`
- Price fields — entry, take-profit, and stop levels when `EXECUTE`

## Disclaimer

This project is for **education and research only**. It is not investment advice. Past signals and backtests do not guarantee future results. You are responsible for your own trading decisions. The authors may hold positions in mentioned securities.

## Data layout

```
Stock-Market-Predictions-Model/
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
└── site/                      # GitHub Pages (optional)
    └── index.html
```

## License

MIT — see [LICENSE](LICENSE).

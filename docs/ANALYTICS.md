# Website analytics

Analytics tracks the **live dashboard** (GitHub Pages), not the GitHub repository itself.

| Surface | URL / location | What to use |
|---------|----------------|-------------|
| **Dashboard** | [ryanidnani.github.io/StockMarketPredictionModel](https://ryanidnani.github.io/StockMarketPredictionModel/) | [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) (beacon in `site/index.html`) |
| **GitHub repo** | [github.com/ryanidnani/StockMarketPredictionModel](https://github.com/ryanidnani/StockMarketPredictionModel) | **Insights → Traffic** on the repo (views, clones, referrers) |

Someone can star or clone the repo without ever opening the dashboard, so check both if you want the full picture.

## Cloudflare setup (one time, free)

1. Sign in at [dash.cloudflare.com](https://dash.cloudflare.com/) (free account is fine — you do **not** need to proxy GitHub Pages through Cloudflare DNS).
2. Go to **Analytics & logs → Web Analytics → Add a site**.
3. Hostname: **`ryanidnani.github.io`**
4. Choose **Manage installation manually** and copy the **token** from the beacon snippet.
5. Paste the token into `CF_ANALYTICS_TOKEN` in [`site/index.html`](../site/index.html).
6. Push to `main`; the [Deploy GitHub Pages](../.github/workflows/pages.yml) workflow updates the live site.

Cloudflare reports pageviews, referrers, countries, and devices for paths under your hostname (including `/StockMarketPredictionModel/`).

## Excluding your own visits

Your browser is excluded from analytics so the Cloudflare dashboard reflects **other people only**.

Open this URL once on each device you use (bookmark it):

```
https://ryanidnani.github.io/StockMarketPredictionModel/?gc_owner=1
```

That sets `localStorage` and removes the query string. The analytics beacon is not loaded on that browser afterward.

### Reading the dashboard

- **Any pageviews / visitors in Cloudflare** → someone else opened the site.
- **Flat zero over time** → likely only you (or almost no traffic).
- **Referrers** → where external visits came from (Google, GitHub links, social, direct, etc.).

## Local preview

Analytics only runs on `*.github.io`. Opening `site/index.html` from disk does not send events.

## GitHub repo traffic

On the public repo: **Insights → Traffic** shows:

- **Views** — README / file browsing on github.com
- **Clones** — full and partial repo clones
- **Referring sites** — who linked to the repo

That is separate from dashboard pageviews and is useful early on when people discover the project via GitHub search or README links rather than the Pages URL.

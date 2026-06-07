/**
 * Shared utilities for the Stock Market Predictions Model dashboard site.
 */
(function () {
  const REPO = "ryanidnani/StockMarketPredictionModel";
  const onPages = location.hostname.endsWith("github.io");

  const CROSS_TYPES = ["golden", "death", "golden_st", "death_st"];
  const CROSS_TYPE_LABELS = {
    golden: "Golden",
    death: "Death",
    golden_st: "Golden ST",
    death_st: "Death ST",
  };

  function pagesBase() {
    const segment = location.pathname.split("/").filter(Boolean)[0];
    return segment ? `/${segment}/` : "/";
  }

  function assetUrl(path) {
    const clean = path.replace(/^\//, "");
    if (onPages) return pagesBase() + clean;
    return `https://raw.githubusercontent.com/${REPO}/main/${clean}`;
  }

  function dailyCsvPaths(date) {
    return {
      crosses: `data/daily/${date}/detected_crosses_${date}.csv`,
      predictions: `data/daily/${date}/trading_predictions_${date}.csv`,
    };
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function loadText(path, cacheKey) {
    const url = assetUrl(path);
    const bust = cacheKey != null ? String(cacheKey) : String(Date.now());
    const fetchUrl = `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(bust)}`;
    const r = await fetch(fetchUrl);
    if (!r.ok) throw new Error(path);
    return r.text();
  }

  function parseCsv(text) {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",");
    return lines.slice(1).filter(Boolean).map((line) => {
      const cols = line.split(",");
      const row = {};
      headers.forEach((h, i) => { row[h.trim()] = (cols[i] || "").trim(); });
      return row;
    });
  }

  function crossClass(type) {
    if (!type) return "";
    return type.includes("death") ? "tag-death" : "tag-golden";
  }

  function crossTypeLabel(type) {
    if (!type || type === "—") return "—";
    return CROSS_TYPE_LABELS[type] || type;
  }

  function normalizeTicker(value) {
    return String(value ?? "").trim().toUpperCase();
  }

  function displayRecommendation(rec) {
    if (rec === "EXECUTE" || rec === "CONSIDER") return "CONSIDER";
    return rec;
  }

  function probabilityPercent(value) {
    if (value == null || value === "") return null;
    const num = Number(value);
    if (!Number.isFinite(num)) return null;
    if (num > 0 && num <= 1) return num * 100;
    return num;
  }

  function isConsider(rec, probability) {
    const pct = probabilityPercent(probability);
    if (pct == null || pct < 50) return false;
    return displayRecommendation(rec) === "CONSIDER";
  }

  function recommendationRank(row) {
    return isConsider(row.recommendation, row.probability) ? 0 : 1;
  }

  function recommendationLabel(row) {
    if (isConsider(row.recommendation, row.probability)) return "CONSIDER";
    if (displayRecommendation(row.recommendation) === "CONSIDER") return "AVOID";
    return displayRecommendation(row.recommendation) || "—";
  }

  function formatVolume(value) {
    if (value == null || value === "") return "—";
    const num = Number(value);
    return Number.isFinite(num) ? `${num.toFixed(1)}M` : escapeHtml(value);
  }

  function formatMarketCap(value) {
    if (value == null || value === "") return "—";
    const num = Number(value);
    return Number.isFinite(num) ? `$${num.toFixed(1)}B` : escapeHtml(value);
  }

  function formatPrice(value) {
    if (value == null || value === "") return "—";
    const num = Number(value);
    return Number.isFinite(num) ? num.toFixed(2) : escapeHtml(value);
  }

  function formatProbability(value) {
    const pct = probabilityPercent(value);
    if (pct == null) return "—";
    return pct.toFixed(2);
  }

  function formatPercent(value) {
    if (value == null || value === "") return "—";
    const num = Number(value);
    return Number.isFinite(num) ? `${num.toFixed(2)}%` : escapeHtml(value);
  }

  function formatUpdatedAt(iso, { includeEastern = true } = {}) {
    if (!iso) return null;
    const dt = new Date(iso);
    if (Number.isNaN(dt.getTime())) return null;

    const datePart = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(dt);

    const timeOpts = { hour: "numeric", minute: "2-digit", hour12: true };
    const pt = new Intl.DateTimeFormat("en-US", {
      ...timeOpts,
      timeZone: "America/Los_Angeles",
    }).format(dt);

    if (!includeEastern) {
      return `${datePart} at ${pt} PT`;
    }

    const et = new Intl.DateTimeFormat("en-US", {
      ...timeOpts,
      timeZone: "America/New_York",
    }).format(dt);

    return `${datePart} at ${pt} PT (${et} ET)`;
  }

  function crossSignal(row) {
    return row.signal_type
      || (row.golden_cross === "True" ? "golden" : row.death_cross === "True" ? "death" : "—");
  }

  function numericField(row, ...keys) {
    for (const key of keys) {
      const value = row[key];
      if (value == null || value === "") continue;
      const num = Number(value);
      if (Number.isFinite(num)) return num;
    }
    return null;
  }

  function archiveStartDateFromManifest(manifest) {
    if (!manifest?.dates?.length) return null;
    return [...manifest.dates].sort()[0];
  }

  function archiveStartHint(manifest, { emptyText, sincePrefix } = {}) {
    const start = archiveStartDateFromManifest(manifest);
    if (sincePrefix) {
      return start
        ? `${sincePrefix} since ${start}`
        : (emptyText || sincePrefix);
    }
    return start
      ? `Search a ticker to view cross history since ${start}. Click a row to open that day on the Daily Dashboard.`
      : "Search a ticker to view its archived cross history. Click a row to open that day on the Daily Dashboard.";
  }

  function tickerHistoryUrl(ticker) {
    const symbol = normalizeTicker(ticker);
    if (!symbol) return "#";
    return `ticker-history.html?ticker=${encodeURIComponent(symbol)}`;
  }

  function renderTickerLink(ticker) {
    const symbol = normalizeTicker(ticker);
    if (!symbol) return "—";
    return `<a class="ticker-link" href="${tickerHistoryUrl(symbol)}">${escapeHtml(symbol)}</a>`;
  }

  function dashboardDayUrl(date) {
    return `${pagesBase()}index.html?day=${encodeURIComponent(date)}`;
  }

  function manifestDatesForArchive(manifest, latestDate) {
    const dates = [...(manifest?.dates || [])];
    if (latestDate && !dates.includes(latestDate)) {
      dates.push(latestDate);
    }
    return [...new Set(dates)].sort();
  }

  function getColumn(columns, key) {
    return columns.find((column) => column.key === key) || columns[0];
  }

  function sortRows(rows, column, direction) {
    const factor = direction === "asc" ? 1 : -1;
    return [...rows].sort((left, right) => {
      const leftValue = column.sortValue(left);
      const rightValue = column.sortValue(right);
      const leftEmpty = leftValue == null || leftValue === ""
        || (column.type === "number" && !Number.isFinite(leftValue));
      const rightEmpty = rightValue == null || rightValue === ""
        || (column.type === "number" && !Number.isFinite(rightValue));

      const leftId = String(left.ticker || left.symbol || "");
      const rightId = String(right.ticker || right.symbol || "");

      if (leftEmpty && rightEmpty) {
        return leftId.localeCompare(rightId);
      }
      if (leftEmpty) return 1;
      if (rightEmpty) return -1;

      if (column.type === "number" || column.type === "rank") {
        if (leftValue === rightValue) {
          return leftId.localeCompare(rightId);
        }
        return factor * (leftValue - rightValue);
      }

      const cmp = String(leftValue).localeCompare(String(rightValue));
      if (cmp !== 0) return factor * cmp;
      return leftId.localeCompare(rightId);
    });
  }

  function defaultColWidth(col, index) {
    if (col.minWidth) return col.minWidth;
    if (index === 0) {
      return col.key === "event_date" ? "7rem" : "5.25rem";
    }
    const widths = {
      cross_type: "6.75rem",
      signal_type: "6.75rem",
      recommendation: "7.75rem",
      probability: "6.75rem",
      avg_daily_volume_30d: "8.25rem",
      market_cap: "7rem",
      current_price: "7.25rem",
      entry_price: "7rem",
      prudent_tp_price: "8.75rem",
      max_tp_price: "8.25rem",
      stop_loss_price: "8.25rem",
      return_prudent: "7.75rem",
      downside_return: "8rem",
      ema_21: "6.25rem",
      ema_50: "6.25rem",
      ema_200: "6.75rem",
    };
    if (widths[col.key]) return widths[col.key];
    if (col.type === "number" || col.type === "rank") return "7rem";
    return "7.25rem";
  }

  function tableWidthRem(columns) {
    let total = 0;
    for (let i = 0; i < columns.length; i++) {
      total += parseFloat(defaultColWidth(columns[i], i));
    }
    return total;
  }

  function buildColgroup(columns) {
    let cols = "";
    for (let i = 0; i < columns.length; i++) {
      const width = defaultColWidth(columns[i], i);
      cols += `<col style="width:${width}">`;
    }
    return `<colgroup>${cols}</colgroup>`;
  }

  function renderDataTable(tableName, columns, rows, sortState, rowClassFn, rowAttrsFn) {
    if (!rows.length) {
      return "<p>No rows in the selected file.</p>";
    }

    const column = getColumn(columns, sortState.key);
    const sortedRows = sortRows(rows, column, sortState.dir);
    const alignClass = (align) => (align === "left" ? "col-left" : "col-center");

    let header = "";
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const colWidth = defaultColWidth(col, i);
      const isSorted = sortState.key === col.key;
      const indicator = isSorted ? (sortState.dir === "asc" ? "▲" : "▼") : "↕";
      header += `<th
        class="${alignClass(col.align)} sortable has-tooltip${isSorted ? " is-sorted" : ""}"
        data-table="${tableName}"
        data-sort-key="${col.key}"
        data-tooltip="${escapeHtml(col.tooltip)}"
        title="${escapeHtml(col.tooltip)}"
        tabindex="0"
        style="width:${colWidth};min-width:${colWidth}"
        aria-sort="${isSorted ? (sortState.dir === "asc" ? "ascending" : "descending") : "none"}"
      ><span class="th-inner"><span class="th-label">${escapeHtml(col.label)}</span><span class="sort-indicator">${indicator}</span></span></th>`;
    }

    let body = "";
    for (const row of sortedRows) {
      const rowClass = rowClassFn ? rowClassFn(row) : "";
      const rowAttrs = rowAttrsFn ? rowAttrsFn(row) : "";
      body += `<tr${rowClass ? ` class="${rowClass}"` : ""}${rowAttrs}>`;
      for (const col of columns) {
        body += col.render(row);
      }
      body += "</tr>";
    }

    const tableWidth = `${tableWidthRem(columns)}rem`;
    return `<table class="data-table" style="width:${tableWidth};min-width:${tableWidth}">${buildColgroup(columns)}<thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`;
  }

  function bindTableSort(containerId, tableName, getColumns, getSortState, onSort) {
    const container = document.getElementById(containerId);
    const rerender = onSort || (() => {});

    container.addEventListener("click", (event) => {
      const header = event.target.closest("th[data-sort-key]");
      if (!header || header.dataset.table !== tableName) return;

      const columns = getColumns();
      const sortState = getSortState()[tableName];
      const key = header.dataset.sortKey;
      if (sortState.key === key) {
        sortState.dir = sortState.dir === "asc" ? "desc" : "asc";
      } else {
        const col = getColumn(columns, key);
        sortState.key = key;
        sortState.dir = (col.type === "string" || col.type === "rank") ? "asc" : "desc";
      }
      rerender();
    });

    container.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const header = event.target.closest("th[data-sort-key]");
      if (!header || header.dataset.table !== tableName) return;
      event.preventDefault();
      header.click();
    });
  }

  window.GC = {
    REPO,
    onPages,
    CROSS_TYPES,
    CROSS_TYPE_LABELS,
    pagesBase,
    assetUrl,
    dailyCsvPaths,
    escapeHtml,
    loadText,
    parseCsv,
    crossClass,
    crossTypeLabel,
    normalizeTicker,
    displayRecommendation,
    probabilityPercent,
    isConsider,
    recommendationRank,
    recommendationLabel,
    formatVolume,
    formatMarketCap,
    formatPrice,
    formatProbability,
    formatPercent,
    formatUpdatedAt,
    crossSignal,
    numericField,
    archiveStartDateFromManifest,
    archiveStartHint,
    tickerHistoryUrl,
    renderTickerLink,
    dashboardDayUrl,
    manifestDatesForArchive,
    getColumn,
    sortRows,
    buildColgroup,
    renderDataTable,
    bindTableSort,
  };
})();

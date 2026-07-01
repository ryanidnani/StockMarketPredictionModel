/**
 * Load shared assets with cache keys from data/manifest.json updated_at.
 */
(function () {
  let versionPromise = null;
  let sharedScriptPromise = null;

  function fetchVersion() {
    if (versionPromise) return versionPromise;

    versionPromise = fetch(`data/manifest.json?nocache=${Date.now()}`)
      .then((response) => {
        if (!response.ok) throw new Error("manifest");
        return response.json();
      })
      .then((manifest) => {
        const version = encodeURIComponent(manifest.updated_at || String(Date.now()));
        window.__GC_ASSET_V = version;
        document.querySelectorAll("[data-gc-stylesheet]").forEach((link) => {
          const base = link.getAttribute("data-gc-stylesheet");
          if (base) link.href = `${base}?v=${version}`;
        });
        return version;
      })
      .catch(() => {
        const version = String(Date.now());
        window.__GC_ASSET_V = version;
        return version;
      });

    return versionPromise;
  }

  function loadSharedScript(version) {
    if (window.GC) return Promise.resolve(version);
    if (sharedScriptPromise) return sharedScriptPromise.then(() => version);

    sharedScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `shared.js?v=${version}`;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    }).then(() => version);

    return sharedScriptPromise;
  }

  window.GCAssetBoot = {
    ready() {
      return fetchVersion().then(loadSharedScript);
    },
  };

  fetchVersion();
})();

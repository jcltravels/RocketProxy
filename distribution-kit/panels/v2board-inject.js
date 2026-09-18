/*!
 * Rocket Proxy — subscription-URL finder for V2Board / Xboard dashboards.
 *
 * V2Board and Xboard ship their user dashboard as a compiled SPA (Umi/React).
 * There is no template file containing the subscription URL, so there is
 * nothing to paste a button *next to* — which is why this file exists.
 *
 * Rather than guess at minified CSS class names that change on every theme
 * build, this finds the subscription URL by its **shape**, which is defined by
 * the panel's own routing and is therefore stable:
 *
 *   V2Board : https://host/api/v1/client/subscribe?token=<token>
 *   Xboard  : https://host/<subscribe_path>/<token>     (default path: "s")
 *
 * Install: drop this file at
 *
 *   V2Board : public/theme/v2board/assets/custom.js
 *   Xboard  : theme/Xboard/assets/custom.js
 *
 * and it is loaded automatically. See ../panels/v2board-xboard.md.
 *
 * Requires rocket-proxy-button.js to be loaded first.
 */
(function () {
  'use strict';

  var hasDOM = typeof window !== 'undefined' && typeof document !== 'undefined';
  var BRAND = (hasDOM && window.ROCKET_PROXY_BRAND) ||
              (hasDOM && document.title) || 'My Nodes';
  var LABEL = (hasDOM && window.ROCKET_PROXY_LABEL) || 'Open in Rocket Proxy';

  /**
   * Recognises a subscription URL.
   *
   * Both forms are anchored on the panel's own route, not on markup:
   *  - V2Board's literal `/api/v1/client/subscribe?token=`
   *  - Xboard's `/<path>/<token>` where the token is a long opaque string.
   *
   * The Xboard branch requires >= 16 token characters so that ordinary site
   * links (`/user/plan`, `/#/order`) cannot match.
   */
  var PATTERNS = [
    /https?:\/\/[^\s"'<>]+\/api\/v1\/client\/subscribe\?token=[A-Za-z0-9._-]{8,}/,
    /https?:\/\/[^\s"'<>]+\/[A-Za-z0-9_-]{1,12}\/[A-Za-z0-9._-]{16,}/
  ];

  function findSubscriptionURL(text) {
    if (!text) return null;
    for (var i = 0; i < PATTERNS.length; i++) {
      var m = String(text).match(PATTERNS[i]);
      if (m) return m[0];
    }
    return null;
  }

  /** Candidate nodes that could be showing the URL, cheapest first. */
  function scan() {
    var inputs = document.querySelectorAll('input[value], textarea');
    for (var i = 0; i < inputs.length; i++) {
      var hit = findSubscriptionURL(inputs[i].value);
      if (hit) return { url: hit, anchor: inputs[i] };
    }
    var links = document.querySelectorAll('a[href]');
    for (var j = 0; j < links.length; j++) {
      var lhit = findSubscriptionURL(links[j].getAttribute('href'));
      if (lhit) return { url: lhit, anchor: links[j] };
    }
    return null;
  }

  function insert(found) {
    if (document.getElementById('rocket-proxy-injected')) return true;
    if (!window.RocketProxy) {
      console.error('rocket-proxy: load rocket-proxy-button.js before this file.');
      return true; // stop retrying; this will not fix itself
    }

    var a = document.createElement('a');
    a.id = 'rocket-proxy-injected';
    a.className = 'rocket-proxy-button';
    a.textContent = LABEL;
    a.setAttribute('data-rocket-proxy', '');
    a.setAttribute('data-url', found.url);
    a.setAttribute('data-name', BRAND);
    a.style.cssText =
      'display:inline-flex;align-items:center;gap:.5em;margin:8px 4px;' +
      'padding:.55em 1.1em;border-radius:8px;background:#0d7f8a;color:#fff;' +
      'font-weight:600;text-decoration:none;cursor:pointer;';

    // Place it after the control that already shows the URL, so it lands
    // wherever the theme happens to put the subscription block.
    var host = found.anchor.parentNode;
    if (!host) return false;
    host.insertBefore(a, found.anchor.nextSibling);

    window.RocketProxy.attachAll(document);
    return true;
  }

  /**
   * The SPA renders after this script runs, and re-renders on navigation, so a
   * single pass at load would find nothing. Observe instead, and give up after
   * a while rather than watching the DOM forever.
   */
  function start() {
    var found = scan();
    if (found && insert(found)) return;

    var observer = new MutationObserver(function () {
      var hit = scan();
      if (hit && insert(hit)) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(function () { observer.disconnect(); }, 30000);
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = { findSubscriptionURL: findSubscriptionURL };
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

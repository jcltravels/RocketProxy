/*!
 * Rocket Proxy — "Open in Rocket Proxy" import button.
 *
 * Drop this file on your panel and mark up a link:
 *
 *   <a data-rocket-proxy
 *      data-url="https://panel.example.com/sub/USER_TOKEN"
 *      data-name="Example Net">Open in Rocket Proxy</a>
 *   <script src="rocket-proxy-button.js"></script>
 *
 * No dependencies, no build step, no network calls. MIT licensed.
 *
 * What it emits:
 *
 *   rocketproxy://import?url=<percent-encoded>&name=<display>&type=<sub|link>
 *
 * `url` is required. `name` and `type` are optional; `type` is inferred from
 * the scheme when omitted (http/https => subscription, anything else => a
 * single share link), so you normally do not need to set it.
 *
 * The app always shows a confirmation sheet before importing, and importing
 * never connects. You cannot use this button to silently reconfigure someone.
 */
(function (global) {
  'use strict';

  var APP_STORE_URL = 'https://apps.apple.com/app/id6785291194';
  var PLAY_PACKAGE = 'uk.co.jcltravels.rocketproxy';
  var PLAY_URL = 'https://play.google.com/store/apps/details?id=' + PLAY_PACKAGE;
  var SITE_URL = 'https://jcltravels.co.uk/rocket-proxy';

  /**
   * Schemes the app will accept inside `url`.
   *
   * Kept in step with `DeepLinkImportRequest.ALLOWED_SCHEMES` on both clients.
   * Checking here means a panel admin with a typo sees it in their browser
   * console while they are still editing the template, instead of shipping a
   * button that opens the app and shows an error to every customer.
   */
  var ALLOWED_SCHEMES = [
    'http', 'https',
    'ss', 'shadowsocks', 'ssr', 'vmess', 'vless', 'trojan', 'trojan-go',
    'hysteria', 'hysteria2', 'hy2', 'tuic', 'juicity', 'anytls', 'snell',
    'brook', 'socks', 'socks5', 'ssocks', 'ssocks5',
    'ssh', 'mieru', 'mierus', 'openconnect', 'anyconnect',
    'wireguard', 'wg',
    'sub'
  ];

  /** Matches the app's own bound, so a name is never silently truncated later. */
  var MAX_NAME_LENGTH = 64;

  function schemeOf(url) {
    var i = url.indexOf('://');
    return i === -1 ? '' : url.slice(0, i).toLowerCase();
  }

  /**
   * Builds the `rocketproxy://import?…` URL.
   *
   * Throws on anything the app would reject, rather than returning a link that
   * fails on the customer's phone.
   */
  function buildImportLink(options) {
    if (!options || !options.url) {
      throw new Error('rocket-proxy: "url" is required.');
    }
    var url = String(options.url).trim();
    var scheme = schemeOf(url);
    if (!scheme) {
      throw new Error('rocket-proxy: "' + url + '" has no scheme; expected e.g. https://…');
    }
    if (ALLOWED_SCHEMES.indexOf(scheme) === -1) {
      throw new Error('rocket-proxy: scheme "' + scheme + '://" is not importable.');
    }

    // A subscription is a bearer token in a URL. Over http:// it is readable by
    // every hop in between, so the app warns the user. Warn the admin here too,
    // while it is still cheap to fix.
    if (scheme === 'http' && global.console && console.warn) {
      console.warn('rocket-proxy: subscription URL is plain http://. Customers ' +
                   'will see a security warning before import. Use https://.');
    }

    // encodeURIComponent once. The app percent-decodes exactly once, so a
    // password containing a literal "%" survives intact.
    var link = 'rocketproxy://import?url=' + encodeURIComponent(url);

    if (options.name) {
      var name = String(options.name).replace(/\s+/g, ' ').trim();
      if (name.length > MAX_NAME_LENGTH) {
        name = name.slice(0, MAX_NAME_LENGTH);
      }
      if (name) {
        link += '&name=' + encodeURIComponent(name);
      }
    }
    if (options.type) {
      link += '&type=' + encodeURIComponent(String(options.type).toLowerCase());
    }
    return link;
  }

  function platform() {
    var ua = (global.navigator && navigator.userAgent) || '';
    if (/android/i.test(ua)) return 'android';
    // iPadOS 13+ reports as a Mac; the touch-point count separates them.
    if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
    if (/macintosh/i.test(ua) && global.navigator &&
        navigator.maxTouchPoints > 1) return 'ios';
    return 'desktop';
  }

  /**
   * Android's own mechanism for "open the app, or go here instead".
   *
   * Chrome resolves this without a timer and without an error page, which is
   * why Android is handled separately rather than sharing the iOS path.
   */
  function androidIntentURL(deepLink) {
    var rest = deepLink.slice('rocketproxy://'.length);
    return 'intent://' + rest +
           '#Intent;scheme=rocketproxy' +
           ';package=' + PLAY_PACKAGE +
           ';S.browser_fallback_url=' + encodeURIComponent(PLAY_URL) +
           ';end';
  }

  /**
   * Navigates to the app, falling back to the store if it does not open.
   *
   * iOS has no equivalent of `browser_fallback_url`, so the fallback is a
   * timer that is cancelled when the page is backgrounded — which is the
   * observable signal that the app did launch. Without the cancel, a customer
   * who *has* the app returns from the import to find the App Store open.
   */
  function openImport(deepLink) {
    var target = platform();

    if (target === 'android') {
      global.location.href = androidIntentURL(deepLink);
      return;
    }
    if (target === 'desktop') {
      global.location.href = SITE_URL;
      return;
    }

    var settled = false;
    function cancel() { settled = true; }

    global.addEventListener('pagehide', cancel, { once: true });
    global.addEventListener('blur', cancel, { once: true });
    if (global.document) {
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) cancel();
      }, { once: true });
    }

    global.location.href = deepLink;

    global.setTimeout(function () {
      if (!settled && global.document && !document.hidden) {
        global.location.href = APP_STORE_URL;
      }
    }, 1500);
  }

  /** Wires every `[data-rocket-proxy]` element on the page. */
  function attachAll(root) {
    var scope = root || global.document;
    if (!scope || !scope.querySelectorAll) return;

    var nodes = scope.querySelectorAll('[data-rocket-proxy]');
    for (var i = 0; i < nodes.length; i++) {
      (function (el) {
        if (el.__rocketProxyBound) return;
        el.__rocketProxyBound = true;

        var link;
        try {
          link = buildImportLink({
            url: el.getAttribute('data-url'),
            name: el.getAttribute('data-name'),
            type: el.getAttribute('data-type')
          });
        } catch (err) {
          // Leave the element inert and say why. A dead button is better than
          // one that opens the app onto an error.
          if (global.console && console.error) console.error(err.message);
          el.setAttribute('aria-disabled', 'true');
          return;
        }

        // Set href so the link is copyable, shows a target on hover, and works
        // if scripting is disabled after load.
        if ('href' in el) el.href = link;

        el.addEventListener('click', function (event) {
          event.preventDefault();
          openImport(link);
        });
      })(nodes[i]);
    }
  }

  var api = {
    buildImportLink: buildImportLink,
    openImport: openImport,
    attachAll: attachAll,
    ALLOWED_SCHEMES: ALLOWED_SCHEMES
  };

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  global.RocketProxy = api;

  if (global.document) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { attachAll(); });
    } else {
      attachAll();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);

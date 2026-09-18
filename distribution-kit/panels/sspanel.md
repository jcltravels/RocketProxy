# SSPanel-UIM

Verified against **SSPanel-UIM** `c2ab300` (2026-09-11).

## Good news: this is the easiest of the three

SSPanel does not want an HTML snippet. Its client buttons are **data-driven** —
you add a client by appending one JSON object to a config file, and the panel
generates the download and import buttons for you, on the right platforms, with
the right icons.

So ignore the `<a>` tag in the main README. You do not need
`rocket-proxy-button.js` either.

## Add Rocket Proxy

Edit **`config/client_display.json`** and add this object to the `clients`
array:

```json
{
  "name": "Rocket Proxy",
  "description": "Ad blocking and network rules, with per-app routing",
  "format": "v2ray",
  "importUrl": "rocketproxy://import?url={sub}&name={name}",
  "platforms": {
    "iOS": {
      "storeUrl": "https://apps.apple.com/app/id6785291194"
    },
    "macOS": {
      "storeUrl": "https://apps.apple.com/app/id6785291194"
    },
    "Android": {
      "storeUrl": "https://play.google.com/store/apps/details?id=uk.co.jcltravels.rocketproxy"
    }
  }
}
```

That is the whole integration. No template edits, no rebuild, no restart beyond
your normal deploy.

## What each field does

From `src/Services/Config/ClientConfig.php`:

```php
'importUrl' => str_replace(
    ['{sub}', '{name}'],
    [$sub, rawurlencode($name)],
    $data['importUrl'] ?? $client['importUrl']
),
'downloadUrl' => $data['storeUrl'] ??
    (isset($data['ext']) ? ($r2 ? '/user' : '') . '/clients/' . (...) . ".{$data['ext']}" : ''),
'isAppStore' => isset($data['storeUrl']),
```

* **`{sub}`** becomes the customer's universal subscription URL. `{name}` becomes
  your site name, `rawurlencode`d.
* **`format`** is appended to the subscription URL for the *copy* button
  (`subUrl = universalSubUrl + '/' + format`), so pick a format your panel has
  enabled. It does **not** affect `importUrl`.
* **`storeUrl`** makes the download button point at a store instead of a file
  served from `/clients/`, and is what you want for all three platforms. Use
  `ext` + `file` instead only if you host the APK yourself.
* **`platforms`** controls which OSes see the entry. SSPanel auto-detects the
  visitor's OS and promotes matching clients into the "recommended" section.
* Per-platform overrides are supported: any platform object may carry its own
  `importUrl` or `desc`, which wins over the client-level value.

### One caveat worth knowing

`{sub}` is substituted **raw** — unlike `{name}`, it is not URL-encoded. It
therefore lands unencoded in the `url=` parameter of the deep link.

This is fine in practice: SSPanel subscription URLs are path-based
(`https://host/link/<token>`) with no query string, and Rocket Proxy parses that
correctly. But if you have customised your subscription URL to contain a `&` or
a `#`, the link will truncate at that character. If so, keep the `&`/`#` out of
the subscription URL rather than trying to pre-encode it — SSPanel has no hook
to encode it for you.

## Quota and expiry work already

SSPanel sets the `Subscription-Userinfo` header on its subscription responses,
so remaining data and expiry show up in Rocket Proxy with no further work.

## Where the buttons appear

`resources/views/tabler/user/index.tpl` — the user dashboard. The static markup
is just empty containers (`<div id="recommended-clients">`, around lines
196-216); the entries are rendered into them at runtime by the page's own
JavaScript from the JSON above.

This is why there is nothing to "paste next to the Shadowrocket button" — there
is no Shadowrocket button in the template. A grep for `shadowrocket`, `clash`,
`quantumult` or `surge` across `resources/views/` returns **zero matches**. It
is all `client_display.json`.

## Themes

SSPanel uses **Smarty 5** (Twig is in `composer.json` but no `.twig` templates
ship). Templates live in `resources/views/<theme>/`, and **exactly one theme
ships: `tabler`** — set by `$_ENV['theme'] = 'tabler';` in
`config/.config.example.php:100`. A logged-in user's `theme` column can override
it (`src/Services/View.php:49-58`), but with one theme shipped this rarely
matters.

If you ever do edit a template: Smarty treats `{` and `}` as delimiters, so any
HTML containing literal braces — inline CSS, JS object literals, `@media` rules
— must be wrapped in `{literal}…{/literal}`. There is **no** admin setting for
injecting custom HTML or JavaScript in SSPanel; template editing is the only
route, which is another reason to stick with `client_display.json`.

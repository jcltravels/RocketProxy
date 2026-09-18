# V2Board and Xboard

Verified against **V2Board** `0ca4762` (2023-06-04 — see the maintenance note
below) and **Xboard** `4f48e61` (2026-08-30).

## Read this first: there is no template to paste into

Both panels ship the user dashboard as a **compiled SPA** (Umi/React). The page
your customer sees — including the box showing their subscription URL — lives
inside minified `umi.js`. There is no `.blade.php` or `.tpl` containing that
markup, so the "paste this `<a>` tag next to the existing buttons" approach used
for Marzban **does not work here**.

What both panels *do* give you is a supported hook for injecting your own HTML
and JavaScript without rebuilding the frontend. There are two, and the second is
the one you want.

### Hook 1 — the `custom_html` theme setting

Both panels expose a "自定义页脚HTML" (custom footer HTML) field under
**Admin → Theme configuration**, rendered **unescaped** into `<body>`:

* V2Board — declared in `public/theme/v2board/config.json` (`field_name:
  custom_html`), rendered at `public/theme/v2board/dashboard.blade.php:58`,
  just after the `<div id="root">` mount point.
* Xboard — declared in `theme/Xboard/config.json`, rendered at
  `theme/Xboard/dashboard.blade.php:36-37`, after `<div id="app">`.

> Note the mount point differs: `#root` on V2Board, `#app` on Xboard.

Because this HTML is emitted **outside** the SPA's mount point and **before**
the app bundles load, anything you put here renders as a page-wide footer
element — *not* inline next to the subscription URL. It is fine for a persistent
"Open in Rocket Proxy" bar. It cannot place a button inside the subscription
card.

### Hook 2 — `custom.js` (recommended)

Both panels auto-load a custom script if the file exists, *after* the SPA
bundles:

```blade
@if (file_exists(public_path("/theme/{$theme}/assets/custom.js")))
    <script src="/theme/{{$theme}}/assets/custom.js?v={{$version}}"></script>
@endif
```
— `dashboard.blade.php:62-64`

This runs late enough to see the rendered app, which is what you need.

## Install

Copy two files into your theme's `assets` directory:

| Panel | Directory |
|---|---|
| V2Board | `public/theme/v2board/assets/` |
| Xboard | `theme/Xboard/assets/` |

1. [`../rocket-proxy-button.js`](../rocket-proxy-button.js)
2. [`v2board-inject.js`](./v2board-inject.js) — rename it to **`custom.js`**

`custom.js` is auto-loaded but `rocket-proxy-button.js` is not, so load it from
the top of `custom.js`, or simply concatenate the two files:

```bash
cat rocket-proxy-button.js v2board-inject.js > custom.js
```

Set your brand name by defining a global before them (in `custom_html`, or at
the top of `custom.js`):

```html
<script>window.ROCKET_PROXY_BRAND = 'Example Net';</script>
```

If you do not, the button uses the page title.

> ### ⚠️ Xboard: edit `theme/`, never `public/theme/`
> Xboard keeps themes at the **project root** `theme/`, and copies a theme into
> `public/theme/<name>/` on first request if that directory is missing
> (`routes/web.php:48-54`). `public/theme/` is therefore a *generated copy* —
> edits to it are silently lost the next time it is regenerated. Put your files
> in `theme/Xboard/assets/` and delete `public/theme/Xboard/` to force a
> refresh.

## How the button finds the subscription URL

`v2board-inject.js` does **not** use CSS selectors — minified class names change
on every theme build. It matches the subscription URL by its shape, which is
fixed by the panel's own routing:

| Panel | Subscription URL form |
|---|---|
| V2Board | `https://host/api/v1/client/subscribe?token=<token>` |
| Xboard | `https://host/<subscribe_path>/<token>` — default path `s` |

It watches the DOM (the SPA renders after scripts run), finds the first input or
link holding a URL of that shape, and inserts the button beside it. If nothing
matches within 30 seconds it stops rather than observing forever.

The canonical source of that URL is `GET /api/v1/user/getSubscribe`, which
returns it as `data.subscribe_url` — built by `Helper::getSubscribeUrl()`
(`app/Utils/Helper.php:111-118`) and **always absolute**, so it is safe to hand
straight to the app.

> **If you serve multiple subscription domains** — V2Board picks one at
> *random* per call (`rand()` in `getSubscribeUrl`). That is fine here, because
> the button reads whatever URL is on the page at that moment. Do not cache the
> generated deep link anywhere.

## Quota and expiry: a real gap on V2Board

Rocket Proxy shows remaining data and expiry from the `subscription-userinfo`
response header. **V2Board only sets it on 4 of its 14 protocol handlers** —
`Clash.php:26`, `ClashMeta.php:25`, `Stash.php:24`, `QuantumultX.php:23`. It is
**not** set by `General.php`, `Shadowrocket.php`, `V2rayN.php`, `V2rayNG.php`,
`Surge.php`, `Loon.php` and the rest.

So on stock V2Board your customers will import fine but may see no quota. The
one-line fix, in `app/Http/Controllers/Client/Protocols/General.php`:

```php
header("subscription-userinfo: upload={$user['u']}; download={$user['d']}; total={$user['transfer_enable']}; expire={$user['expired_at']}");
```

**Xboard has largely closed this gap** — including on `General` — so on Xboard
quota display works without changes.

## Maintenance status of V2Board

V2Board's last code commit is **2023-06-04** and its last repository activity of
any kind is **2024-03-19**. It is not formally archived, but it has had no
development in roughly three years and carries no deprecation notice.

Everything here works on it today. If you are choosing between the two, Xboard
is actively maintained (last commit 2026-08-30) and has already fixed the quota
header gap above.

# Add a 1-Click "Open in Rocket Proxy" button to your panel

Your customers paste subscription URLs by hand. They paste them wrong, they
paste them into the wrong app, and then they open a ticket.

This kit replaces that with one button. It is a single `<a>` tag and one
JavaScript file, it has no dependencies, and it takes about five minutes to
install on Marzban, V2Board/Xboard or SSPanel-UIM.

```html
<a data-rocket-proxy
   data-url="https://panel.example.com/sub/USER_TOKEN"
   data-name="Example Net">Open in Rocket Proxy</a>

<script src="/static/rocket-proxy-button.js"></script>
```

That is the whole integration. Everything below is detail.

---

## What the button does

Tapping it opens Rocket Proxy, which shows a confirmation sheet naming your
panel, and — if the customer agrees — imports the subscription and keeps it
updated. If Rocket Proxy is not installed, the customer goes to the app store
instead of a dead link.

You do not need our permission, an API key, or an account to use this. There is
no callback to us and no tracking pixel.

### Two things it deliberately does not do

* **It does not import silently.** The confirmation sheet always appears, and it
  names the host the servers will come from. A link is something anyone can put
  on any page, so it can never reconfigure someone's app without them agreeing.
* **It does not connect.** Importing adds servers. Choosing one and connecting
  stays a separate, deliberate action by the customer.

If you were hoping for a button that connects your customer in one tap, this
is not that, and no version of it will be.

---

## Install

### 1. Host the script

Copy [`rocket-proxy-button.js`](./rocket-proxy-button.js) into wherever your
panel serves static files, and include it once per page:

```html
<script src="/static/rocket-proxy-button.js"></script>
```

It is ~4 KB, MIT-licensed, and has no dependencies. You are welcome to inline it
or bundle it instead. Do not hotlink it from someone else's domain.

### 2. Mark up the link

```html
<a data-rocket-proxy
   data-url="{{ subscription_url }}"
   data-name="{{ site_name }}">Open in Rocket Proxy</a>
```

| Attribute | Required | Meaning |
|---|---|---|
| `data-rocket-proxy` | yes | Marks the element. No value needed. |
| `data-url` | yes | The subscription URL, or a single `vmess://`/`vless://`/`ss://`/… share link. |
| `data-name` | no | What the customer sees the subscription called. Use your brand. Trimmed to 64 characters. |
| `data-type` | no | `sub` or `link`. Almost never needed — see [Types](#types). |

Put your own template variable in `data-url`. **Do not** URL-encode it yourself;
the script does that, and encoding it twice is the single most common way to
break this button.

### 3. Check it

Open [`examples/demo.html`](./examples/demo.html) on a phone. Three buttons: a
subscription, a single node, and a deliberately invalid link that must render
greyed out. The page prints the exact links it generated.

---

## The link format

If you would rather not use the script — for a Telegram bot, an email, or a QR
code — build the URL yourself:

```
rocketproxy://import?url=<percent-encoded>&name=<display-name>&type=<sub|link>
```

Only `url` is required. Percent-encode it **once** (`encodeURIComponent` in
JavaScript, `urllib.parse.quote(u, safe='')` in Python, `urlencode()` in PHP).

```
rocketproxy://import?url=https%3A%2F%2Fpanel.example.com%2Fsub%2FUSER_TOKEN&name=Example%20Net
```

This URL works anywhere a link works: a QR code, a Telegram button, an email.
The `<a>`-tag approach only exists to add the app-store fallback, which a bare
link cannot do.

### Types

`type` is inferred from the scheme and you can normally leave it out:

* `http://` or `https://` → treated as a **subscription**: fetched now and
  refreshed later.
* anything else → treated as a **single share link**, parsed directly.

Set it explicitly only when your subscription endpoint does not look like one —
for example a `sub://`-wrapped URL that should still be fetched as a
subscription.

### Accepted schemes

`http`, `https`, `sub`, `ss`, `shadowsocks`, `ssr`, `vmess`, `vless`, `trojan`,
`trojan-go`, `hysteria`, `hysteria2`, `hy2`, `tuic`, `juicity`, `anytls`,
`snell`, `brook`, `socks`, `socks5`, `ssocks`, `ssocks5`, `ssh`, `mieru`,
`mierus`, `openconnect`, `anyconnect`, `wireguard`, `wg`.

`file://` and `content://` are refused on purpose: honouring them would let any
web page make the app read a local file off the customer's device.

### Subscription formats we parse

Point `data-url` at your existing subscription endpoint — whatever it already
serves. Rocket Proxy handles:

* base64 share-link lists (the default nearly every panel emits)
* plain-text share-link lists
* Clash / Clash.Meta YAML
* sing-box JSON
* Surge INI

It also reads the `subscription-userinfo` header, so your customers see their
remaining quota and expiry date inside the app. If you already set that header
for other clients, you do not need to do anything.

---

## Panel-specific instructions

* [Marzban](./panels/marzban.md)
* [V2Board and Xboard](./panels/v2board-xboard.md)
* [SSPanel-UIM](./panels/sspanel.md)

---

## Troubleshooting

**The button is greyed out and does nothing.**
The URL was rejected. Open the browser console: the script logs exactly which
rule it broke. Usually the scheme is missing (`panel.example.com/sub/x` instead
of `https://panel.example.com/sub/x`).

**The app opens but says the link has no URL to import.**
`data-url` rendered empty — normally a template variable that is not in scope
where you pasted the button.

**The app opens but the address looks mangled, with `%253A` in it.**
You encoded the URL before handing it to the script. Pass the raw URL.

**The customer sees a warning about a plain-text address — or on Android, a
refusal.**
Your subscription URL is `http://`. A subscription URL is a bearer token: anyone
on the path can read it and use it. The two platforms differ, and not by our
choice — Android refuses cleartext at the OS level from Android 9, so the app
declines the address and says so, while iOS warns and continues. Either way the
fix is the same: serve the subscription over HTTPS.

**Nothing happens on desktop.**
Correct. There is no desktop deep link, so the button goes to the download page.
Desktop customers copy the URL as they always have.

---

## Localised copies

* [简体中文](./README.zh-CN.md)
* [Русский](./README.ru.md)

## Licence

MIT. Use it, change it, ship it, no attribution required.

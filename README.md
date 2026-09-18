# Rocket Proxy — a free, Shadowrocket-compatible proxy client (iPhone · iPad · Mac · Apple TV · Android)

> **Your internet, your rules.** A fast, modern proxy client for **iPhone, iPad, Mac, Apple TV
> and Android** that imports your existing Shadowrocket / v2ray / Xray configs — and reads
> **Clash / Stash / Mihomo YAML in full**, proxy-groups and rules included, with no
> converter. **Free to try — with a demo server built in**, so there's no up-front
> purchase and no bring-your-own-server needed to start. 21 languages.

[![App Store](https://img.shields.io/badge/App_Store-Download-0D96F6?logo=apple&logoColor=white)](https://apps.apple.com/app/id6785291194) [![macOS DMG](https://img.shields.io/badge/macOS-Free_direct_download-333333?logo=apple&logoColor=white)](https://github.com/jcltravels/RocketProxy/releases/latest) [![Android APK](https://img.shields.io/badge/Android-Free_APK_download-3DDC84?logo=android&logoColor=white)](https://github.com/jcltravels/RocketProxy/releases/latest) [![Google Play](https://img.shields.io/badge/Google_Play-Get_the_app-414141?logo=googleplay&logoColor=white)](https://play.google.com/store/apps/details?id=uk.co.jcltravels.rocketproxy) [![Platforms](https://img.shields.io/badge/platform-iOS%20%7C%20iPadOS%20%7C%20macOS%20%7C%20tvOS%20%7C%20Android-lightgrey)](https://github.com/jcltravels/RocketProxy/releases/latest) [![Rules & docs: MIT](https://img.shields.io/badge/rules_&_docs-MIT-green.svg)](./LICENSE)

[**⬇️ Download on the App Store**](https://apps.apple.com/app/id6785291194) · [**🖥️ Free macOS app (DMG)**](https://github.com/jcltravels/RocketProxy/releases/latest) · [**🤖 Free Android app (APK)**](https://github.com/jcltravels/RocketProxy/releases/latest) · [**▶️ Get it on Google Play**](https://play.google.com/store/apps/details?id=uk.co.jcltravels.rocketproxy) · [🌐 Website](https://jcltravels.co.uk/rocketproxy/) · [📖 Setup guide](https://jcltravels.co.uk/rocketproxy/guide.html)

### 🖥️ Free native macOS app — no App Store account needed

The Mac app is also distributed directly, **completely free and unrestricted**: all 36 protocol
configurations, no account, no time limit, no ads, no telemetry. Signed with a Developer ID and
notarised by Apple. Universal binary — **Intel and Apple silicon** — macOS 13 or later.

**[⬇️ Download Rocket Proxy for macOS](https://github.com/jcltravels/RocketProxy/releases/latest)**
 · [direct from our site](https://jcltravels.co.uk/rocketproxy/#download)

### 🤖 Free Android app — direct APK download

The Android app is free and unrestricted too. Get it from **Google Play** for automatic
updates, or take the **direct APK download** published here if you can't reach the Play
Store. **Android 8.0 or later, 64-bit
(arm64) devices** — that's every Android phone sold for years, but it does mean the app
won't install on an old 32-bit-only handset.

[![Get it on Google Play](assets/google-play-badge.png)](https://play.google.com/store/apps/details?id=uk.co.jcltravels.rocketproxy)

**[⬇️ Download Rocket Proxy for Android](https://github.com/jcltravels/RocketProxy/releases/latest)**
 · [direct from our site](https://jcltravels.co.uk/rocketproxy/#download)

On first install Android will say the source isn't allowed — tap **Settings**, permit
installs from your browser, then go back and install. The APK is signed with our own
key and registered with Google's Android developer verification, so it installs without
the "unverified developer" block.

**Check what you downloaded before you install it.** If you're in a place where a
download might be tampered with, this is the step that matters:

```sh
shasum -a 256 RocketProxy-*.apk          # compare against SHA256SUMS.txt in the release
apksigner verify --print-certs RocketProxy-*.apk
# expected SHA-256 certificate digest:
# 96:12:4F:3C:20:E5:05:E0:82:28:2B:AD:42:94:57:30:10:62:65:6D:56:32:0E:59:EE:59:4D:E9:2F:C4:A2:09
```

> **Heads-up if you also use the Play build.** This APK and the Play build are signed with
> different keys, so **they cannot update one another**. Pick one and stay with it —
> switching means uninstalling first, and an uninstall does not carry your servers and
> rules across, so export them before you switch.

**One thing the Android app does that the Apple apps can't: per-app routing.** Choose
exactly which apps go through the tunnel (an allow list) or which ones bypass it (a deny
list). This is Android-only by platform design — on iPhone, iPad and Apple TV, per-app
VPN is something only a managed-device (MDM) profile can do, so no App Store app can
offer it. Android also has always-on / auto-connect and a network policy (Wi-Fi only,
mobile only, or any).

Premium high-speed servers, and the iPhone / iPad / Apple TV apps, are on the
[App Store](https://apps.apple.com/app/id6785291194).

---

## Why Rocket Proxy if you already use Shadowrocket or Stash?

All three are capable clients that run across the Apple ecosystem. The differences are
in how you get started, what's included, and what config format each one speaks natively:

| | Shadowrocket | Stash | **Rocket Proxy** |
|---|:---:|:---:|:---:|
| iPhone · iPad · Apple TV | ✅ | ✅ | ✅ |
| Mac app | ✅ | ✅ **sold separately** | ✅ **free** |
| Price to start | $2.99 up front | $5.99 up front (iOS) | **Free to try** |
| Mac app cost | included | £12/yr, or £48 lifetime | **£0 — free, notarized, universal** |
| Server included to start | ❌ (bring your own) | ❌ (bring your own) | ✅ **free demo built in** |
| Managed premium servers | ❌ (client only) | ❌ (client only) | ✅ (UK + more coming) |
| Referral — give a month, get a month | ❌ | ❌ | ✅ |
| Imports SS / SSR / VMess / VLESS / Trojan | ✅ | ✅ | ✅ |
| Imports **Clash / Stash / Mihomo YAML** | converter needed | ✅ (its native format) | ✅ **native, in full** |
| Protocols: SS-2022, REALITY, Hysteria2, TUIC, WireGuard | ✅ | ✅ | ✅ |
| Track record | long-established | 4.4★, 1,200+ ratings | **new — we're the newcomer here** |

<sub><b>Sourced:</b> prices from the App Store (US) and <a href="https://stash.ws/macos/pricing">stash.ws/macos/pricing</a>, checked 2026-08-06; Stash macOS pricing was discounted at the time of checking. <b>Scope:</b> this table compares the <i>Apple</i> apps, which is where all three have the longest history — it is not a comparison of anyone's Android app. Shadowrocket and Stash both have Android offerings of their own, so having an Android app is not something we claim as a point of difference. <b>To be explicit about what is <i>not</i> a difference:</b> Stash reads Clash YAML because it <i>is</i> Stash's native format, and Stash ships iOS, tvOS and macOS apps too — we don't claim an edge on either. Shadowrocket uses a Surge-style <code>.conf</code> format and does not parse Clash YAML, so a subconverter is the usual route there. Where we do differ is cost and what's bundled. Both Shadowrocket and Stash are good, mature apps with far longer track records than ours — this table is about what's included, not about quality.</sub>

**The one-liner:** Rocket Proxy is a free-to-try client that **reads your Shadowrocket, Clash or Stash config as-is** and **comes with its own servers** — try it in one tap, with no up-front purchase, no separate Mac licence, and no hunting for a server.

---

## Coming from Clash or Stash? Bring the whole YAML

Importing a Clash config often means the server list survives and the rest doesn't.
Rocket Proxy reads **Clash / Stash / Mihomo YAML in full** — the parts that
actually took you time to get right come across and keep working:

- **`proxy-groups`** — `select`, `url-test`, `fallback`, `load-balance` and `relay`,
  with `filter` / `exclude-filter` / `exclude-type` regex and `include-all`
- **`rules`** — `DOMAIN`, `DOMAIN-SUFFIX`, `DOMAIN-KEYWORD`, `IP-CIDR`, `IP-CIDR6`,
  `GEOIP`, `GEOSITE`, `SRC-IP-CIDR`, `SRC-PORT`, `DST-PORT`, `RULE-SET`, `MATCH`,
  plus logical `AND` / `OR` / `NOT` and the `no-resolve` modifier
- **`rule-providers` and `proxy-providers`** — so your subscription keeps updating itself
- **`dns`** — carried across and editable, not silently replaced

Point it at your existing subscription URL, open a `.yaml` file, paste it, or scan
a QR code. You get an **import report** listing exactly what came across — and if
something didn't, what it was.

> **Available now** on macOS, iPhone, iPad and Android.
>
> **On Android, two things are not ported yet:** `rule-providers` / `proxy-providers`
> (so a subscription won't refresh itself there — the nodes and rules import fine, they
> just don't auto-update), and `GEOSITE` rules. Everything else in the list above works.
> If you rely on providers, use the macOS or iOS app for now.

Walkthrough: **https://jcltravels.co.uk/guides/import.html**

---

## Supported protocols

Shadowsocks · Shadowsocks-2022 · ShadowsocksR · VMess · VLESS (+ REALITY / XTLS-Vision) · Trojan · Hysteria · Hysteria2 · TUIC · Juicity · Snell · Brook · Mieru · WireGuard · AmneziaWG · OpenConnect · SOCKS5 · HTTP

With gRPC, WebSocket, HTTPUpgrade, xHTTP, mKCP and QUIC transports, plus
ShadowTLS, Cloak, SimpleObfs, v2ray-plugin and kcptun obfuscation.

Import a single `ss://` / `vmess://` / `vless://` / `trojan://` link, scan a QR code, subscribe to a remote config URL, or hand it a **Clash / Stash YAML** file — the same links and configs you already use elsewhere.

---

## Try it in one tap

1. Install **Rocket Proxy** — [App Store](https://apps.apple.com/app/id6785291194) (iPhone / iPad / Mac / Apple TV), or the free [macOS DMG / Android APK](https://github.com/jcltravels/RocketProxy/releases/latest).
2. Open the app — a **free shared demo server is built in**. Just tap **Connect** to try it.
3. For everyday use, import your own server (any `ss://` / `vmess://` / `vless://` / `trojan://` link or subscription), or unlock **Premium** for dedicated high-speed servers.

> The demo server is provisioned inside the app for trying Rocket Proxy. Add your own server or Premium for everyday use.

---

## How to import an existing config

Rocket Proxy reads the same formats you already have:

- **Single node:** paste any `ss://`, `ssr://`, `vmess://`, `vless://`, `trojan://`, `hysteria2://`, `tuic://` URI.
- **Clash / Stash / Mihomo YAML:** a `.yaml` file, a pasted document, or a subscription URL that serves YAML — parsed natively, no subconverter. [Details above](#coming-from-clash-or-stash-bring-the-whole-yaml).
- **QR code:** scan directly in-app.
- **Subscription:** add your provider's remote subscription URL — it auto-updates.
- **Sub-Store:** point Rocket Proxy at your [Sub-Store](https://github.com/sub-store-org/Sub-Store) URI/Shadowrocket subscription output — it imports directly.
- **Rules:** DOMAIN / DOMAIN-SUFFIX / DOMAIN-KEYWORD / IP-CIDR / GEOIP / FINAL, plus remote rule-set modules.

Rocket Proxy detects the format for you, so the same **Add** box takes a single
link, a subscription URL or a YAML config without you having to say which it is.

See the full walkthrough (with screenshots): **https://jcltravels.co.uk/rocketproxy/guide.html**

---

## We publish our DNS-leak test method, not just the claim

Every proxy client says it doesn't leak DNS. We publish **how we checked** — a
packet capture on the physical interface, and the control test that proves the
check can detect a leak at all (VPN down: 29 DNS packets captured; VPN up: 0,
with the capture proven live). **36 of 36** protocol/transport combinations
verified clean, with a `tcpdump` recipe so you can reproduce it yourself.

**https://jcltravels.co.uk/guides/dns-leak-testing.html**

---

## Free vs Premium

- **Free:** import unlimited of your own servers + a built-in demo server to try the app.
- **Premium:** dedicated high-speed servers (UK, more regions coming), IPv4 + IPv6, no shared limits.
- **Referral:** give a friend a month, get a month free — [share your code](https://jcltravels.co.uk/).

---

## Ready-to-use rules

A one-tap **[starter config](./rules/)** (ad-block + China-direct + proxy, auto-updating):
```
https://raw.githubusercontent.com/jcltravels/RocketProxy/main/rules/RocketProxy-Starter.conf
```

## Panel operators: add a 1-click import button

If you run a **Marzban**, **V2Board/Xboard** or **SSPanel-UIM** panel, your
customers currently copy subscription URLs by hand — and paste them wrong.

The **[distribution kit](./distribution-kit/)** replaces that with one button:
a single `<a>` tag plus one ~4 KB dependency-free script, about five minutes to
install.

```html
<a data-rocket-proxy
   data-url="https://panel.example.com/sub/USER_TOKEN"
   data-name="Example Net">Open in Rocket Proxy</a>

<script src="/static/rocket-proxy-button.js"></script>
```

No API key, no account, no callback to us, no tracking. MIT-licensed. It never
imports silently and never connects on its own — the app always shows a
confirmation sheet naming the host first.

Per-panel guides: [Marzban](./distribution-kit/panels/marzban.md) ·
[V2Board & Xboard](./distribution-kit/panels/v2board-xboard.md) ·
[SSPanel-UIM](./distribution-kit/panels/sspanel.md).
Also in [简体中文](./distribution-kit/README.zh-CN.md) and
[Русский](./distribution-kit/README.ru.md).

## Guides & tutorials

- [Set up a proxy on Mac & Apple TV](https://gist.github.com/jcltravels/2e9ae2092c706c5f99b648addd726ce4)
- [Import a VLESS/Trojan/VMess/Shadowsocks link on iPhone](https://gist.github.com/jcltravels/1a877b20ef69cad1016d332df37e21b1)
- [Free Shadowrocket-compatible client (2026)](https://gist.github.com/jcltravels/7aeba40110d0def2b03be4b920eb8851)

---

## Support & bug reports

This repo is also the official support hub — the **Report an Issue** button inside
the app links straight here.

- 🐞 **Report a bug:** [open an issue](https://github.com/jcltravels/RocketProxy/issues/new/choose)
- 💡 **Request a feature:** [open an issue](https://github.com/jcltravels/RocketProxy/issues/new/choose)
- 💬 **Ask a question:** [Discussions](https://github.com/jcltravels/RocketProxy/discussions)
- ✉️ **Email:** jcltravels@gmail.com

When reporting a bug, please include your **device, OS version, app version, and steps
to reproduce** — it makes a fix dramatically faster.

## Privacy

We collect no data. Your traffic stays on your device.
See the [Privacy Policy](https://jcltravels.co.uk/rocketproxy/privacy.html).

## Links

- App Store: https://apps.apple.com/app/id6785291194
- Free macOS app + Android APK: https://github.com/jcltravels/RocketProxy/releases/latest
- Google Play: https://play.google.com/store/apps/details?id=uk.co.jcltravels.rocketproxy
- Website: https://jcltravels.co.uk/
- Setup guide: https://jcltravels.co.uk/rocketproxy/guide.html
- Support: https://jcltravels.co.uk/support.html
- Privacy: https://jcltravels.co.uk/privacy.html

<sub>Topics: `shadowrocket` `shadowrocket-alternative` `v2ray` `xray` `vless` `vmess` `trojan` `shadowsocks` `hysteria2` `tuic` `reality` `proxy` `ios` `macos` `tvos` `apple-tv` `android` `apk` `clash` `stash`</sub>

<sub>Google Play and the Google Play logo are trademarks of Google LLC. Apple, the Apple logo, iPhone, iPad, Mac and Apple TV are trademarks of Apple Inc. App Store is a service mark of Apple Inc.</sub>

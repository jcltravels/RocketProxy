# Get listed in "Supported Providers"

The kit in [`README.md`](./README.md) covers the direction most panels need: a
button on *your* page that hands a subscription to Rocket Proxy.

This document covers the other direction. Rocket Proxy's **+ → Supported
Providers** screen is a wall of providers, shown to every user at the moment
they are looking for somewhere to get a server. A listed provider gets its name,
its logo and a **Connect with …** button on that screen. Tapping it opens *your*
sign-in page, and when the customer signs in, your page hands the subscription
straight back — so the whole journey from "I need a proxy" to "it is configured"
never leaves the two of us.

There is no fee and no API key. What it costs you is one landing page.

---

## The handshake

We open your `connectURL` in the customer's **system browser** — not a web view
inside our app, because they are about to type a password and they should be
able to see the address bar and use their own password manager.

We append two parameters:

```
https://you.example.com/connect?client=rocketproxy&callback=rocketproxy%3A%2F%2Fimport
```

| Parameter  | Value                  | Meaning                                             |
|------------|------------------------|-----------------------------------------------------|
| `client`   | `rocketproxy`          | Which app sent this customer. Use it to skip the "which app do you use?" step. |
| `callback` | `rocketproxy://import` | Where to send them back.                             |

If your entry has a partner tag, `ref=<tag>` is appended too. If your URL
already sets one of these, **yours wins** — we never overwrite a parameter you
put there yourself.

Nothing else is sent. There is no device identifier, no install id, and no
advertising identifier, because we do not have any to send.

### What your page does

1. Sign the customer in, or sign them up.
2. Produce their subscription URL, exactly as you would for any other client.
3. Send them back:

```
rocketproxy://import?url=<url-encoded subscription URL>&name=<url-encoded your name>
```

In HTML that is one line:

```html
<a href="rocketproxy://import?url=https%3A%2F%2Fyou.example.com%2Fsub%2FTOKEN&name=Example%20Net">
  Finish setup in Rocket Proxy
</a>
```

Or immediately, once the subscription exists:

```js
const url  = encodeURIComponent(subscriptionUrl);
const name = encodeURIComponent('Example Net');
location.href = `rocketproxy://import?url=${url}&name=${name}`;
```

Read `callback` rather than hardcoding `rocketproxy://import`; it is there so
this page keeps working if the scheme ever changes.

### What happens on our side

The customer lands back in Rocket Proxy on a confirmation sheet naming your
host. If they agree, the subscription is imported and kept up to date.

**The confirmation sheet is not removable.** A link is something anyone can put
on any page, so no link can reconfigure someone's app without them saying yes.
Do not build a flow whose next step assumes the import already happened.

Importing also **does not connect**. Adding servers and choosing to route
traffic through one stay separate, deliberate actions.

---

## Requirements to be listed

1. **HTTPS.** The app refuses to open anything else from the directory. That is
   enforced in code (`ProviderConnectLink`), not by review, so an `http://`
   entry does not render as a broken button — it does not render at all.
2. **The page works on a phone**, in a browser with no extensions, for a
   customer who is not signed in yet.
3. **The subscription URL you return is that customer's own**, revocable by
   them from your panel.
4. **No silent redirect back.** If the customer abandons sign-in, leave them on
   your page.

## What we put in the catalogue

Your entry is four visible things — name, one-line summary, the setup steps, and
your connect URL — plus a brand colour as `#RRGGBB`.

**We do not host your logo, and we do not fetch it.** Artwork either ships
inside the app binary or your entry renders as a tile in your brand colour with
your initials. That is not a limitation we are working around: pulling a logo
from your server would tell you — and every CDN in front of you — that a
specific device was browsing the provider list before its owner chose anything,
which is a tracking beacon in the onboarding of a privacy app. It would also
render as a grey box on exactly the censored networks where our users live.

To have artwork bundled, send an SVG; it goes in the next release rather than
appearing immediately, which is the honest trade for it never phoning home.

## Testing your page

With Rocket Proxy installed, open your connect URL with the parameters attached
and complete a sign-in. You should end on our confirmation sheet with your name
on it.

If nothing happens when you redirect, the usual cause is that the redirect did
not come from a user gesture — some mobile browsers drop custom-scheme
navigations that are not. Render the link and let the customer tap it.

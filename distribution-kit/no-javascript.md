# The button without JavaScript

Some panels will not let you add a script. A Telegram bot has no DOM at all. An
email client strips JavaScript on principle. This page gives you the same
1-click import as a plain `<a href>` your server renders — no script file, no
`data-` attributes, nothing to host.

```html
<a href="rocketproxy://import?url=https%3A%2F%2Fpanel.example.com%2Fsub%2FUSER_TOKEN&name=Example%20Net">
  Open in Rocket Proxy
</a>
```

That link works today. The rest of this page is about the two things the script
was doing for you that a bare link does not, and what you can do about each.

---

## What you give up, honestly

### 1. The customer without the app gets nothing

A `rocketproxy://` link on a device with no Rocket Proxy installed does nothing
visible on iOS, and shows an error page on some Android browsers. The script
existed mainly to turn that dead end into the app store.

**On Android you can get the fallback back, with no JavaScript at all.** Chrome
resolves `intent://` URLs itself, including the store redirect:

```html
<a href="intent://import?url=https%3A%2F%2Fpanel.example.com%2Fsub%2FUSER_TOKEN&name=Example%20Net#Intent;scheme=rocketproxy;package=uk.co.jcltravels.rocketproxy;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Duk.co.jcltravels.rocketproxy;end">
  Open in Rocket Proxy
</a>
```

**On iOS there is no equivalent.** iOS has no `browser_fallback_url`; the script
fakes it with a timer it cancels when the page is backgrounded, and a timer
needs JavaScript. There is no way around this, so do not let anyone tell you
there is.

The practical answer for a no-JS page is to put the link and a download link
next to each other and let the customer pick:

```html
<a href="rocketproxy://import?url=...&name=...">Open in Rocket Proxy</a>
<br>
<small>Don't have it yet?
  <a href="https://apps.apple.com/app/id6785291194">iPhone / iPad</a> &middot;
  <a href="https://play.google.com/store/apps/details?id=uk.co.jcltravels.rocketproxy">Android</a>
</small>
```

This is not a worse experience than a dead link. It is a better one than the
copy-paste it replaces.

### 2. Nothing checks the URL before the customer taps

The script refuses a URL whose scheme is not on the accepted list and greys the
link out, so a broken template variable is visible on the page instead of
turning into a confusing error inside the app.

Server-side you get this for free by checking once, at render time — see the
snippets below. The app validates again regardless; the check is there to fail
on your page rather than on your customer's phone.

---

## Encode it once

This is the one thing that actually goes wrong. The subscription URL goes in a
query parameter, so it must be percent-encoded **exactly once**. Encoding it
twice produces `%253A` and the app receives a mangled address.

| Language | Use | Not |
|---|---|---|
| PHP | `rawurlencode($url)` | `htmlentities`, `urlencode` for the path |
| Python | `urllib.parse.quote(url, safe='')` | `quote(url)` — the default `safe='/'` leaves slashes raw |
| JavaScript | `encodeURIComponent(url)` | `encodeURI` — it does not encode `&` or `=` |
| Go | `strings.ReplaceAll(url.QueryEscape(u), "+", "%20")` | `url.Values.Encode()` — emits `+` for spaces |
| Ruby | `ERB::Util.url_encode(u)` | `CGI.escape` — emits `+` for spaces |
| Jinja / Django | `{{ url\|urlencode }}` | building the string by hand |
| Blade | `{{ rawurlencode($url) }}` | `{{ urlencode($url) }}` in a path |

`safe=''` in Python and `rawurlencode` in PHP matter: the defaults leave `/`
unescaped, which is survivable, but being explicit is how you stop the next
person breaking it.

### The `+` trap

Half the "wrong" column above is one mistake wearing different hats. PHP's
`urlencode`, Ruby's `CGI.escape` and Go's `url.QueryEscape` all encode a space
as `+`, because that is correct for an HTML **form body**. A `rocketproxy://`
link is not a form body.

A raw `+` is the one input where the two platforms genuinely disagree, and
neither of them lets the app opt out. Measured, not assumed:

| You send | iPhone shows | Android shows | Agree? |
|---|---|---|---|
| `name=Example%20Net` | `Example Net` | `Example Net` | yes |
| `name=Example%2BNet` | `Example+Net` | `Example+Net` | yes |
| `name=Example+Net` | `Example+Net` | `Example Net` | **no** |

Android's `Uri.getQueryParameter` form-decodes, so `+` becomes a space. iOS's
`URLComponents` does not, so `+` stays a `+`. One link, two different names.

**It is worse in `url` than in `name`.** Android applies the same decoding to
the subscription address, and a base64 subscription token routinely contains a
`+`. Send `.../sub/ab+cd` and an Android customer's app fetches `.../sub/ab cd`
— a broken subscription, not a cosmetic difference.

So the rule is simple and it removes the disagreement entirely:

* a space → **`%20`**, never `+`
* a literal plus → **`%2B`**, never a bare `+`

Every encoder in the table above does this if you pick the right function. Both
rows are verified against both platforms and pinned by tests on each, so they
will not quietly change under you.

---

## Snippets

Each of these renders the plain link. Substitute your own template variables.

### PHP (SSPanel-UIM, V2Board, Xboard)

```php
<?php
$sub  = 'https://panel.example.com/sub/' . $user->token;
$name = 'Example Net';

$scheme = strtolower(parse_url($sub, PHP_URL_SCHEME) ?? '');
if (in_array($scheme, ['http', 'https', 'sub'], true)) {
    $href = 'rocketproxy://import?url=' . rawurlencode($sub)
          . '&name=' . rawurlencode(mb_substr($name, 0, 64));
    echo '<a href="' . htmlspecialchars($href, ENT_QUOTES) . '">Open in Rocket Proxy</a>';
}
```

`htmlspecialchars` on the way into the attribute is not optional: the name is
your data, but the subscription URL is a token and the page is HTML.

### Python / Flask / Django

```python
from urllib.parse import quote, urlsplit

def rocket_proxy_link(sub_url: str, name: str = "") -> str:
    if urlsplit(sub_url).scheme.lower() not in {"http", "https", "sub"}:
        raise ValueError(f"refusing to build a link for {sub_url!r}")
    href = "rocketproxy://import?url=" + quote(sub_url, safe="")
    if name:
        href += "&name=" + quote(name[:64], safe="")
    return href
```

In a Django template, render it with `{{ href }}` inside `href="..."` —
autoescaping handles the attribute for you.

### Jinja, inline

```jinja
<a href="rocketproxy://import?url={{ sub_url|urlencode }}&name={{ site_name|truncate(64, true, '')|urlencode }}">
  Open in Rocket Proxy
</a>
```

### Laravel Blade

```blade
@php
    $href = 'rocketproxy://import?url=' . rawurlencode($subUrl)
          . '&name=' . rawurlencode(Str::limit($siteName, 64, ''));
@endphp
<a href="{{ $href }}">Open in Rocket Proxy</a>
```

### Go

```go
// QueryEscape encodes a space as "+", which is correct for a form body and
// wrong here: iOS leaves that "+" literal, so the subscription is named
// "Example+Net" on an iPhone and "Example Net" on Android. Worse, a "+" inside
// a base64 subscription token becomes a space on Android and breaks the fetch.
// "%20" is unambiguous on both.
func esc(s string) string {
    return strings.ReplaceAll(url.QueryEscape(s), "+", "%20")
}

func rocketProxyLink(sub, name string) string {
    href := "rocketproxy://import?url=" + esc(sub)
    if name != "" {
        href += "&name=" + esc(name)
    }
    return href
}
```

Do **not** reach for `url.Values{}.Encode()` here. It is the obvious choice and
it fails twice: it emits `+` for spaces as above, and it sorts the keys, so you
get `?name=…&url=…`. The app does not care about order, but it makes your links
stop matching the documented form, which makes them harder to eyeball.

### Telegram bot

Telegram will not open a custom scheme from an inline keyboard button, so send
it as a link in the message body with Markdown:

```python
bot.send_message(
    chat_id,
    f"[Open in Rocket Proxy]({rocket_proxy_link(sub_url, 'Example Net')})",
    parse_mode="Markdown",
)
```

Telegram's in-app browser hands custom schemes to the OS, so this opens the app
directly on both platforms.

### QR code

The same string is what you encode. Nothing extra:

```python
import qrcode
qrcode.make(rocket_proxy_link(sub_url, "Example Net")).save("import.png")
```

A customer scanning this with the system camera gets the confirmation sheet.
This is the best option for a desktop panel page, because the deep link does
nothing on desktop but the phone scanning the screen is the phone you want.

---

## Email

Send the link, not the button. Every mail client strips JavaScript, and most
strip `intent://` too, so use the plain `rocketproxy://` form and put the store
links underneath exactly as in the snippet at the top.

Some corporate mail gateways rewrite every href for click-tracking and will
mangle a custom scheme into a dead `https://` redirect. If your customers report
the link not working only from one employer's mail, that is what happened —
include the raw URL as text as well so they can copy it.

---

## Still the same link

Everything on this page produces the URL documented in
[the main README](./README.md#the-link-format). The script is a convenience
wrapper around it, not a different protocol, so a link you build by hand and a
link the script builds are byte-identical and both keep working.

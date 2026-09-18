# Brand assets

Four files. Use whichever fits; you do not need to ask us first.

| File | What it is | Use it for |
|---|---|---|
| [`rocket-proxy-mark.svg`](./rocket-proxy-mark.svg) | Colour mark, scalable | Next to the button on a **dark** page |
| [`rocket-proxy-mark-mono.svg`](./rocket-proxy-mark-mono.svg) | Single colour, inherits `currentColor` | Anywhere, especially small or on a **light** page |
| [`rocket-proxy-icon-512.png`](./rocket-proxy-icon-512.png) | The real app icon | Download pages, store-style listings |
| `rocket-proxy-icon-{128,256,1024}.png` | Same icon, other sizes | Pick the one nearest your render size |

## Which one

**Use the monochrome SVG unless you have a reason not to.** It inherits the
surrounding text colour, so it sits correctly in a light panel and a dark one
from a single file, and it stays legible at 16px.

The colour mark has a **white fuselage**. On a white page the rocket vanishes
and you are left with three faint rings. That is not a bug to report; it is what
the file is, and it is why the monochrome version exists.

The PNGs are the shipped app icon — a rendered, glowing image. It is beautiful
at 512px and mud at 24px. Do not shrink it to sit beside a button; that is what
the marks are for.

## The marks are not a trace of the icon

They reuse the icon's two identifying elements — the rocket and the concentric
signal rings — in the icon's palette. They are deliberately not an attempt to
reproduce the rendered icon as vectors, because a flat trace of a glowing render
is worse than both.

The monochrome mark drops the rings entirely. At the size it is used, three
concentric hairlines collapse into a smudge.

## Inline them

Both SVGs are about 1 KB. Pasting the file straight into your template is
usually better than another request:

```html
<a href="rocketproxy://import?url=...&amp;name=..."
   style="display:inline-flex;align-items:center;gap:.5em">
  <svg viewBox="0 0 64 64" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" clip-rule="evenodd"
          d="M32 4 C38.4 12.6 41 23 41 31.5 L41 46 L23 46 L23 31.5 C23 23 25.6 12.6 32 4 Z
             M32 18.5 A5.5 5.5 0 1 0 32 29.5 A5.5 5.5 0 1 0 32 18.5 Z"/>
    <path d="M23 35 L15 45 L15 50 L23 46 Z"/>
    <path d="M41 35 L49 45 L49 50 L41 46 Z"/>
    <path d="M32 47 C28.6 51.5 27.8 55.2 32 60 C36.2 55.2 35.4 51.5 32 47 Z"/>
  </svg>
  Open in Rocket Proxy
</a>
```

`aria-hidden="true"` on the inlined copy is deliberate: the link text already
says what it is, so announcing the mark as well makes a screen reader say
"Rocket Proxy Open in Rocket Proxy". The standalone files keep their `<title>`
because there they may be the only label.

## What you may do

Resize it, recolour the monochrome one, put it on a button, put it in an email,
put it in a Telegram message. No attribution required, no API key, no account.

## What we ask

* **Do not imply we endorse your service.** "Open in Rocket Proxy" is a
  statement about what the button does. "Rocket Proxy recommended" is not, and
  is not true.
* **Do not restyle the mark into a different logo** — no stretching to a
  non-square aspect, no swapping the rocket for something else while keeping the
  rings.
* **Do not hotlink these files from our repository.** Copy them into your own
  static assets, the same as the script.

## Clear space and size

Keep at least half the mark's height clear on every side, and do not render the
monochrome mark below 16px or the colour mark below 24px. Below those the window
and the fins stop resolving and it reads as a blob.

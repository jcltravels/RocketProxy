# Marzban

Verified against **Marzban v0.8.4**.

Marzban renders the customer-facing subscription page from a Jinja2 template you
are meant to override. That page already shows the subscription URL and a set of
copy buttons — the Rocket Proxy button goes right next to them.

## 1. Enable custom templates

In `/opt/marzban/.env`, uncomment:

```ini
CUSTOM_TEMPLATES_DIRECTORY="/var/lib/marzban/templates/"
SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"
```

Then copy the stock template out of the container so you are editing a real
starting point rather than a blank file:

```bash
mkdir -p /var/lib/marzban/templates/subscription
docker cp marzban-marzban-1:/code/app/templates/subscription/index.html \
          /var/lib/marzban/templates/subscription/index.html
```

Put `rocket-proxy-button.js` next to it and serve it, or inline the script in
the template — the subscription page is a single self-contained HTML file, so
inlining is usually less work than wiring up static hosting.

## 2. Set the URL prefix — this one is mandatory

This is the step people skip, and the button silently produces a broken link.

`subscription_url` is built as:

```python
self.subscription_url = f"{url_prefix}/{XRAY_SUBSCRIPTION_PATH}/{token}"
```

`url_prefix` is `XRAY_SUBSCRIPTION_URL_PREFIX`, which is **empty by default**.
So out of the box `user.subscription_url` is a *relative* path like
`/sub/eyJ1c2Vy…`. A browser resolves that fine on your own page — but the deep
link hands the string to a phone app, which has no idea what host it came from,
and the import fails.

Set it, with the scheme, and no trailing slash:

```ini
XRAY_SUBSCRIPTION_URL_PREFIX = "https://panel.example.com"
```

Then recreate the container. `restart` alone does **not** re-read `.env`:

```bash
cd /opt/marzban && docker compose up -d --force-recreate
```

> **If your prefix contains `*`** — Marzban replaces it with a fresh random hex
> salt on *every render*, to spread subscriptions across wildcard subdomains.
> That is a legitimate setup, and the button handles it, because it reads
> whatever `user.subscription_url` says at render time. Just never cache or
> hard-code the resulting URL anywhere.

## 3. Add the button

In `subscription/index.html`, inside the `{% if user.status == 'active' %}`
block — so it does not appear for expired or disabled customers:

```html
<a class="rocket-proxy-button"
   data-rocket-proxy
   data-url="{{ user.subscription_url }}"
   data-name="Example Net">Open in Rocket Proxy</a>
```

The template context is only `{"user": user}` — a `UserResponse`. So `user.*` is
all you have; there is no `request` or `settings` object to reach for. Useful
fields: `user.username`, `user.status`, `user.subscription_url`, `user.links`,
`user.data_limit`, `user.used_traffic`, `user.expire`.

Using `user.username` in `data-name` is tempting but wrong — the customer sees
their own username, not who it is from. Put your brand there.

## 4. Quota and expiry come for free

Marzban already sends the `subscription-userinfo` header:

```python
"subscription-userinfo": "; ".join(
    f"{key}={val}" for key, val in get_subscription_user_info(user).items()
)
```

Rocket Proxy reads it, so the customer sees remaining data and expiry date in
the app without you changing anything.

## 5. Check it

Open a real customer's subscription page on a phone and tap the button. Expected:
Rocket Proxy opens, names your panel in the confirmation sheet, and after
"Add" the nodes appear on the Servers tab.

If the sheet shows a host you do not recognise, or no host at all, go back to
step 2.

## Note on the Marzban API

Rocket Proxy imports from your subscription URL, not from the Marzban API, and
that is deliberate. Marzban has no end-user login: `POST /api/admin/token` is the
only credential endpoint, panel "users" have no password at all, and an admin
token is unscoped — it can delete every user on your panel. No customer-facing
app should ever hold one, so Rocket Proxy does not ask for one.

The subscription URL is the right integration surface here: it is per-customer,
it is already how every other client consumes Marzban, and revoking it is one
click in your admin UI.

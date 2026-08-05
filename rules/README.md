# Starter rules

A ready-to-use config for **[Rocket Proxy](https://apps.apple.com/app/id6785291194)** (also works in Shadowrocket). Sensible defaults:

- 🚫 **Block ads/trackers** (auto-updating reject list)
- 🇨🇳 **China-direct** (domestic traffic stays direct — no wasted proxy hops)
- 🌍 **Everything else → your proxy**
- 🔒 IPv6 enabled, DoH (Cloudflare + Google) to reduce DNS leaks

## Import
1. Copy this raw URL:
   `https://raw.githubusercontent.com/jcltravels/RocketProxy/main/rules/RocketProxy-Starter.conf`
2. In **Rocket Proxy → Config → add remote config**, paste the URL, download.
3. Add your own server (or connect the built-in free demo), pick it, connect.
4. Enable **auto-update** so the rule lists refresh themselves.

## Rule matching reference
`DOMAIN`, `DOMAIN-SUFFIX`, `DOMAIN-KEYWORD`, `IP-CIDR`, `GEOIP`, `RULE-SET`, `FINAL`.

Clash / Stash YAML configs additionally bring across `GEOSITE`, `IP-CIDR6`,
`SRC-IP-CIDR`, `SRC-PORT`, `DST-PORT`, logical `AND` / `OR` / `NOT`, and the
`no-resolve` modifier — along with `proxy-groups`, `rule-providers` and
`proxy-providers`. Drop a `.yaml` in the same **Add** box; no conversion needed.

> Rule lists are pulled from well-maintained community sources and updated automatically.
> Want a whitelist (proxy-all-except-CN) variant? Open an issue.

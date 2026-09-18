# 为你的面板添加「一键导入 Rocket Proxy」按钮

用户手动复制订阅链接，很容易粘错地方、粘进错误的客户端，然后就来开工单。

这套工具把这件事变成一个按钮：一个 `<a>` 标签加一个 JavaScript 文件，没有任何依赖。
在 Marzban、V2Board/Xboard 或 SSPanel-UIM 上安装大约需要五分钟。

```html
<a data-rocket-proxy
   data-url="https://panel.example.com/sub/USER_TOKEN"
   data-name="Example Net">一键导入 Rocket Proxy</a>

<script src="/static/rocket-proxy-button.js"></script>
```

集成到此为止，以下都是细节。

---

## 按钮做什么

点击后打开 Rocket Proxy，应用会弹出确认框并显示你的站点名称；用户同意后导入订阅，
之后自动保持更新。如果没有安装 Rocket Proxy，用户会被带到应用商店，而不是一个打不开的链接。

使用它不需要我们的授权、API 密钥或账号。没有任何回调，也没有统计代码。

### 两件它刻意不做的事

* **不会静默导入。** 确认框始终出现，并明确显示节点将从哪个主机获取。任何人都可以把链接
  放在任何网页上，所以它永远不能在用户不知情的情况下改动配置。
* **不会自动连接。** 导入只是添加节点。选择哪个节点、何时连接，仍然由用户自己决定。

如果你想要的是「一键直接连上」的按钮，这个不是，将来也不会是。

---

## 安装

### 1. 放置脚本

把 [`rocket-proxy-button.js`](./rocket-proxy-button.js) 复制到面板的静态文件目录，
每个页面引入一次：

```html
<script src="/static/rocket-proxy-button.js"></script>
```

文件约 4 KB，MIT 许可，无依赖。你也可以内联或打包进自己的资源。请不要直接外链他人域名上的副本。

### 2. 写按钮

```html
<a data-rocket-proxy
   data-url="{{ subscription_url }}"
   data-name="{{ site_name }}">一键导入 Rocket Proxy</a>
```

| 属性 | 必填 | 含义 |
|---|---|---|
| `data-rocket-proxy` | 是 | 标记元素，无需赋值 |
| `data-url` | 是 | 订阅链接，或单条 `vmess://`、`vless://`、`ss://` 等分享链接 |
| `data-name` | 否 | 用户看到的订阅名称，填你的品牌名，超过 64 字符会被截断 |
| `data-type` | 否 | `sub` 或 `link`，几乎不需要手动指定 |

`data-url` 里直接填你自己的模板变量。**不要自己做 URL 编码** —— 脚本会处理，
重复编码是这个按钮最常见的失效原因。

### 3. 自检

用手机打开 [`examples/demo.html`](./examples/demo.html)。页面上有三个按钮：一个订阅、
一个单节点，以及一个故意写错的链接（应显示为灰色不可点击），并会打印出实际生成的链接。

---

## 链接格式

如果你不想用脚本 —— 比如用在 Telegram 机器人、邮件或二维码里 —— 可以自己拼：

```
rocketproxy://import?url=<百分号编码>&name=<显示名称>&type=<sub|link>
```

只有 `url` 是必填。**编码一次**即可（JavaScript 用 `encodeURIComponent`，
Python 用 `urllib.parse.quote(u, safe='')`，PHP 用 `urlencode()`）。

```
rocketproxy://import?url=https%3A%2F%2Fpanel.example.com%2Fsub%2FUSER_TOKEN&name=Example%20Net
```

这个链接在任何能放链接的地方都能用。上面的 `<a>` 标签方案只是额外提供了「未安装时跳应用商店」
的兜底，这是纯链接做不到的。

**面板不允许加脚本？** 请看[在服务端生成链接](./no-javascript.md)，其中提供了 PHP、Python、
Jinja、Blade、Go、Telegram 机器人和二维码的可直接复制的代码，并说明了那个会导致同一条链接在
iPhone 和 Android 上表现不一致的编码错误，以及如何避免。（该文档为英文版。）

### type 参数

`type` 会根据协议头自动推断，通常可以省略：

* `http://` 或 `https://` → 按**订阅**处理：立即拉取，之后定期更新。
* 其他 → 按**单条分享链接**处理，直接解析。

只有当你的订阅地址看起来不像订阅时才需要显式指定，例如用 `sub://` 包装、但仍应按订阅拉取的地址。

### 支持的协议头

`http`、`https`、`sub`、`ss`、`shadowsocks`、`ssr`、`vmess`、`vless`、`trojan`、
`trojan-go`、`hysteria`、`hysteria2`、`hy2`、`tuic`、`juicity`、`anytls`、`snell`、
`brook`、`socks`、`socks5`、`ssocks`、`ssocks5`、`ssh`、`mieru`、`mierus`、
`openconnect`、`anyconnect`、`wireguard`、`wg`。

`file://` 和 `content://` 被刻意拒绝：支持它们等于允许任意网页让应用读取用户设备上的本地文件。

### 可以解析的订阅格式

`data-url` 直接指向你现有的订阅地址即可，不必改动输出格式。Rocket Proxy 支持：

* base64 编码的分享链接列表（绝大多数面板的默认输出）
* 纯文本分享链接列表
* Clash / Clash.Meta YAML
* sing-box JSON
* Surge INI

同时会读取 `subscription-userinfo` 响应头，用户可以在应用内看到剩余流量和到期时间。
如果你已经为其他客户端设置了这个头，就不需要做任何事。

---

## 各面板的具体说明

* [Marzban](./panels/marzban.md)
* [V2Board 与 Xboard](./panels/v2board-xboard.md)
* [SSPanel-UIM](./panels/sspanel.md)

（以上文档为英文版。）

## 不使用 JavaScript

如果面板不允许加脚本，或者你是通过 Telegram 机器人、邮件、二维码来发送链接，
请看[**在服务端生成链接**](./no-javascript.md)。链接完全相同，无需托管脚本文件。

## 标志与图标

[`assets/`](./assets/README.md) 提供 SVG 图标（彩色与单色）和 PNG 应用图标，
并说明各自适用的场景。请复制到你自己的静态资源目录，不要直接外链我们的仓库。
（以上文档为英文版。）

---

## 排查

**按钮是灰的，点不动。**
链接被拒绝了。打开浏览器控制台，脚本会写明具体违反了哪条规则。最常见的是漏了协议头
（写成 `panel.example.com/sub/x` 而不是 `https://panel.example.com/sub/x`）。

**应用打开了，但提示链接里没有可导入的地址。**
`data-url` 渲染成了空值，通常是模板变量在你粘贴按钮的位置不可用。

**应用打开了，但地址里出现 `%253A` 之类的乱码。**
你在交给脚本之前自己编码过了。请传入原始地址。

**订阅名称在 iPhone 和 Android 上不一致——一边显示 `+`，另一边显示空格。**
你的服务端使用了把空格编码成 `+` 的函数（PHP 的 `urlencode`、Ruby 的 `CGI.escape`、
Go 的 `url.QueryEscape`）。Android 会把它还原成空格，iOS 不会。空格请用 `%20`，
真正的加号请用 `%2B`，详见[`+` 陷阱](./no-javascript.md#the--trap)。这比看上去更重要：
同样的解码也作用于订阅地址，所以 base64 令牌里的 `+` 在 Android 上会变成空格，导致拉取失败。

**用户看到明文传输的安全提示，在 Android 上则会被直接拒绝。**
你的订阅地址是 `http://`。订阅地址本身等同于凭证，链路上任何一方都能读取并使用它。
两个平台的表现不同，这并非我们的选择：Android 9 起系统层面就禁止明文传输，因此应用会
拒绝该地址并说明原因；iOS 则是提示后继续。无论哪一种，解决办法都一样——把订阅改用 HTTPS。

**在电脑上点击没反应。**
这是正常的。桌面端没有深度链接，按钮会跳转到下载页。电脑用户照旧复制订阅地址即可。

## 许可

MIT。随意使用、修改、分发，无需署名。

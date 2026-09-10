# 高志逸个人作品集

将 AI 产品思维与工程交付能力整合呈现的响应式个人网站。项目是纯静态多页面站点，教育、项目、实习、专业能力与兴趣爱好均有独立页面，可直接部署到 Nginx、Cloudflare Pages、GitHub Pages 或任意对象存储。

当前版本包含响应式导航、页面进入与滚动显现动效、顶部阅读进度、键盘焦点样式和“减少动态效果”系统偏好适配。项目页直接展示健身助手、智能穿戴健康 iOS App、移动机器人与 LLM-Wiki 的完整内容及现有图片。

## 本地预览

在项目目录运行：

```bash
python -m http.server 4173
```

然后访问 `http://127.0.0.1:4173/`。

## 文件结构

```text
.
├── index.html
├── education.html
├── projects.html
├── internship.html
├── skills.html
├── interests.html
├── styles.css
├── script.js
├── scripts
│   ├── optimize_project_images.py
│   ├── optimize_web_assets.py
│   └── validate_site.py
└── assets
    ├── favicon.svg
    └── projects
        ├── fitness-01.webp ... fitness-05.webp
        ├── ios01.webp ... ios03.webp
        ├── robot-01.webp
        ├── llm-wiki-workspace.webp
        ├── wgame1.webp
        ├── wa.webp
        ├── yunding.webp
        ├── mybody.webp
        └── README.md
```

## 检查

修改后可运行：

```bash
python scripts/validate_site.py
node --check script.js
```

`validate_site.py` 会检查页面结构、站内链接与资源、当前品牌文字、项目图片、首页关键链接和专业能力导航文案。

## 云服务器部署

当前线上环境：

- 域名：`www.gzyhm.xyz`；
- SSH 别名：`fitcoach`；
- 系统与 Web 服务：Ubuntu + Nginx；
- 仓库目录：`/var/www/personal-website`；
- Nginx 配置：`/etc/nginx/conf.d/personalWebsite.conf`。

本站是纯静态多页面网站，不需要 Node.js、Python Web 服务或 `/api` 代理，也不需要 SPA fallback。Nginx 直接读取 HTML、CSS、JavaScript 和图片文件。

### 首次部署

连接服务器：

```bash
ssh fitcoach
```

安装依赖并克隆仓库：

```bash
apt update
apt install -y git nginx
mkdir -p /var/www
git clone https://github.com/Ya97779/PersonalWebSite.git /var/www/personal-website
```

确认首页存在：

```bash
ls -l /var/www/personal-website/index.html
```

### Nginx 配置

创建或编辑配置：

```bash
nano /etc/nginx/conf.d/personalWebsite.conf
```

首次申请 HTTPS 证书前，可先使用以下 HTTP 配置：

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name www.gzyhm.xyz;

    root /var/www/personal-website;
    index index.html;
    charset utf-8;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache";
    }

    location ~* \.(css|js|svg|png|jpg|jpeg|webp|ico)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
        try_files $uri =404;
    }
}
```

这里不应增加 `/api`、`proxy_pass` 或指向应用端口的配置。其他子域名的 API 配置应保留在各自独立的 Nginx 文件中。

检查配置并重载：

```bash
nginx -t
systemctl reload nginx
systemctl is-active nginx
```

只有 `nginx -t` 显示 `syntax is ok` 和 `test is successful` 后才能重载。

### 配置 HTTPS

服务器已安装 Certbot 时，可直接执行：

```bash
certbot --nginx -d www.gzyhm.xyz --redirect
certbot renew --dry-run
```

Certbot 会在 `personalWebsite.conf` 中加入 443 端口、证书路径和 HTTP 到 HTTPS 的跳转。申请前应确保域名已经解析到服务器，并且安全组与系统防火墙允许 80、443 端口。

### 日常更新线上网站

本地修改提交并推送到 GitHub 后，在服务器执行：

```bash
ssh fitcoach
cd /var/www/personal-website
git status --short --branch
git fetch --prune origin
git merge --ff-only origin/main
git log -1 --oneline
```

也可以将拉取步骤简写为：

```bash
git pull --ff-only origin main
```

最终状态应为：

```text
## main...origin/main
```

静态文件拉取成功后立即生效，不需要重启或重载 Nginx。只有修改 Nginx 配置时才需要运行 `nginx -t` 和 `systemctl reload nginx`。

### 缓存与版本号

HTML 使用 `no-cache`，CSS、JavaScript 和图片缓存 7 天。修改 CSS 或 JavaScript 后，应同步增加所有 HTML 中的资源版本号，例如：

```html
<link rel="stylesheet" href="styles.css?v=20260910-4" />
<script src="script.js?v=20260910-2" defer></script>
```

替换同名图片时，建议修改文件名或添加版本参数，避免浏览器继续显示旧图。

部署后可执行以下命令检查：

```bash
curl -I https://www.gzyhm.xyz/
curl -I https://www.gzyhm.xyz/styles.css
```

### 常见问题

如果 `git status` 显示 `ahead`，先运行 `git fetch --prune origin`，因为本地的 `origin/main` 记录可能尚未刷新。

如果刷新后同时显示 `ahead` 和 `behind`，不要直接使用 `git reset --hard`。先检查分支差异：

```bash
git log --oneline --left-right --graph HEAD...origin/main
```

如果服务器连接 GitHub 超时，可稍后重试 `git fetch` 或 `git pull`。不要在尚未确认服务器本地是否有独立修改时强制覆盖工作区。

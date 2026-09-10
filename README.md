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
│   └── validate_site.py
└── assets
    ├── favicon.svg
    └── projects
        ├── fitness-01.webp ... fitness-05.webp
        ├── ios01.png ... ios03.png
        ├── robot-01.webp
        ├── llm-wiki-workspace.jpg
        ├── wgame1.png
        ├── wa.png
        ├── yunding.jpg
        ├── mybody.jpg
        └── README.md
```

## 检查

修改后可运行：

```bash
python scripts/validate_site.py
node --check script.js
```

`validate_site.py` 会检查页面结构、站内链接与资源、当前品牌文字、项目图片、首页关键链接和专业能力导航文案。

## 部署

将本目录中的文件完整上传到站点根目录即可。Nginx 的站点根目录需指向这个目录，并确保 `index.html` 是默认首页。Cloudflare Pages、GitHub Pages 等静态托管服务无需额外的构建或运行时配置。

这是静态多页面站点，不需要 SPA fallback，也不需要后端；页面之间通过普通 HTML 链接跳转。

建议上线前确认：

- 域名 DNS 已解析到服务器；
- HTTPS 证书已配置；
- 如有项目演示地址，在项目卡片中补充“查看项目”链接。

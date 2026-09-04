# 高志逸个人作品集

将 AI 产品思维与工程交付能力整合呈现的响应式个人网站。项目为纯静态实现，可直接部署到 Nginx、Cloudflare Pages、GitHub Pages 或任意对象存储。

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
├── styles.css
├── script.js
├── scripts
│   └── optimize_project_images.py
└── assets
    ├── profile.jpg
    └── projects
        ├── fitness-01.webp ... fitness-05.webp
        ├── ios-01.webp ... ios-03.webp
        ├── robot-01.webp
        └── README.md
```

## 部署

将本目录中的文件完整上传到站点根目录即可。Nginx 的站点根目录需指向这个目录，并确保 `index.html` 是默认首页。

建议上线前确认：

- 域名 DNS 已解析到服务器；
- HTTPS 证书已配置；
- 如有项目演示地址，在项目卡片中补充“查看项目”链接。

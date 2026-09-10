# 项目图片说明

当前页面使用以下 WebP 图片：

- `fitness-01.webp` 至 `fitness-05.webp`：健身助手首页、AI 对话、训练编排、周计划与动作指导；
- `ios-01.webp` 至 `ios-03.webp`：智能穿戴设备控制、运动课程与身体数据；
- `robot-01.webp`：移动机器人在 RViz 中的三维点云建图与定位效果。
- `ios01.webp` 至 `ios03.webp`：智能穿戴健康 iOS App 界面；
- `llm-wiki-workspace.webp`：LLM-Wiki 知识编译工作台；
- `wgame1.webp`、`wa.webp`、`yunding.webp`：游戏记录；
- `mybody.webp`：日常健身记录。

如需从原始 PNG 重新生成网页图片，可运行：

```bash
python scripts/optimize_project_images.py "原始图片所在目录"
```

如需重新生成当前站点使用的轻量 WebP 资源，可运行：

```bash
python scripts/optimize_web_assets.py
```

LLM-Wiki 按当前需求仅使用文字与 CSS 架构示意，不配置项目截图。

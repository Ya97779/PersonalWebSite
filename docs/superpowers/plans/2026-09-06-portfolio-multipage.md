# Multipage Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将高志逸的单页静态作品集改造成首页总览、教育经历、项目经历、实习经历、专业能力和兴趣爱好六个独立页面，并保持统一、可访问、易部署的视觉与交互。

**Architecture:** 使用六个独立 HTML 文件组成静态多页站点，共用一份 `styles.css` 和一份 `script.js`。导航使用相对路径和 `aria-current="page"` 表达当前页；项目与实习的长内容使用原生 `<details>` 按需展开，脚本只增强导航、移动菜单、展开文案和轻量显现动画。

**Tech Stack:** HTML5、CSS3（自定义属性、Grid/Flex、响应式媒体查询）、原生 JavaScript、现有 WebP/JPG/SVG 资源、`python -m http.server` 本地预览。

**Spec:** `docs/superpowers/specs/2026-09-06-portfolio-multipage-design.md`

## Global Constraints

- 继续使用普通静态文件部署，不引入后端、数据库或必须的构建服务。
- 顶部导航顺序固定为：`首页 / 教育经历 / 项目经历 / 实习经历 / 专业能力 / 兴趣爱好`。
- 每个专题拥有独立 URL，可以直接访问、刷新、复制和分享。
- 项目和实习详情默认收起，访客主动点击后再阅读完整材料。
- 不改动已确认的事实、日期、公司、学校、技术栈和成果数字。
- 所有页面共享同一份 `styles.css` 与 `script.js`，不复制图片资产。
- 桌面端和移动端均能使用，键盘焦点和减少动画设置可用。
- 不新增未经用户确认的履历、联系方式或项目数据。

---

## File Map

| File | Responsibility |
| --- | --- |
| `index.html` | 首页 Hero、个人摘要、核心成果和五个专题入口 |
| `education.html` | 南开大学、武汉理工大学和成长轨迹 |
| `projects.html` | 四个项目的摘要卡、展开详情、技术标签和项目图片 |
| `internship.html` | 两段实习经历及可展开的工作成果 |
| `skills.html` | 三层能力卡和按领域分组的能力矩阵 |
| `interests.html` | 可替换的兴趣爱好草稿内容 |
| `styles.css` | 全站颜色、字体、布局、响应式、导航和详情组件样式 |
| `script.js` | 当前导航、移动端菜单、详情文本、显现动画和 Hero 光效 |
| `README.md` | 更新后的文件结构、预览和部署说明 |
| `docs/superpowers/specs/2026-09-06-portfolio-multipage-design.md` | 已提交的设计规格 |
| `scripts/validate_site.py` | 无依赖静态 smoke test，检查页面、导航、资源和关键可访问性属性 |

## Task 1: 建立共享导航与页面骨架

**Files:**
- Modify: `index.html`
- Create: `education.html`
- Create: `projects.html`
- Create: `internship.html`
- Create: `skills.html`
- Create: `interests.html`

**Interfaces:**
- Produces six pages with the same header/footer structure for Tasks 2–5.
- Each page exposes one `<main id="main">` and a unique `<title>`/description.
- Every nav link uses one of `index.html`, `education.html`, `projects.html`, `internship.html`, `skills.html`, `interests.html`.

- [ ] **Step 1: Define the shared document shell in `index.html`**

  Keep the existing language, viewport, favicon, stylesheet, script and skip-link setup. Replace the hash-only nav with this exact order and path set:

  ```html
  <nav class="nav-links" aria-label="页面导航">
    <a href="index.html">首页</a>
    <a href="education.html">教育经历</a>
    <a href="projects.html">项目经历</a>
    <a href="internship.html">实习经历</a>
    <a href="skills.html">专业能力</a>
    <a href="interests.html">兴趣爱好</a>
  </nav>
  ```

  Change the brand target to `index.html`, give the header CTA the accessible label `联系我`, and keep the same email address.

- [ ] **Step 2: Create the five non-home HTML shells**

  Each file must contain `<!doctype html>`, `lang="zh-CN"`, UTF-8 metadata, viewport metadata, a page-specific `<title>`, a page-specific description, the favicon, `styles.css`, `script.js`, the skip link, the shared header, one `<main id="main">`, and the shared contact footer. Use `data-page` on `<body>` with values `education`, `projects`, `internship`, `skills`, and `interests`.

- [ ] **Step 3: Add page-level semantic hooks**

  Give each page a top-level `<section class="page-hero ...">` with a unique `id` and `aria-labelledby`, followed by a page-specific content section. Use `data-page="home"` on `index.html`. Keep all page headings in a single H1 per document and use H2/H3 for content hierarchy.

- [ ] **Step 4: Run the initial static smoke check**

  Run `python scripts/validate_site.py` after Task 8 creates the checker; before then use `rg -n "href=\"#(profile|journey|projects|capabilities)\"" *.html` and expect no matches in the shared navigation.

## Task 2: Rebuild the concise home overview

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes the shared shell from Task 1.
- Produces home route cards linking to the five non-home pages.

- [ ] **Step 1: Keep the existing Hero thesis and shorten the body copy**

  Preserve the `AI BUILDER` title, product-thinking/engineering-execution label, the current one-sentence positioning and email CTA. Remove the old scroll cue and replace the hash link with `href="projects.html"` and visible text `查看项目经历`.

- [ ] **Step 2: Keep a compact profile summary**

  Reuse the existing portrait and availability badge. Keep one short paragraph describing the AI master’s program, product thinking and engineering delivery; remove the full project-specific capability explanation from the home page.

- [ ] **Step 3: Add the four proof cards**

  Keep the existing verified values and labels exactly: `RAG +20%`, `AI WORKFLOW 80%`, `ROBOTICS ±3cm`, and `DELIVERY 100%`. Place them in a compact responsive grid under the profile summary.

- [ ] **Step 4: Add five route cards in the requested navigation order**

  Use the following labels, paths and one-line summaries:

  ```html
  <a class="route-card" href="education.html">教育经历<span>从自动化基础到人工智能实践</span></a>
  <a class="route-card" href="projects.html">项目经历<span>四个从问题到交付的真实系统</span></a>
  <a class="route-card" href="internship.html">实习经历<span>知识服务、Agent 与机器人软件</span></a>
  <a class="route-card" href="skills.html">专业能力<span>理解问题、设计智能、完成交付</span></a>
  <a class="route-card" href="interests.html">兴趣爱好<span>训练身体，也拆解真实世界的问题</span></a>
  ```

  The home page must not contain full project bullet lists, full timelines, or all project screenshots.

- [ ] **Step 5: Verify the home page content boundary**

  Run `rg -n "project-points|timeline-details|fitness-0|ios-0|robot-01" index.html` and expect no matches. Confirm the home page still contains the portrait, four proof values, five route links and the email CTA.

## Task 3: Build education, internship and skills content pages

**Files:**
- Modify: `education.html`
- Modify: `internship.html`
- Modify: `skills.html`

**Interfaces:**
- Consumes the shared page shell from Task 1 and timeline/card styles from Task 6.
- Produces page-specific section IDs and content that can be checked by `scripts/validate_site.py`.

- [ ] **Step 1: Implement `education.html` as a dedicated growth timeline**

  Add an H1 such as `教育经历` and the summary `从自动化基础，到人工智能实践。` Add two timeline entries with the exact dates, schools and degrees from the existing page. Use `<details class="timeline-details-panel">` for the existing scholarship, software copyright and competition details; the summary must name the school and degree so the collapsed view remains informative.

- [ ] **Step 2: Implement `internship.html` with only the two internships**

  Add the exact entries `网联清算有限公司` (`2026.07 — 2026.08`) and `璐珩智能科技有限公司` (`2025.05 — 2026.03`). Keep the existing roles and verified results. Put each existing detail list inside an accessible `<details>` element with a visible summary such as `查看工作内容与成果`.

- [ ] **Step 3: Implement `skills.html` with capability pillars and matrix**

  Reuse the existing three capability cards and copy. Add four matrix groups with only existing vocabulary: `AI 应用`, `后端工程`, `智能硬件`, `产品实践`. Use `data-skill-group` for each group so CSS can apply a consistent grid without JavaScript dependencies.

- [ ] **Step 4: Verify facts and separation**

  Run `rg -n "南开大学|武汉理工大学" internship.html` and expect no matches. Run `rg -n "网联清算|璐珩智能" education.html` and expect no matches. Run `rg -n "理解问题|设计智能|完成交付" skills.html` and expect three matches or more.

## Task 4: Build projects and interests pages

**Files:**
- Modify: `projects.html`
- Modify: `interests.html`

**Interfaces:**
- Consumes the existing project copy and image assets.
- Produces four project cards with expandable details and four replaceable interest cards.

- [ ] **Step 1: Move the four verified project cases to `projects.html`**

  Preserve project names, categories, roles, results, bullet points, tags, visual diagrams and image alt text from the current `index.html`. Keep the existing classes where they still describe the component (`project-card`, `project-copy`, `project-gallery`, `project-shot`) so the stylesheet can reuse the visual foundation.

- [ ] **Step 2: Add concise project summaries**

  Before the details of each project, show the project name, category, one-sentence outcome, key metric and tags. Use the following metric anchors: `RECALL +20%`, `BLE / HEALTH DATA`, `定位 ±3cm`, and `方案采纳率 80%`.

- [ ] **Step 3: Wrap long project material in native details**

  Put each project’s long description, bullet list and secondary gallery inside `<details class="project-details">`. Add `<summary><span>查看完整案例</span><span class="details-icon" aria-hidden="true">+</span></summary>`. The summary must be keyboard accessible without JavaScript.

- [ ] **Step 4: Create the editable interests page**

  Add four cards with the approved draft themes: `健身与训练`, `机器人与智能硬件`, `AI 工具与产品`, `知识整理`. Mark the page intro as `兴趣方向草稿` and write each card in first-person-neutral, replaceable copy derived only from existing work; do not add new claims about hobbies, awards or personal history.

- [ ] **Step 5: Verify project assets and interest labels**

  Run `rg -n "fitness-0[1-5]\.webp|ios-0[1-3]\.webp|robot-01\.webp" projects.html` and compare each path with `Get-ChildItem assets/projects`. Run `rg -n "健身与训练|机器人与智能硬件|AI 工具与产品|知识整理" interests.html` and expect one match for each.

## Task 5: Refine all page footers and contact paths

**Files:**
- Modify: `index.html`
- Modify: `education.html`
- Modify: `projects.html`
- Modify: `internship.html`
- Modify: `skills.html`
- Modify: `interests.html`

**Interfaces:**
- Produces the same contact component on every page.

- [ ] **Step 1: Add a shared contact CTA**

  Use the existing email address `1402375281@qq.com`, the visible action `聊一聊 ↗`, and the copy about finding someone who can think through and build AI. Keep the CTA on a signal-orange background and the email as a separate focusable link.

- [ ] **Step 2: Add consistent footer navigation**

  The footer must list the six page labels in the same order as the header, show `高志逸 · AI BUILDER` and `南开大学 · 人工智能`, and link the brand text to `index.html` rather than a hash anchor.

- [ ] **Step 3: Check for stale hash-only links**

  Run `rg -n "href=\"#(top|profile|journey|projects|capabilities|contact)\"" *.html`. Any remaining result must be a deliberate in-page link with a matching `id`; the shared header and footer must contain no hash-only page navigation.

## Task 6: Redesign the shared CSS around the page system

**Files:**
- Modify: `styles.css`

**Interfaces:**
- Consumes the class names and `data-page` attributes from Tasks 1–5.
- Produces responsive styles for `.page-hero`, `.route-grid`, `.route-card`, `.details-toggle`, `.project-details`, `.skill-matrix`, `.mobile-menu-toggle`, and the existing project/timeline components.

- [ ] **Step 1: Update color tokens and base typography**

  Replace the root tokens with the approved concise system:

  ```css
  --ink: #0b0d0f;
  --ink-soft: #15191c;
  --paper: #f1eee6;
  --paper-deep: #dedad0;
  --white: #fbfaf6;
  --muted: #858b8f;
  --accent: #ff5a36;
  --signal: #bdeec7;
  ```

  Retain system font stacks, improve Chinese body line-height, and keep the current anti-aliasing and selection behavior.

- [ ] **Step 2: Convert the header from absolute hero-only positioning to a shared sticky control bar**

  Style `.site-header` as `position: sticky; top: 0; z-index: 30;` with a translucent dark background and bottom rule. Use a `body[data-page]` page context for the active link. Keep a compact desktop grid and a single-row mobile layout.

- [ ] **Step 3: Add page hero and route card styles**

  Add a reusable `.page-hero` with a dark background, `PAGE / NN` eyebrow, one H1 and a constrained summary. Add `.route-grid` as a responsive grid and `.route-card` hover/focus treatment where the orange accent appears only on the active or hovered edge.

- [ ] **Step 4: Add accessible details styles**

  Style `.project-details` and `.timeline-details-panel` with a visible summary row, pointer cursor, focus ring and `details[open]` state. Use the exact icon rotation selector `.project-details[open] .details-icon { transform: rotate(45deg); }`; do not hide details content from keyboard users.

- [ ] **Step 5: Add skill matrix and interest card styles**

  Use a four-column desktop matrix that collapses to two columns below 820px and one column below 620px. Interest cards use the same paper/ink contrast as proof cards, with a small orange index and a restrained signal-green status pill.

- [ ] **Step 6: Add mobile menu, focus and reduced-motion rules**

  Define `.mobile-menu-toggle`, `.nav-links.is-open`, `:focus-visible`, and the existing `@media (prefers-reduced-motion: reduce)` behavior. At 820px hide the desktop nav and show the menu button; at 620px make all cards single-column and ensure no element exceeds the viewport width.

- [ ] **Step 7: Run a CSS selector sanity check**

  Run `rg -n "page-hero|route-grid|route-card|project-details|skill-matrix|mobile-menu-toggle|focus-visible|prefers-reduced-motion" styles.css` and verify every selector has at least one matching class or attribute in the HTML files.

## Task 7: Replace the single-page script with shared page behavior

**Files:**
- Modify: `script.js`
- Modify: `index.html`
- Modify: `education.html`
- Modify: `projects.html`
- Modify: `internship.html`
- Modify: `skills.html`
- Modify: `interests.html`

**Interfaces:**
- Produces these functions: `setActivePage()`, `setupMobileMenu()`, `setupDetailsLabels()`, `setupRevealAnimations()`, and `setupHeroAtmosphere()`; each is called once on `DOMContentLoaded` or immediately when the deferred script runs.

- [ ] **Step 1: Implement `setActivePage()`**

  Read `document.body.dataset.page`, find the matching `.nav-links a[data-page-link]`, set `aria-current="page"` on exactly one link, and remove it from the others. Use a static map `{ home: "index.html", education: "education.html", projects: "projects.html", internship: "internship.html", skills: "skills.html", interests: "interests.html" }` so query strings and trailing slashes do not affect the result.

- [ ] **Step 2: Add the mobile menu control to every shared header**

  In all six HTML files, give the nav the shared `id="site-nav"` and add this button immediately before it:

  ```html
  <button class="mobile-menu-toggle" type="button" aria-controls="site-nav" aria-expanded="false">
    <span>菜单</span>
    <span aria-hidden="true">↕</span>
  </button>
  ```

  Keep the button inside the header, preserve all existing `data-page-link` attributes, and do not add duplicate navs.

- [ ] **Step 3: Implement `setupMobileMenu()`**

  Bind `.mobile-menu-toggle` to toggle `.nav-links.is-open`, update `aria-expanded`, and close the menu when a nav link is activated or Escape is pressed. If the toggle or nav is absent, return without throwing.

- [ ] **Step 4: Implement `setupDetailsLabels()`**

  For every `details[data-open-label]`, update its label text between `查看完整案例`/`收起完整案例` or `查看工作内容与成果`/`收起工作内容与成果` based on `details.open`. Do not prevent native toggling.

- [ ] **Step 5: Preserve reveal and Hero atmosphere behavior as `setupRevealAnimations()` and `setupHeroAtmosphere()`**

  Keep the current reduced-motion fallback and IntersectionObserver threshold. Apply the pointer glow only when `.hero` exists, the pointer is fine and reduced motion is false. These functions must work on pages without a Hero by returning early.

- [ ] **Step 6: Run JavaScript syntax validation**

  Run `node --check script.js` and expect exit code 0. If Node is unavailable, run `python -c "import pathlib; compile(pathlib.Path('script.js').read_text(), 'script.js', 'exec')"` only as a fallback syntax smoke check and record that it is not a JavaScript semantic test.

## Task 8: Add static smoke tests and update project documentation

**Files:**
- Create: `scripts/validate_site.py`
- Modify: `README.md`

**Interfaces:**
- `scripts/validate_site.py` exits 0 when all six pages, navigation paths, body page keys, referenced local assets and required accessibility hooks pass.

- [ ] **Step 1: Write the validation script**

  Use only Python standard library modules (`pathlib`, `re`, `sys`, `html.parser`). The script must check:

  ```text
  required_pages = ["index.html", "education.html", "projects.html", "internship.html", "skills.html", "interests.html"]
  required_nav = ["index.html", "education.html", "projects.html", "internship.html", "skills.html", "interests.html"]
  required_body_pages = ["home", "education", "projects", "internship", "skills", "interests"]
  ```

  For every page, assert one `main#main`, one `body[data-page]`, all six nav hrefs in the exact order, a non-empty `<title>`, and at least one `aria-current`-capable nav link (`data-page-link`). Parse local `src`/`href` references and fail only for missing relative files, ignoring `mailto:`, `#...`, `http://`, and `https://` URLs. Print one `PASS` line per page and a final count; print actionable failures to stderr and exit 1.

- [ ] **Step 2: Update `README.md`**

  Replace the single-page file tree with the six HTML pages, explain that the site remains a static multi-page site, document local preview with `python -m http.server 4173`, and state that no SPA fallback or backend is required.

- [ ] **Step 3: Run the smoke test**

  Run `python scripts/validate_site.py`. Expected result: six page `PASS` lines and exit code 0.

## Task 9: Verify the complete site and commit implementation

**Files:**
- Verify: all files from Tasks 1–8

- [ ] **Step 1: Check the working tree and diff summary**

  Run `git status --short` and `git diff --stat`. Confirm only the planned pages, shared assets, documentation and validator changed.

- [ ] **Step 2: Run all static checks**

  Run, in order:

  ```powershell
  python scripts/validate_site.py
  node --check script.js
  rg -n "href=\"#(profile|journey|projects|capabilities)\"" *.html
  ```

  The validator and Node check must exit 0; the stale-navigation search must return no matches.

- [ ] **Step 3: Preview through a local HTTP server**

  Start `python -m http.server 4173` in `D:\PersonalWebsite`, then request each path with a browser or PowerShell `Invoke-WebRequest` and confirm HTTP 200 for `/`, `/education.html`, `/projects.html`, `/internship.html`, `/skills.html`, and `/interests.html`. Stop the server after verification.

- [ ] **Step 4: Perform the responsive/accessibility checklist**

  In a browser, verify desktop and mobile widths, the mobile menu open/close path, visible keyboard focus, details expansion, email links, image loading, and reduced-motion behavior. Record any failure before claiming completion.

- [ ] **Step 5: Commit the implementation**

  ```bash
  git add index.html education.html projects.html internship.html skills.html interests.html styles.css script.js README.md scripts/validate_site.py docs/superpowers/plans/2026-09-06-portfolio-multipage.md
  git commit -m "feat: restructure portfolio into multipage site"
  ```

# Task 4 report: projects and interests pages

## Scope

- Modified `projects.html` and `interests.html`.
- Added this required report file.
- No changes were made to `styles.css`, `script.js`, `index.html`, or the other topic pages.

## Delivered content

- Migrated the four verified project cases from the original `index.html` revision (`93ca80a`): 健身助手 Agent、智能穿戴健康 iOS App、移动机器人底盘、LLM-Wiki 团队知识服务.
- Each project retains its category/role or delivery context, result, tags, visual diagram, existing image paths, and Chinese image alt text.
- Each card provides a concise outcome and required metric anchor before a native `details.project-details` element. The expandable section contains the long copy, bullet points, and secondary image gallery where applicable.
- Added the four approved draft interest cards, with an explicit `兴趣方向草稿` label and replaceable copy grounded in existing project work.

## Commands and outputs

### Initial content check (red)

```powershell
$projects = Get-Content -Raw 'projects.html'; $interests = Get-Content -Raw 'interests.html'; $checks = @($projects -match '<details class="project-details"', $projects -match '健身助手 Agent', $projects -match 'RECALL \+20%', $projects -match 'BLE / HEALTH DATA', $projects -match '定位 ±3cm', $projects -match '方案采纳率 80%', $interests -match '兴趣方向草稿', $interests -match '健身与训练', $interests -match '机器人与智能硬件', $interests -match 'AI 工具与产品', $interests -match '知识整理'); if ($checks -contains $false) { Write-Error 'Required project and interest content is not present yet.' }
```

Output:

```text
Write-Error: Required project and interest content is not present yet.
```

### Final structure and asset verification (green)

```powershell
$projects = Get-Content -Raw 'projects.html'; $interests = Get-Content -Raw 'interests.html'; $required = @('<details class="project-details" data-open-label="查看完整案例">','健身助手 Agent','智能穿戴健康 iOS App','移动机器人底盘','LLM-Wiki 团队知识服务','RECALL +20%','BLE / HEALTH DATA','定位 ±3cm','方案采纳率 80%'); foreach ($item in $required) { if (-not $projects.Contains($item)) { throw "Missing project content: $item" } }; if (([regex]::Matches($projects, '<details class="project-details"')).Count -ne 4) { throw 'Expected four project details elements.' }; foreach ($item in @('兴趣方向草稿','健身与训练','机器人与智能硬件','AI 工具与产品','知识整理')) { if (-not $interests.Contains($item)) { throw "Missing interest content: $item" } }; 'Content structure check: PASS'
```

Output:

```text
Content structure check: PASS
```

```powershell
rg -n "fitness-0[1-5]\.webp|ios-0[1-3]\.webp|robot-01\.webp" projects.html
Get-ChildItem assets/projects -File | Select-Object -ExpandProperty Name
```

Output: all nine referenced image names were found in `projects.html` and all are present in `assets/projects` (`fitness-01` through `fitness-05`, `ios-01` through `ios-03`, and `robot-01`).

```powershell
rg -n "健身与训练|机器人与智能硬件|AI 工具与产品|知识整理" interests.html
git diff --check
```

Output: one match was returned for each interest label; `git diff --check` returned exit code 0 (only CRLF advisory warnings).

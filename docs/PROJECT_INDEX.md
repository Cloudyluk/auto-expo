# 全球汽车展会聚合平台：项目总索引

> 这是项目的长期管理入口。后续更新不依赖聊天上下文，先阅读本文件，再按链接进入对应文档。

## 当前状态

| 项目 | 当前值 |
|---|---|
| 产品定位 | 全球汽车产业展会与供应链决策库 |
| 当前版本 | V6 供应链指引基础版 |
| 数据规模 | 569 条主记录 / 36 个主题分类 |
| 数据年度 | 2026 主数据 + 2027 已公布预告 |
| 技术形态 | `index.html` 纯静态单页 + `data/exhibitions.js` 数据源，GitHub Pages 部署 |
| 仓库 | `Cloudyluk/auto-expo` |
| 在线地址 | https://cloudyluk.github.io/auto-expo/ |
| 最近提交 | 官网补全与字段治理持续更新，详见 [变更日志](CHANGELOG.md) |
| 最近更新 | 2026-08-09 |

## 从哪里开始

1. 要补展会：阅读 [数据维护手册](DATA_MAINTENANCE.md)。
2. 要理解字段：阅读 [数据字典](DATA_DICTIONARY.md)。
3. 要知道下一步做什么：阅读 [项目待办看板](PROJECT_BACKLOG.md)。
4. 要查看为什么这样改：阅读 [决策日志](DECISION_LOG.md)。
5. 要了解长期产品方向：阅读 [供应链升级路线图](auto-expo-supply-chain-roadmap.md)。
6. 要查看当前完成比例：阅读 [项目进度与甘特图](PROJECT_PROGRESS.md)。
7. 更新完成后，把结果写入 [变更日志](CHANGELOG.md)。

## 当前产品能力

- 默认首页为全球地图工作台：年份/月度筛选、国家与城市联动、当月全量展会清单。
- 展会精选、月度、分类、国内、海外、推荐、2027 预告。
- 按主题分类和供应链环节筛选。
- 展会卡片显示日期、场馆/地址、区域、供应链标签和子行业标签。
- 支持官方来源链接和搜索；官方链接规则按批次持续补全。
- 地图已覆盖 558 / 562 条 2026 主数据坐标；仅 4 条“待定”记录暂不落点。
- 所有主题分类均有买方任务、卖方客户类型和区域市场用途默认指引。
- 暗色/亮色主题，适配桌面和移动端。
- 月度全球展会地图：按所选月份点亮国家与城市；默认展示该月全部展会，点击地点即可原位筛选。

## 当前数据结构

原始数据已拆分到 [data/exhibitions.js](../data/exhibitions.js)，页面只负责渲染和交互。字段逐步向标准结构演进：

`name` → `year` / `month` / `date` / `sortDate` → `location` / `address` → `cat` / `sc` / `vertical` → `focus` / `audience` → `market` / `region` → `star` / `status` / `source`

## 项目原则

- 日期和地址优先引用主办方官网。
- 未公布的信息写“待定/待确认”，不推测具体日期。
- 2027 预告独立展示，不混入 2026 统计。
- 一个展会尽量保持一条主记录，避免同一展会因多个主题重复计数。
- 每次数据更新都要同步来源、更新时间和变更日志。
- 不编辑 `sources/` 下的项目同步资料。

## 已审计数据基线（2026-08-08）

- 569 条主记录，其中 562 条为 2026 主数据、7 条为 2027 已公布预告。
- 36/36 个主题分类已纳入可维护的供应链分类表。
- 结构化字段覆盖：地址 569 条、官方来源 569 条、适合人群 569 条。
- 地址中 378 条为已确认场馆地址，191 条明确标记“待核验”；重复主记录已合并，市场归类冲突为 0。
- 审计命令：`node scripts/audit-exhibitions.js`；严格检查：`node scripts/audit-exhibitions.js --strict`。
- 月度复核：`node scripts/monthly-review.js`，先看地址、日期和来源待核验队列，再更新数据。

## 文件地图

| 文件 | 用途 |
|---|---|
| `index.html` | 当前网站与渲染逻辑；展会主数据位于 `data/exhibitions.js` |
| `README.md` | 项目简介和快速入口 |
| `docs/PROJECT_INDEX.md` | 本文件，长期总索引 |
| `docs/DATA_MAINTENANCE.md` | 补数据、改数据、发布和核验流程 |
| `docs/DATA_DICTIONARY.md` | 字段、状态、分类和质量规则 |
| `docs/PROJECT_BACKLOG.md` | 分阶段待办和验收标准 |
| `docs/DECISION_LOG.md` | 关键产品和数据决策记录 |
| `docs/CHANGELOG.md` | 面向项目的版本变更记录 |
| `docs/PROJECT_PROGRESS.md` | 当前完成比例、甘特图和剩余工作量 |
| `docs/auto-expo-supply-chain-roadmap.md` | 供应链产品长期规划 |

## 下一次更新入口

下一次开始工作时，先确认：

- [x] 查看本文件的当前版本、数据量和最近提交。
- [ ] 查看 [项目待办看板](PROJECT_BACKLOG.md) 的最高优先级事项。
- [ ] 查看 [数据维护手册](DATA_MAINTENANCE.md) 的来源与核验要求。
- [ ] 完成后更新 `CHANGELOG.md` 和本文件的状态信息。

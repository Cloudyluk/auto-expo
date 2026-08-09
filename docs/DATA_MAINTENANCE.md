# 数据维护手册

## 适用范围

用于新增、修订、去重和下线汽车产业展会数据。当前主数据位于 `data/exhibitions.js`，页面只负责加载和渲染。

## 新增一条展会

使用下面的最小结构，字段顺序尽量保持一致：

```js
{
  year: 2026,
  month: 10,
  name: "官方展会名",
  cat: "新能源/EV",
  date: "10月12-15日",
  sortDate: 20261012,
  location: "美国 底特律 Huntington Place",
  address: "1 Washington Boulevard, Detroit, MI 48226, USA",
  focus: "核心品类和供应链价值",
  market: "海外",
  star: 2,
  sc: "三电/电池供应链",
  audience: "电池材料、设备、Pack、测试与采购团队",
  source: "https://official-event-site.example"
}
```

## 来源优先级

1. 展会主办方官网、场馆官网、官方参展手册。
2. 行业协会或主办方官方新闻稿。
3. 官方展商/观众注册页。
4. 权威行业媒体，仅用于发现线索，最终尽量回到官方来源。

每条重点展会至少保留 `source`。日期、地址或场馆未公布时，写明“待定/待确认”，不要根据往年规律自行补日期。

已验证官网也可维护在 `data/official-exhibition-links.js`。该文件用于同一主展会的别名和专题分区共用官网；新增规则时应使用主办方域名，并先确认链接可达及展会名称匹配，避免把同一城市的不同展会误映射到一起。

新城市需补入 `data/exhibition-geo.js`；未收录城市会回退到国家中心点，不能自行猜测城市坐标。

## 分类规则

`cat` 是展会主题分类，保持现有 36 类兼容；`sc` 是供应链阶段；`vertical` 是更细的供应链子行业。新增分类前先检查是否能复用已有分类。

常用 `sc`：

- 原材料/材料工艺
- 零部件/底盘系统、零部件/热管理、零部件/内外饰
- 三电/新能源、三电/电池供应链、补能基础设施/能源服务
- 电子电气/车规芯片、电子电气/元器件、智能化/ADAS
- 制造装备/工艺设备
- 售后流通/汽配汽保、售后流通/再制造
- 供应链服务/汽车物流、供应链服务/数字化物流、供应链服务/贸易合规

## 年度和日期规则

- 2026 主数据：`year: 2026`，旧记录如果没有 `year` 会按现有排序日期兼容处理。
- 2027 预告：必须有 `year: 2027` 和 `status: "2027预告"`。
- `sortDate` 使用 `YYYYMMDD`；只有月份时使用当月 01 日并在 `date` 中标注待定。
- 2027 预告不能进入 2026 月度、国内、海外和推荐统计。

## 更新流程

1. 在官网确认名称、日期、场馆、地址和来源链接。
2. 搜索 `index.html`，确认不存在同名或同城市同日期记录。
3. 新增或修改记录，补齐 `cat`、`sc`、`vertical`、`market`、`source`。
4. 运行静态检查：

```bash
node --check <(sed -n '/<script>/,/<\/script>/p' index.html | sed '1d;$d')
node scripts/audit-exhibitions.js
git diff --check
```

如需将重复记录、2027 状态和国内/海外归类冲突视为阻断项，运行：

```bash
node scripts/audit-exhibitions.js --strict
```

5. 用本地静态服务器检查总览、分类、海外、2027 预告和搜索。
6. 提交时使用清晰的变更说明，例如 `Add 2027 remanufacturing events`。
7. 推送后确认 GitHub Pages 构建成功，再更新 `CHANGELOG.md`。

## 下线或修订

- 取消：保留记录，增加 `status: "已取消"`，不要直接删除。
- 延期：更新 `date`、`sortDate` 和 `status: "已延期"`。
- 日期未核实：使用 `status: "待复核"`，并加入待办看板。
- 重复记录：保留信息更完整、来源更可靠的一条，其余合并后删除。
# 月度复核

每月更新前先运行：

```bash
node scripts/monthly-review.js
node scripts/audit-exhibitions.js --strict --taxonomy --geo
```

先处理地址待核验、日期待确认和来源待补记录；官方语言、线上参会和邀请函只在主办方页面明确说明后写入数据。复核结果应同步到 `docs/CHANGELOG.md`，再提交数据变更。

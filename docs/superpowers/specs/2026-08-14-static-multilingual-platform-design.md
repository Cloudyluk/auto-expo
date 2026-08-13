# 静态多语种汽车展会平台重构设计

## 目标

将现有单文件中文静态站重构为可部署在 GitHub Pages 的多语种平台。英文为默认站点和第一个完整发布语言；中文完整保留；西班牙语、葡萄牙语、法语、德语、日语、韩语、阿拉伯语、印地语、印尼语、俄语、意大利语、土耳其语先以可见但不可选择的 “Coming soon” 占位呈现。

重构后，英文页面除官方专名、品牌、网址和受控行业缩写外不得出现中文。采购路径、销售路径、逐展匹配、国家筛选、地图、搜索、空状态和无障碍标签必须以当前语言渲染。

## 发布与路由

- GitHub Pages 静态部署，不引入服务器、数据库或登录后台。
- `/` 是英文默认站点。
- `/zh/` 是完整中文站点。
- 以后每种已审核语言使用独立路径，例如 `/es/`、`/pt/`、`/fr/`。
- 未完成语言不创建内容路径；语言菜单仅显示禁用的 `Coming soon` 状态。

## 名称与翻译规则

### 官方专名

展会名称必须按当前语言优先取主办方公开的官方名称：

1. 中文页面优先官方中文名称。
2. 英文页面优先官方英文名称；中国展会的英文官网名称亦属于官方英文名称。
3. 目标语言缺少官方名称时，保留其官方原始名称，不创造未经主办方确认的译名。
4. 网址、主办方、品牌、标准号和缩写原样保留。

### 受控术语

OEM、Tier 1、Tier 2、BMS、PACK、ADAS、PPAP、IATF 16949、FMEA、SiC、APQP、SOP、ECU、VCU、SDV、SOTIF、SQE 等为受控术语。不得将“定点”译为 fixed point/location，不得将“前装/后装”译为 front/rear installation，不得将“三电”译为 “Three Electric Systems”。

### 可本地化内容

界面标签、页面标题、说明、筛选器、空状态、采购任务、匹配解释、展会主题、受众、采购价值、销售价值、国家/地区/分类的显示名必须由语言包提供。匹配算法和内部 ID 不翻译。

## 数据模型与边界

### 领域数据

展会、国家、分类、供应链总成、采购任务和销售规则使用稳定内部 ID。匹配仅消费 ID、结构化关键词、展会主题和受众标签，不读取展示字符串。

每场展会包含：

```js
{
  id: 'automechanika-shanghai-2026',
  official: {
    defaultName: 'Automechanika Shanghai 2026',
    names: { zh: '上海法兰克福汽配展', en: 'Automechanika Shanghai 2026' },
    url: 'https://…'
  },
  taxonomy: { categoryId: 'aftermarket', countryCode: 'CN' },
  content: {
    zh: { focus: '…', audience: '…', buyerValue: ['…'], sellerValue: ['…'] },
    en: { focus: '…', audience: '…', buyerValue: ['…'], sellerValue: ['…'] }
  },
  matching: { keywords: ['aftermarket', 'diagnostics'], audiences: ['distributor'] }
}
```

`content.en` 仅由审核后的英文数据填充；缺项不得以中文兜底。页面必须改显示“English content is being verified.”而不是泄漏中文。

### UI 语言包

每个语言包提供浏览器标题、网站名、导航、所有页面标题、按钮、提示、筛选标签、地图控件、搜索文本、采购/销售详情、匹配解释、空状态和 ARIA 文案。渲染层只能通过 `t(locale, key)` 读取 UI 字符串。

### 静态应用结构

采用 Vite + React 静态构建。共享领域数据、匹配服务、渲染组件和语言包；按 locale 生成独立 HTML 入口/路径。中文和英文共享相同的交互逻辑与结果，只改变已审核的显示内容。

## 用户体验

- 语言菜单显示当前语言，并列出可用语言；未发布语言清晰标注 `Coming soon`，不可误导为已翻译。
- 采购流程采用：`Select target market → Define sourcing needs → Review matched exhibitions → Contact exhibitor`。
- 销售流程采用：`Create company profile → Add products → Set target markets → Reach buyers`。
- 匹配解释使用 `Why this match?`；当数据不足时显示 `Preliminary match based on the information available.`。
- 英文空状态：`No exhibitions match your current filters.`、`No matches found based on the information provided.`、`We couldn't load the results.`。
- 禁止在无交易能力时使用 `Buy now`、`Order`、`Guaranteed match` 等承诺性文案。

## 验收与自动检查

1. 根路径和 `/zh/` 都可在静态服务器与 GitHub Pages 子路径环境下工作。
2. 英文站所有已渲染的非专名 UI 文案均为英文。
3. 英文展会数据不存在中文回退；官方原始名称的例外必须标注为 `officialName`，不能由任意中文字段穿透。
4. 中文站保留当前数据、采购/销售功能和逐展匹配逻辑。
5. 采购匹配仍遵循 `关键词 + 分类 + 主题/受众 + 采购任务`，并逐场提供理由、现场产出、跳过条件和替代动作。
6. 国家筛选、搜索、地图、主题切换、移动导航、采购/销售子页在两个已发布语言中都可用。
7. 自动测试覆盖：语言包完整性、英文残留中文扫描（允许官方专名白名单）、URL/语言路由、官方名称回退、采购匹配、国家浏览。
8. 每次新增语言必须经过翻译、行业术语审核、交互与链接自检，才从 `Coming soon` 变为可用。

## 不在本次范围

- 不接入服务器端 CMS、账号、RFQ 交易、聊天或支付。
- 不把未审核的西语、葡语、法语、德语、日语、韩语等内容发布为完整语言页面。
- 不修改采购匹配的业务判断以适应语言显示。

# 变更日志

## 2026-08-08：供应链数据基础

- 新增 `data/supply-chain-taxonomy.js`，为 36 个主题分类定义供应链环节、子行业、采购任务、卖方客户类型与区域市场用途。
- 新增 `scripts/audit-exhibitions.js`，检查字段覆盖、重复记录、2027 预告状态和国内/海外归类冲突。
- 展会卡片新增“采购”与“客户”指引；搜索支持如“供应商开发”“经销商”等任务词。
- 审计基线：608 条记录、18 组重复、85 条原始市场标注冲突；2027 预告状态错误为 0。
- 验证：`node scripts/audit-exhibitions.js --taxonomy`、页面脚本语法检查、浏览器搜索与年度隔离检查。

## 2026-08-08

### 项目管理文档

- 新增项目总索引、数据维护手册、数据字典、项目待办看板和决策日志。
- README 增加总索引入口。

### 数据与功能

- 新增 Battery Show Europe、E-TECH Europe、E-CHARGE、electronica、Automotive Logistics and Supply Chain Global 等垂直展会。
- 新增 LogiMAT Stuttgart 2027、Rematec Amsterdam 2027 预告。
- 增强动力电池、充电、车规芯片、汽车物流、再制造和贸易合规标签。

## 2026-08-08（前序）

- 新增 2027 预告页面与日期/地址显示。
- 增加供应链环节、区域市场和子行业标签。
- 修复中国展会被误归为海外的问题。
- 补充 Automechanika、Battery Show、Power2Drive、AutoSens、MOVE 等重点海外展会。

## 维护规则

每次更新至少记录：日期、变更内容、涉及数据范围、官方来源和验证结果。版本号或最近提交号变化时，同步更新 `docs/PROJECT_INDEX.md`。

#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

assert.match(html, /const PROCUREMENT_TASKS\s*=/, '采购路径需要声明采购任务');
for (const task of ['新供应商开发 / 第二供应商', '技术选型与方案比较', '降本、材料替代与本地化', '供应商质量、认证与产能评估', '售后、再制造与逆向供应链']) {
  assert.ok(html.includes(task), `缺少采购任务：${task}`);
}
assert.match(html, /renderProcurementTaskSelector/, '采购详情页需要渲染任务选择器');
assert.match(html, /rankProcurementEvents/, '采购展会列表需要按任务重排');
assert.match(html, /现场要拿到什么/, '采购展会决策需要说明现场产出');
assert.match(html, /不去的条件/, '采购展会决策需要说明跳过条件');
assert.match(html, /event\.focus/, '展会级匹配需要使用该展会的主题说明');
assert.match(html, /event\.audience/, '展会级匹配需要使用该展会的受众信息');
assert.match(html, /event\.source/, '展会级匹配需要使用该展会的来源完整度');
assert.match(html, /event\.status/, '展会级匹配需要使用该展会的状态信息');
for (const assembly of ['发动机与进排气', '燃油供给、点火与尾气后处理', '冷却、润滑与 HVAC', '启动、发电与低压电气', '传动与四驱系统', '底盘、制动与转向', '轮胎、橡胶与密封', '主动与被动安全', '车身、内外饰、座椅与照明', '电子电气、线束、ECU 与传感器']) {
  assert.ok(html.includes(assembly), `燃油车采购路径缺少：${assembly}`);
}
assert.match(html, /shared:\{label:'横向采购能力'[\s\S]*id:'manufacturing'/, '制造、材料与质量应归入横向采购能力');

console.log('Procurement decision contract passed.');

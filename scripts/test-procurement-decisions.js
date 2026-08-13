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

console.log('Procurement decision contract passed.');

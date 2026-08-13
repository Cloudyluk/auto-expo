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
assert.match(html, /getProcurementEventMatch/, '采购展会需要逐展计算匹配依据');
assert.match(html, /procurementTaskEvidence/, '采购展会匹配需要考虑当前采购任务');
assert.match(html, /precise\.length\?precise/, '存在精准展会时不应混入分类泛匹配');
assert.match(html, /keywords:/, '采购总成需要声明业务关键词');
assert.match(html, /event\.name/, '展会级匹配需要使用展会名称');
assert.match(html, /现场要拿到什么/, '采购展会决策需要说明现场产出');
assert.match(html, /不去的条件/, '采购展会决策需要说明跳过条件');
assert.match(html, /匹配依据/, '采购展会卡片需要展示逐展匹配依据');
assert.match(html, /event\.focus/, '展会级匹配需要使用该展会的主题说明');
assert.match(html, /event\.audience/, '展会级匹配需要使用该展会的受众信息');
assert.match(html, /event\.source/, '展会级匹配需要使用该展会的来源完整度');
assert.match(html, /event\.status/, '展会级匹配需要使用该展会的状态信息');
for (const assembly of ['发动机与进排气', '燃油供给、点火与尾气后处理', '冷却、润滑与 HVAC', '启动、发电与低压电气', '传动与四驱系统', '底盘、制动与转向', '轮胎、橡胶与密封', '主动与被动安全', '车身、内外饰、座椅与照明', '电子电气、线束、ECU 与传感器']) {
  assert.ok(html.includes(assembly), `燃油车采购路径缺少：${assembly}`);
}
assert.match(html, /shared:\{label:'横向采购能力'[\s\S]*id:'manufacturing'/, '制造、材料与质量应归入横向采购能力');
for (const assembly of ['电池材料与电芯', 'BMS 与电池电子', '电池热安全、消防与测试', '电机、绕组与磁材', '减速器、齿轮与轴承', '充电设备与运营', '换电系统与服务', 'V2G、储能与电网接口', '氢燃料电池系统']) {
  assert.ok(html.includes(assembly), `新能源车采购路径缺少：${assembly}`);
}
const evStart = html.indexOf("ev:{label:'新能源车'");
const sharedStart = html.indexOf("shared:{label:'横向采购能力'");
assert.ok(evStart >= 0 && sharedStart > evStart, '新能源车和横向能力路径应存在');
const evSection = html.slice(evStart, sharedStart);
const sharedSection = html.slice(sharedStart, html.indexOf('};\nconst SALES_ROUTES'));
assert.ok(!evSection.includes("id:'smart'") && !evSection.includes("id:'software'"), '智能化与软件不应继续放在新能源车路径');
assert.ok(sharedSection.includes("id:'smart'") && sharedSection.includes("id:'software'"), '智能化与软件应移入横向采购能力');
for (const assembly of ['测试、认证与法规', '制造工艺、材料与质量', '制造装备与厂内物流', '智能驾驶与智能座舱', '软件、数据与供应链服务', '供应链风险与韧性', '贸易合规与出海', '售后、再制造与逆向物流']) {
  assert.ok(sharedSection.includes(assembly), `横向采购能力缺少：${assembly}`);
}
assert.ok(sharedSection.includes("id:'risk'"), '横向采购能力需要供应链风险与韧性入口');
assert.ok(!sharedSection.includes("id:'digital'"), '供应链软件与数字化应整合到软件、数据与供应链服务');
assert.match(html, /适用范围/, '横向采购能力需要展示适用范围');

console.log('Procurement decision contract passed.');

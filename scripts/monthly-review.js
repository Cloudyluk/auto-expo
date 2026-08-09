#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'data', 'exhibitions.js'), 'utf8');
const context = {};
vm.createContext(context);
vm.runInContext(source.replace('const EXHIBITIONS', 'this.EXHIBITIONS'), context);
const events = context.EXHIBITIONS;
const current = events.filter(event => !event.year || event.year === 2026);
const pendingAddress = events.filter(event => event.addressStatus === '待核验' || /^Venue to be confirmed/.test(event.address || '')).length;
const missingSource = events.filter(event => !event.source).length;
const pendingDate = events.filter(event => !event.date || /待定|待确认/.test(event.date)).length;
const byMonth = new Map();
for (const event of current) {
  const month = event.month || '待定';
  byMonth.set(month, (byMonth.get(month) || 0) + 1);
}

console.log('# Auto Expo 月度数据复核\n');
console.log(`复核时间：${new Date().toISOString().slice(0, 10)}`);
console.log(`主记录：${events.length}`);
console.log(`2026 主数据：${current.length}`);
console.log(`地址待核验：${pendingAddress}`);
console.log(`来源待补：${missingSource}`);
console.log(`日期待确认：${pendingDate}`);
console.log(`月份分布：${JSON.stringify(Object.fromEntries([...byMonth.entries()].sort((a, b) => String(a[0]).localeCompare(String(b[0])))))}`);
console.log('\n复核动作：优先打开地址待核验记录的官方来源，确认场馆、报名入口、邀请函和下一届日期后再写回 data/exhibitions.js。');

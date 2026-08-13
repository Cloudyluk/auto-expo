#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

assert.match(html, /data-page="country"/, '导航需要提供按国家浏览入口');
assert.doesNotMatch(html, /data-page="domestic"/, '国内菜单应合并到按国家浏览');
assert.doesNotMatch(html, /data-page="overseas"/, '海外菜单应合并到按国家浏览');
assert.match(html, /function countryLabel\(/, '展会需要归类到国家');
assert.match(html, /e\.country=countryLabel\(e\)/, '标准化记录需要保存国家');
assert.match(html, /renderCountryChips/, '按国家页面需要渲染国家筛选');
assert.match(html, /selectCountry/, '国家筛选需要支持切换');
assert.match(html, /countryContent/, '按国家页面需要渲染展会结果');

console.log('Country browser contract passed.');

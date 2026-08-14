const CITY_COORDINATES = {
  '上海': ['Shanghai', 'China', 31.2304, 121.4737], '北京': ['Beijing', 'China', 39.9042, 116.4074], '广州': ['Guangzhou', 'China', 23.1291, 113.2644], '深圳': ['Shenzhen', 'China', 22.5431, 114.0579], '苏州': ['Suzhou', 'China', 31.2989, 120.5853], '重庆': ['Chongqing', 'China', 29.563, 106.5516], '武汉': ['Wuhan', 'China', 30.5928, 114.3055], '成都': ['Chengdu', 'China', 30.5728, 104.0668], '杭州': ['Hangzhou', 'China', 30.2741, 120.1551], '天津': ['Tianjin', 'China', 39.3434, 117.3616],
  '慕尼黑': ['Munich', 'Germany', 48.1351, 11.582], '法兰克福': ['Frankfurt', 'Germany', 50.1109, 8.6821], '斯图加特': ['Stuttgart', 'Germany', 48.7758, 9.1829], '柏林': ['Berlin', 'Germany', 52.52, 13.405], '汉诺威': ['Hanover', 'Germany', 52.3759, 9.732], '科隆': ['Cologne', 'Germany', 50.9375, 6.9603],
  '底特律': ['Detroit', 'United States', 42.3314, -83.0458], '拉斯维加斯': ['Las Vegas', 'United States', 36.1699, -115.1398], '纽约': ['New York', 'United States', 40.7128, -74.006],
  '东京': ['Tokyo', 'Japan', 35.6762, 139.6503], '横滨': ['Yokohama', 'Japan', 35.4437, 139.638], '名古屋': ['Nagoya', 'Japan', 35.1815, 136.9066], '曼谷': ['Bangkok', 'Thailand', 13.7563, 100.5018], '胡志明市': ['Ho Chi Minh City', 'Vietnam', 10.8231, 106.6297], '雅加达': ['Jakarta', 'Indonesia', -6.2088, 106.8456], '新德里': ['New Delhi', 'India', 28.6139, 77.209], '孟买': ['Mumbai', 'India', 19.076, 72.8777],
  '巴黎': ['Paris', 'France', 48.8566, 2.3522], '博洛尼亚': ['Bologna', 'Italy', 44.4949, 11.3426], '阿姆斯特丹': ['Amsterdam', 'Netherlands', 52.3676, 4.9041], '伦敦': ['London', 'United Kingdom', 51.5072, -0.1276], '巴塞罗那': ['Barcelona', 'Spain', 41.3874, 2.1686], '华沙': ['Warsaw', 'Poland', 52.2297, 21.0122], '伊斯坦布尔': ['Istanbul', 'Turkey', 41.0082, 28.9784], '迪拜': ['Dubai', 'United Arab Emirates', 25.2048, 55.2708], '墨西哥城': ['Mexico City', 'Mexico', 19.4326, -99.1332], '圣保罗': ['São Paulo', 'Brazil', -23.5505, -46.6333], '首尔': ['Seoul', 'South Korea', 37.5665, 126.978]
};

const COUNTRY_CENTERS = {
  '中国': ['China', 35, 103], '美国': ['United States', 39, -98], '德国': ['Germany', 51, 10], '日本': ['Japan', 36, 138], '韩国': ['South Korea', 36, 128], '泰国': ['Thailand', 15, 101], '越南': ['Vietnam', 16, 108], '印度': ['India', 22, 79], '意大利': ['Italy', 42.5, 12.5], '法国': ['France', 46, 2], '英国': ['United Kingdom', 55, -3], '荷兰': ['Netherlands', 52.1, 5.3], '西班牙': ['Spain', 40, -4], '波兰': ['Poland', 52, 20], '土耳其': ['Turkey', 39, 35], '阿联酋': ['United Arab Emirates', 24, 54], '巴西': ['Brazil', -14, -51], '墨西哥': ['Mexico', 23, -102], '加拿大': ['Canada', 56, -106], '澳大利亚': ['Australia', -25, 133], '俄罗斯': ['Russia', 61, 105], '印尼': ['Indonesia', -2, 118], '马来西亚': ['Malaysia', 4, 102], '新加坡': ['Singapore', 1.35, 103.82], '瑞士': ['Switzerland', 47, 8], '奥地利': ['Austria', 47.5, 14], '比利时': ['Belgium', 50.5, 4.5], '瑞典': ['Sweden', 62, 15], '匈牙利': ['Hungary', 47, 20], '捷克': ['Czechia', 49.8, 15.5], '阿根廷': ['Argentina', -34, -64], '埃及': ['Egypt', 27, 30], '沙特': ['Saudi Arabia', 24, 45]
};

const ALIASES = { USA: '美国', 'United States': '美国', Detroit: '美国', 'Las Vegas': '美国', Germany: '德国', Munich: '德国', Frankfurt: '德国', Stuttgart: '德国', Japan: '日本', Tokyo: '日本', Yokohama: '日本', Nagoya: '日本', Thailand: '泰国', Bangkok: '泰国', Vietnam: '越南', India: '印度', Italy: '意大利', France: '法国', Paris: '法国', Netherlands: '荷兰', Spain: '西班牙', Poland: '波兰', Turkey: '土耳其', Dubai: '阿联酋', Brazil: '巴西', Mexico: '墨西哥', Canada: '加拿大', Australia: '澳大利亚', Indonesia: '印尼', Malaysia: '马来西亚', Singapore: '新加坡', Korea: '韩国' };

export function getExhibitionGeo(event) {
  const text = event.location?.label || '';
  const cityKey = Object.keys(CITY_COORDINATES).find((name) => text.includes(name));
  if (cityKey) { const [city, country, latitude, longitude] = CITY_COORDINATES[cityKey]; return { city, country, latitude, longitude, precision: 'city' }; }
  const countryKey = Object.keys(COUNTRY_CENTERS).find((name) => text.includes(name)) || Object.keys(ALIASES).find((name) => text.toLowerCase().includes(name.toLowerCase())) && ALIASES[Object.keys(ALIASES).find((name) => text.toLowerCase().includes(name.toLowerCase()))];
  if (!countryKey) return null;
  const [country, latitude, longitude] = COUNTRY_CENTERS[countryKey];
  return { city: '', country, latitude, longitude, precision: 'country' };
}

export function getMapGroups(events, year, month) {
  const groups = new Map();
  events.filter((event) => event.date.year === year && event.date.month === month).forEach((event) => {
    const geo = getExhibitionGeo(event); if (!geo) return;
    const key = `${geo.country}:${geo.city || 'country'}`;
    if (!groups.has(key)) groups.set(key, { key, ...geo, events: [] });
    groups.get(key).events.push(event);
  });
  return [...groups.values()];
}

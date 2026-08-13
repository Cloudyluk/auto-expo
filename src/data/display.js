const PLACES = {
  '上海': { en: 'Shanghai', es: 'Shanghái' }, '北京': { en: 'Beijing', es: 'Pekín' }, '广州': { en: 'Guangzhou', es: 'Guangzhou' }, '深圳': { en: 'Shenzhen', es: 'Shenzhen' }, '重庆': { en: 'Chongqing', es: 'Chongqing' },
  '成都': { en: 'Chengdu', es: 'Chengdu' }, '武汉': { en: 'Wuhan', es: 'Wuhan' }, '杭州': { en: 'Hangzhou', es: 'Hangzhou' }, '南京': { en: 'Nanjing', es: 'Nankín' }, '天津': { en: 'Tianjin', es: 'Tianjin' },
  '苏州': { en: 'Suzhou', es: 'Suzhou' }, '青岛': { en: 'Qingdao', es: 'Qingdao' }, '济南': { en: 'Jinan', es: 'Jinan' }, '郑州': { en: 'Zhengzhou', es: 'Zhengzhou' }, '昆明': { en: 'Kunming', es: 'Kunming' },
  '合肥': { en: 'Hefei', es: 'Hefei' }, '佛山': { en: 'Foshan', es: 'Foshan' }, '东莞': { en: 'Dongguan', es: 'Dongguan' }, '无锡': { en: 'Wuxi', es: 'Wuxi' }, '宁波': { en: 'Ningbo', es: 'Ningbo' },
  '西安': { en: "Xi'an", es: "Xi'an" }, '厦门': { en: 'Xiamen', es: 'Xiamen' }, '长春': { en: 'Changchun', es: 'Changchun' }, '长沙': { en: 'Changsha', es: 'Changsha' }, '大连': { en: 'Dalian', es: 'Dalian' },
  '沈阳': { en: 'Shenyang', es: 'Shenyang' }, '福州': { en: 'Fuzhou', es: 'Fuzhou' }, '哈尔滨': { en: 'Harbin', es: 'Harbin' }, '香港': { en: 'Hong Kong', es: 'Hong Kong' }, '台北': { en: 'Taipei', es: 'Taipéi' },
  '中国': { en: 'China', es: 'China' }, '美国': { en: 'United States', es: 'Estados Unidos' }, '德国': { en: 'Germany', es: 'Alemania' }, '法国': { en: 'France', es: 'Francia' }, '意大利': { en: 'Italy', es: 'Italia' },
  '日本': { en: 'Japan', es: 'Japón' }, '韩国': { en: 'South Korea', es: 'Corea del Sur' }, '泰国': { en: 'Thailand', es: 'Tailandia' }, '印度': { en: 'India', es: 'India' }, '巴西': { en: 'Brazil', es: 'Brasil' },
  '英国': { en: 'United Kingdom', es: 'Reino Unido' }, '荷兰': { en: 'Netherlands', es: 'Países Bajos' }, '西班牙': { en: 'Spain', es: 'España' }, '加拿大': { en: 'Canada', es: 'Canadá' }, '墨西哥': { en: 'Mexico', es: 'México' },
  '阿联酋': { en: 'United Arab Emirates', es: 'Emiratos Árabes Unidos' }, '澳大利亚': { en: 'Australia', es: 'Australia' }, '俄罗斯': { en: 'Russia', es: 'Rusia' }, '土耳其': { en: 'Türkiye', es: 'Turquía' }, '波兰': { en: 'Poland', es: 'Polonia' }
  , '拉斯维加斯': { en: 'Las Vegas', es: 'Las Vegas' }, '汉诺威': { en: 'Hanover', es: 'Hannover' }, '底特律': { en: 'Detroit', es: 'Detroit' }, '波恩': { en: 'Bonn', es: 'Bonn' }, '曼谷': { en: 'Bangkok', es: 'Bangkok' },
  '邯郸': { en: 'Handan', es: 'Handan' }, '永年': { en: 'Yongnian', es: 'Yongnian' }, '昆山': { en: 'Kunshan', es: 'Kunshan' }, '顺义': { en: 'Shunyi', es: 'Shunyi' }, '国际展览中心': { en: 'International Exhibition Center', es: 'Centro Internacional de Exposiciones' },
  '博洛尼亚': { en: 'Bologna', es: 'Bolonia' }, '慕尼黑': { en: 'Munich', es: 'Múnich' }, '法兰克福': { en: 'Frankfurt', es: 'Fráncfort' }, '斯图加特': { en: 'Stuttgart', es: 'Stuttgart' }, '柏林': { en: 'Berlin', es: 'Berlín' },
  '巴黎': { en: 'Paris', es: 'París' }, '米兰': { en: 'Milan', es: 'Milán' }, '罗马': { en: 'Rome', es: 'Roma' }, '伦敦': { en: 'London', es: 'Londres' }, '伯明翰': { en: 'Birmingham', es: 'Birmingham' },
  '东京': { en: 'Tokyo', es: 'Tokio' }, '名古屋': { en: 'Nagoya', es: 'Nagoya' }, '千叶': { en: 'Chiba', es: 'Chiba' }, '首尔': { en: 'Seoul', es: 'Seúl' }, '圣保罗': { en: 'São Paulo', es: 'São Paulo' }
};
const MONTHS = { en: ['January','February','March','April','May','June','July','August','September','October','November','December'], es: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'] };

export function localizeLocation(value = '', locale) {
  if (locale === 'zh') return value;
  let display = value;
  for (const [source, labels] of Object.entries(PLACES)) display = display.split(source).join(labels[locale] || source);
  return display.replace(/[市省]/g, '').replace(/会展中心/g, locale === 'es' ? 'Centro de Exposiciones' : 'Exhibition Center').replace(/[\u3400-\u9fff]+/g, locale === 'es' ? 'recinto ferial' : 'exhibition venue');
}

export function localizeDate(value = '', locale) {
  if (locale === 'zh' || !/\d+月/.test(value)) return value;
  const dated = value.replace(/(\d{1,2})月(\d{1,2})(?:日)?(?:-(\d{1,2})日?)?/g, (_, month, start, end) => locale === 'es'
    ? `${start}${end ? `–${end}` : ''} de ${MONTHS.es[Number(month) - 1]}`
    : `${MONTHS.en[Number(month) - 1]} ${start}${end ? `–${end}` : ''}`);
  return dated.replace(/(\d{1,2})月（春季）/g, (_, month) => locale === 'es' ? `${MONTHS.es[Number(month) - 1]} (primavera)` : `${MONTHS.en[Number(month) - 1]} (spring)`).replace(/(\d{1,2})月（秋季）/g, (_, month) => locale === 'es' ? `${MONTHS.es[Number(month) - 1]} (otoño)` : `${MONTHS.en[Number(month) - 1]} (autumn)`).replace(/待定|待确认/g, locale === 'es' ? 'Por confirmar' : 'To be confirmed');
}

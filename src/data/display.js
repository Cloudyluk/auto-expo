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
const MONTHS = { en: ['January','February','March','April','May','June','July','August','September','October','November','December'], es: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'], pt: ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'], fr: ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'], de: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'], ja: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'] };

export function localizeLocation(value = '', locale) {
  if (locale === 'zh') return value;
  let display = value;
  for (const [source, labels] of Object.entries(PLACES)) display = display.split(source).join(labels[locale] || labels.en || source);
  if (locale === 'ja') display = display.replace(/United States/g, '米国').replace(/United Arab Emirates/g, 'アラブ首長国連邦').replace(/Germany/g, 'ドイツ').replace(/China/g, '中国').replace(/Thailand/g, 'タイ').replace(/India/g, 'インド').replace(/France/g, 'フランス').replace(/Italy/g, 'イタリア').replace(/Japan/g, '日本').replace(/South Korea/g, '韓国').replace(/United Kingdom/g, '英国').replace(/Brazil/g, 'ブラジル').replace(/Canada/g, 'カナダ').replace(/Mexico/g, 'メキシコ').replace(/International Exhibition Center/g, '国際展示センター');
  return display.replace(/[市省]/g, '').replace(/会展中心/g, locale === 'es' ? 'Centro de Exposiciones' : locale === 'pt' ? 'Centro de Exposições' : locale === 'fr' ? 'Centre des expositions' : locale === 'de' ? 'Messezentrum' : locale === 'ja' ? '展示センター' : 'Exhibition Center').replace(/[\u3400-\u9fff]+/g, locale === 'es' ? 'recinto ferial' : locale === 'pt' ? 'centro de exposições' : locale === 'fr' ? 'site d’exposition' : locale === 'de' ? 'Messegelände' : locale === 'ja' ? '展示会場' : 'exhibition venue');
}

export function localizeDate(value = '', locale) {
  if (locale === 'zh') return value;
  if (locale === 'ja') value = value.replace(/January/g, '1月').replace(/February/g, '2月').replace(/March/g, '3月').replace(/April/g, '4月').replace(/May/g, '5月').replace(/June/g, '6月').replace(/July/g, '7月').replace(/August/g, '8月').replace(/September/g, '9月').replace(/October/g, '10月').replace(/November/g, '11月').replace(/December/g, '12月');
  if (!/\d+月/.test(value)) return value.replace(/待定|待确认/g, locale === 'es' ? 'Por confirmar' : locale === 'pt' ? 'A confirmar' : locale === 'fr' ? 'À confirmer' : locale === 'de' ? 'Noch zu bestätigen' : locale === 'ja' ? '確認中' : 'To be confirmed').replace(/[\u3400-\u9fff]+/g, locale === 'es' ? 'por confirmar' : locale === 'pt' ? 'a confirmar' : locale === 'fr' ? 'à confirmer' : locale === 'de' ? 'noch zu bestätigen' : locale === 'ja' ? '確認中' : 'to be confirmed');
  const months = MONTHS[locale];
  const crossMonth = value.replace(/(\d{1,2})月(\d{1,2})日-(\d{1,2})月(\d{1,2})日/g, (_, monthA, dayA, monthB, dayB) => locale === 'es' || locale === 'pt' || locale === 'fr'
    ? `${dayA} de ${months[Number(monthA) - 1]}–${dayB} de ${months[Number(monthB) - 1]}`
    : `${months[Number(monthA) - 1]} ${dayA}–${months[Number(monthB) - 1]} ${dayB}`);
  const dated = crossMonth.replace(/(\d{1,2})月(\d{1,2})(?:日)?(?:-(\d{1,2})日?)?/g, (_, month, start, end) => locale === 'es' || locale === 'pt' || locale === 'fr'
    ? `${start}${end ? `–${end}` : ''} de ${months[Number(month) - 1]}`
    : `${MONTHS.en[Number(month) - 1]} ${start}${end ? `–${end}` : ''}`);
  return dated.replace(/(\d{1,2})月（春季）/g, (_, month) => `${months[Number(month) - 1]} (${locale === 'es' ? 'primavera' : locale === 'pt' ? 'primavera' : locale === 'fr' ? 'printemps' : locale === 'de' ? 'Frühjahr' : locale === 'ja' ? '春' : 'spring'})`).replace(/(\d{1,2})月（秋季）/g, (_, month) => `${months[Number(month) - 1]} (${locale === 'es' ? 'otoño' : locale === 'pt' ? 'outono' : locale === 'fr' ? 'automne' : locale === 'de' ? 'Herbst' : locale === 'ja' ? '秋' : 'autumn'})`).replace(/(\d{1,2})月/g, (_, month) => months[Number(month) - 1]).replace(/待定|待确认|具体/g, locale === 'es' ? 'Por confirmar' : locale === 'pt' ? 'A confirmar' : locale === 'fr' ? 'À confirmer' : locale === 'de' ? 'Noch zu bestätigen' : locale === 'ja' ? '確認中' : 'To be confirmed').replace(/[\u3400-\u9fff]+/g, locale === 'es' ? 'por confirmar' : locale === 'pt' ? 'a confirmar' : locale === 'fr' ? 'à confirmer' : locale === 'de' ? 'noch zu bestätigen' : locale === 'ja' ? '確認中' : 'to be confirmed');
}
